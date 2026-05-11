
using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs.Books;
using BookCircle.DTOs.Users;
using BookCircle.Enum;
using BookCircle.Enums;
using BookCircle.Helpers;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Extensions;
using System.Linq;

using static System.Reflection.Metadata.BlobBuilder;
using AvailabilityDateDTO = BookCircle.DTOs.Books.AvailabilityDateDTO;

namespace BookCircle.Services.Implementations
{
    public class BookService : IBookService
    {

        private readonly IGenericRepository<Book> _bookRepo;
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<BorrowRequest> _borrowRequest;
        //private readonly IBookRepository _bookRepository;
        private readonly INotificationService _notificationService;
        private readonly IGenericRepository<AvailabilityDate> _availabilityRepo;
        private readonly IGenericRepository<Notification> _notificationRepo;


        public BookService(IGenericRepository<Book> bookRepo, IGenericRepository<User> userRepo, INotificationService notificationService, IGenericRepository<BorrowRequest> borrowRequest, IGenericRepository<AvailabilityDate> availabilityRepo, IGenericRepository<Notification> notificationRepo)
        {
            _bookRepo = bookRepo;
            _userRepo = userRepo;
            //_bookRepository = bookRepository;
            _notificationService = notificationService;
            _borrowRequest = borrowRequest;
            _availabilityRepo = availabilityRepo;
            _notificationRepo = notificationRepo;
        }
        public async Task<BookResponseDTO> CreateBookPostAsync(BookRequestDTO dto, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.BOOK_OWNER || user.IsApproved == false)
                throw new Exception("Only Book Owners can create books");



            var book = new Book
            {
                Title = dto.Title,
                Genre = dto.Genre,
                ISBN = dto.ISBN,
                Language = dto.Language,
                BorrowPrice = dto.BorrowPrice,
                PublicationDate = dto.PublicationDate,
                OwnerId = user.Id,
           
                Description = dto.Description,
             

                AvailabilityDates = dto.AvailabilityDates
                    .Select(d => new AvailabilityDate
                    {
                       Duration=d.Duration,
                    })
                .ToList()
            };

            if (dto.CoverImage != null)
            {
                var result = UploadHandler.Upload(dto.CoverImage, "Book");
                if (!string.IsNullOrEmpty(result.ErrorMessage))
                {
                    throw new Exception
                     (result.ErrorMessage);

                }
                book.CoverImage = result.FileName;

            }
            await _bookRepo.AddAsync(book);
            await _bookRepo.SaveAsync();

            return new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,
                Genre = book.Genre,
                ISBN = book.ISBN,
                Language = book.Language,

                BorrowPrice = book.BorrowPrice,
                BorrowStatus = book.BorrowStatus.ToString(),

                PublicationDate = book.PublicationDate,
                Status = book.Status.ToString(),
                Description=book.Description,
               

                CoverImage = book.CoverImage != null
                    ? book.CoverImage
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                      Duration=a.Duration,
                    })
                    .ToList()
            };
        }
        public async Task<IEnumerable<BookResponseDTO>> GetAllAcceptedBook()
        {
            var books = await _bookRepo.GetAllAsync(
                criteria: b => b.Status == PostStatus.ACCEPTED,   
                includes: new[] { "AvailabilityDates","Owner" }
            );

            return books.Select(b => new BookResponseDTO
            {
                Id = b.Id,
                Title = b.Title,
                Genre = b.Genre,
                ISBN = b.ISBN,
                Language = b.Language,
                BorrowPrice = b.BorrowPrice,
                BorrowStatus = b.BorrowStatus.ToString(),
                Description = b.Description,
             
                PublicationDate = b.PublicationDate,
                Status = b.Status.ToString(),
                CoverImage = b.CoverImage != null
                    ? b.CoverImage
                    : null,

                AvailabilityDates = b.AvailabilityDates != null
                    ? b.AvailabilityDates.Select(a => new AvailabilityDateDTO
                    {
                        Duration = a.Duration
                    }).ToList()
                    : new List<AvailabilityDateDTO>(),
                Owner = b.Owner == null
    ? null
    : new UserDTO
    {
        Id = b.Owner.Id,
        Name = b.Owner.Name,
        Role = b.Owner.Role.ToString()
    }
            });
        }
        public async Task<BookResponseDTO> DeleteBookById(int userId, int bookId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.BOOK_OWNER || user.IsApproved == false)
                throw new Exception("Only Book Owners can delete book");

            var book = await _bookRepo.GetFirstOrDefaultAsync(
                b => b.Id == bookId,
                include: q => q
                    .Include(b => b.AvailabilityDates)
                    .Include(b => b.Owner)
            );

            if (book == null)
                throw new Exception("Book not found");

            if (book.BorrowStatus == Enums.BookStatus.BORROWED)
                throw new Exception("Can't delete borrowed books");

            var availabilityIds = book.AvailabilityDates.Select(a => a.Id).ToList();

      
            var borrowRequests = await _borrowRequest
                .GetAllAsync(br => availabilityIds.Contains(br.AvailabilityDateId));

            var borrowRequestIds = borrowRequests.Select(b => b.Id).ToList();

       
            if (borrowRequestIds.Any())
            {
                var notifications = await _notificationRepo
                    .GetAllAsync(n =>
                        n.BorrowRequestId.HasValue &&
                        borrowRequestIds.Contains(n.BorrowRequestId.Value)
                    );

                if (notifications.Any())

                     _notificationRepo.RemoveRange(notifications);
                await _notificationRepo.SaveAsync();
            }

         
            if (borrowRequests.Any())
                 _borrowRequest.RemoveRange(borrowRequests);
            await _borrowRequest.SaveAsync();

   
            if (book.AvailabilityDates.Any())
                 _availabilityRepo.RemoveRange(book.AvailabilityDates);
            await _availabilityRepo.SaveAsync();

           
            await _bookRepo.DeleteByIdAsync(book.Id);
            await _bookRepo.SaveAsync();
          

            return new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,
                Genre = book.Genre,
                ISBN = book.ISBN,
                Language = book.Language,
                Description = book.Description,
                BorrowPrice = book.BorrowPrice,
                BorrowStatus = book.BorrowStatus.ToString(),
                PublicationDate = book.PublicationDate,
                Status = book.Status.ToString(),

                CoverImage = book.CoverImage != null
                    ? book.CoverImage
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        Duration = a.Duration
                    }).ToList(),

                Owner = book.Owner == null
                    ? null
                    : new UserDTO
                    {
                        Id = book.Owner.Id,
                        Name = book.Owner.Name,
                        Role = book.Owner.Role.ToString()
                    }
            };
        }
        public async Task<BookResponseDTO> UpdateBookAsync(int bookId, BookRequestDTO dto, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.BOOK_OWNER || user.IsApproved == false)
                throw new Exception("Only Book Owners can update books");

            var book = await _bookRepo.GetFirstOrDefaultAsync(
                b => b.Id == bookId,
                include: q => q
                    .Include(b => b.AvailabilityDates)
                    .Include(b => b.Owner)
            );

            if (book == null)
                throw new Exception("Book not found");

            if (!string.IsNullOrWhiteSpace(dto.Title))
                book.Title = dto.Title;

            if (!string.IsNullOrWhiteSpace(dto.Genre))
                book.Genre = dto.Genre;

            if (!string.IsNullOrWhiteSpace(dto.ISBN))
                book.ISBN = dto.ISBN;

            if (!string.IsNullOrWhiteSpace(dto.Language))
                book.Language = dto.Language;

            if (dto.BorrowPrice > 0)
                book.BorrowPrice = dto.BorrowPrice;

            if (dto.PublicationDate != default)
                book.PublicationDate = dto.PublicationDate;

            if (!string.IsNullOrWhiteSpace(dto.Description))
                book.Description = dto.Description;

          
            book.OwnerId = userId;

    
            if (dto.AvailabilityDates != null && dto.AvailabilityDates.Any())
            {
             
                var availabilityIds = book.AvailabilityDates
                    .Select(a => a.Id)
                    .ToList();

                var borrowRequests = await _borrowRequest
                    .GetAllAsync(br => availabilityIds.Contains(br.AvailabilityDateId));

                var borrowRequestIds = borrowRequests.Select(br => br.Id).ToList();

                if (borrowRequestIds.Any())
                {

                    var notifications = await _notificationRepo
            .GetAllAsync(n =>
                n.BorrowRequestId != null &&
                borrowRequestIds.Contains(n.BorrowRequestId.Value)
            );

                    if (notifications.Any())
                         _notificationRepo.RemoveRange(notifications);
                }

            
                if (borrowRequests.Any())
                     _borrowRequest.RemoveRange(borrowRequests);

                if (book.AvailabilityDates.Any())
                     _availabilityRepo.RemoveRange(book.AvailabilityDates);

                book.AvailabilityDates.Clear();

                foreach (var d in dto.AvailabilityDates)
                {
                    book.AvailabilityDates.Add(new AvailabilityDate
                    {
                        Duration = d.Duration,
                        BookId = book.Id
                    });
                }
            }
            await _bookRepo.UpdateAsync(book);
            await _bookRepo.SaveAsync();

            // Get the absolute path
         

            return new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,
                Genre = book.Genre,
                ISBN = book.ISBN,
                Language = book.Language,
                BorrowPrice = book.BorrowPrice,
                BorrowStatus = book.BorrowStatus.ToString(),
                PublicationDate = book.PublicationDate,
                Status = book.Status.ToString(),
                Description = book.Description,

                CoverImage = book.CoverImage != null
                    ? book.CoverImage
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        Duration = a.Duration
                    }).ToList(),

                Owner = book.Owner == null
                    ? null
                    : new UserDTO
                    {
                        Id = book.Owner.Id,
                        Name = book.Owner.Name,
                        Role = book.Owner.Role.ToString()
                    }
            };
        }
        public async Task<IEnumerable<BookResponseDTO>> GetAllBooks(int ownerId)
        {
            var user = await _userRepo.GetByIdAsync(ownerId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.BOOK_OWNER || !user.IsApproved)
                throw new Exception("Only Book Owners can show their books");

            var books = await _bookRepo.GetAllAsync(
        criteria: b => b.OwnerId == ownerId,
        includes: new[] { "AvailabilityDates","Owner" }
    );

            if (books == null || !books.Any())
                return new List<BookResponseDTO>();

            return books.Select(static book => new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,
                Genre = book.Genre,
                ISBN = book.ISBN,
                Language = book.Language,
                Description = book.Description,
         

                BorrowPrice = book.BorrowPrice,
                BorrowStatus = book.BorrowStatus.ToString(),

                PublicationDate = book.PublicationDate,
                Status = book.Status.ToString(),

                CoverImage = book.CoverImage != null
                    ? book.CoverImage
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        Duration = a.Duration,
                    })
                    .ToList(),
                Owner = book.Owner == null
    ? null
    : new UserDTO
    {
        Id = book.Owner.Id,
        Name = book.Owner.Name,
        Role = book.Owner.Role.ToString()
    }
           
        });
        }

       public async Task AcceptPost(int bookId, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.ADMIN)
                throw new Exception("Only  admins can accept book posts");

            var book = await _bookRepo.GetByIdAsync(bookId);

            if (book == null)
                throw new Exception("Book not found");
            book.Status = PostStatus.ACCEPTED;
            await _bookRepo.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: book.OwnerId,
    senderId: userId,
    message: "Your book has been approved",
    type: NotificationType.BOOK_APPROVED,
    bookId: book.Id
);
        }
        public async Task RejectPost(int bookId, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.ADMIN)
                throw new Exception("Only  admins can reject book posts");

            var book = await _bookRepo.GetByIdAsync(bookId);

            if (book == null)
                throw new Exception("Book not found");
            book.Status = PostStatus.REJECTED;
            await _notificationService.SendNotificationAsync(
    receiverId: book.OwnerId,
    senderId: userId,
    message: "Your book has been rejected",
    type: NotificationType.BOOK_REJECTED,
    bookId: book.Id
);
            book.Notifications.Clear();
            _bookRepo.Delete(book);
            await _bookRepo.SaveAsync();
        }



        public async Task<IEnumerable<BookResponseDTO>> GetPendingPosts(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.ADMIN)
                throw new Exception("Only Admin can view pending posts");

            var books = await _bookRepo.GetAllAsync(
        criteria: b => b.Status == PostStatus.PENDING && b.BorrowStatus==BookStatus.AVAILABLE,
        includes: new[] { "AvailabilityDates","Owner" }
    );

            if (books == null || !books.Any())
                return new List<BookResponseDTO>();

            return books.Select(book => new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,
                Genre = book.Genre,
                ISBN = book.ISBN,
                Language = book.Language,
                Description = book.Description,
              
                BorrowPrice = book.BorrowPrice,
                BorrowStatus = book.BorrowStatus.ToString(),

                PublicationDate = book.PublicationDate,
                Status = book.Status.ToString(),

                CoverImage = book.CoverImage != null
                    ? book.CoverImage
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        Duration = a.Duration,
                    }).ToList(),
                Owner = book.Owner == null
    ? null
    : new UserDTO
    {
        Id = book.Owner.Id,
        Name = book.Owner.Name,
        Role = book.Owner.Role.ToString()
    }
            });
        }


        public async Task<object> SearchBooksAsync(
            string? title,
            string? genre,
            string? language,
            decimal? maxPrice,
            int pageNumber,
            int pageSize,
            bool availableOnly)
        {
            var titleLower = title?.Trim().ToLower();
            var genreLower = genre?.Trim().ToLower();
            var languageLower = language?.Trim().ToLower();

            var query = _bookRepo.GetQueryable()
                .Include("AvailabilityDates")
                .Include("Owner")
                .Where(b =>
                    b.Status == PostStatus.ACCEPTED &&
                    (string.IsNullOrEmpty(titleLower) || b.Title.ToLower().Contains(titleLower)) &&
                    (string.IsNullOrEmpty(genreLower) || b.Genre.ToLower().Contains(genreLower)) &&
                    (string.IsNullOrEmpty(languageLower) || b.Language.ToLower().Contains(languageLower)) &&
                    (!maxPrice.HasValue || b.BorrowPrice <= maxPrice.Value)
                );

            // ✅ ADD THIS
            if (availableOnly)
            {
                query = query.Where(b => b.BorrowStatus == BookStatus.AVAILABLE);
            }

            var totalCount = await query.CountAsync();

            var books = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Where(b => b.Status == PostStatus.ACCEPTED)
                .ToListAsync();

            return new
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Data = books.Select(book => new BookResponseDTO
                {
                    Id = book.Id,
                    Title = book.Title,
                    Genre = book.Genre,
                    ISBN = book.ISBN,
                    Language = book.Language,
                    Description = book.Description,
                    BorrowPrice = book.BorrowPrice,
                    BorrowStatus = book.BorrowStatus.ToString(),
                    PublicationDate = book.PublicationDate,
                    Status = book.Status.ToString(),
                    CoverImage = book.CoverImage,
                    AvailabilityDates = book.AvailabilityDates?
                        .Select(a => new AvailabilityDateDTO { Duration = a.Duration })
                        .ToList() ?? new List<AvailabilityDateDTO>(),
                    Owner = book.Owner == null ? null : new UserDTO
                    {
                        Id = book.Owner.Id,
                        Name = book.Owner.Name,
                        Role = book.Owner.Role.ToString()
                    }
                })
            };
        }
        public async Task UpdateBookStatuses()
        {
            var books = await _bookRepo.GetQueryable()
                .Include(b => b.BorrowRequests)
                .ToListAsync();

            var now = DateTime.Now; // ✅ consistent time source

            foreach (var book in books)
            {
                var activeBorrow = book.BorrowRequests?
                    .FirstOrDefault(br =>
                        br.Status == BorrowRequestStatus.ACCEPTED &&
                        br.EndedAt > now);

                Console.WriteLine("date is " + now.ToString("yyyy-MM-dd HH:mm:ss"));

                if (activeBorrow == null)
                {
                    book.BorrowStatus = BookStatus.AVAILABLE;
                    book.CurrentBorrowerId = null;
                    await _bookRepo.UpdateAsync(book);
                }
                else
                {
                    book.BorrowStatus = BookStatus.BORROWED;
                }
            }
          
            await _bookRepo.SaveAsync();
        }
        public async Task<object> GetBooks(int pageNumber, int pageSize, bool availableOnly)
        {
            var query = _bookRepo.GetQueryable();
          
            // ✅ filter first
            if (availableOnly)
            {
                query = query.Where(b => b.BorrowStatus == BookStatus.AVAILABLE);
            }

            var totalCount = await query.Where(b => b.Status == PostStatus.ACCEPTED).CountAsync();

            var books = await query
                .Include(b => b.Owner)
                .Include(b => b.AvailabilityDates)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                 .Where(b => b.Status == PostStatus.ACCEPTED)
                .Select(book => new BookResponseDTO
                {
                    Id = book.Id,
                    Title = book.Title,
                    Genre = book.Genre,
                    ISBN = book.ISBN,
                    Language = book.Language,
                    Description = book.Description,
                    BorrowPrice = book.BorrowPrice,
                    BorrowStatus = book.BorrowStatus.ToString(),
                    PublicationDate = book.PublicationDate,
                    Status = book.Status.ToString(),
                    CoverImage = book.CoverImage,

                    AvailabilityDates = book.AvailabilityDates
                        .Select(a => new AvailabilityDateDTO
                        {
                            Duration = a.Duration
                        })
                        .ToList(),

                    Owner = book.Owner == null
                        ? null
                        : new UserDTO
                        {
                            Id = book.Owner.Id,
                            Name = book.Owner.Name,
                            Role = book.Owner.Role.ToString()
                        }
                })
                .ToListAsync();

            return new
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                AvailableOnly = availableOnly,
                Data = books
            };
        }
    }
}