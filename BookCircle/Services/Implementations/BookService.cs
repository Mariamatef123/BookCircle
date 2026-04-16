
using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs.Books;
using BookCircle.Enum;
using BookCircle.Enums;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Reflection.Metadata.BlobBuilder;
using AvailabilityDateDTO = BookCircle.DTOs.Books.AvailabilityDateDTO;

namespace BookCircle.Services.Implementations
{
    public class BookService : IBookService
    {

        private readonly IRepository<Book> _bookRepo;
        private readonly IRepository<User> _userRepo;

        private readonly IBookRepository _bookRepository;
        private readonly INotificationService _notificationService;

        public BookService(IRepository<Book> bookRepo, IRepository<User> userRepo, IBookRepository bookRepository, INotificationService notificationService)
        {
            _bookRepo = bookRepo;
            _userRepo = userRepo;
            _bookRepository = bookRepository;
            _notificationService = notificationService;
        }
        public async Task<BookResponseDTO> CreateBookPostAsync(BookRequestDTO dto, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.BOOK_OWNER || user.IsApproved == false)
                throw new Exception("Only Book Owners can create books");

            byte[] imageBytes = null;

            if (dto.CoverImage != null)
            {
                using var ms = new MemoryStream();
                await dto.CoverImage.CopyToAsync(ms);
                imageBytes = ms.ToArray();
            }

            var book = new Book
            {
                Title = dto.Title,
                Genre = dto.Genre,
                ISBN = dto.ISBN,
                Language = dto.Language,
                BorrowPrice = dto.BorrowPrice,
                PublicationDate = dto.PublicationDate,
                OwnerId = user.Id,
                CoverImage = imageBytes,

                AvailabilityDates = dto.AvailabilityDates
                    .Select(d => new AvailabilityDate
                    {
                        StartDate = d.StartDate,
                        EndDate = d.EndDate
                    })
                .ToList()
            };

            ;
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

                CoverImageBase64 = book.CoverImage != null
                    ? Convert.ToBase64String(book.CoverImage)
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        StartDate = a.StartDate,
                        EndDate = a.EndDate
                    })
                    .ToList()
            };
        }
        public async Task<IEnumerable<BookResponseDTO>> GetAllAcceptedBook()
        {
            var books = await _bookRepository.GetAllAcceptedBooks();

            if (books == null)
                return new List<BookResponseDTO>();

            return books;
        }

        public async Task<BookResponseDTO> DeleteBookById(int userId, int bookId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            var book = await _bookRepo.GetByIdAsync(bookId);

            if (user == null)
                throw new Exception("User not found");
            if (book == null)
                throw new Exception("Book not found");

            if (user.Role != Role.BOOK_OWNER || user.IsApproved == false)
                throw new Exception("Only Book Owners can delete book");
            if(book.BorrowStatus==Enums.BookStatus.BORROWED)
                throw new Exception("cant delete borrowed Books");
            await _bookRepo.DeleteByIdAsync(bookId);
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

                CoverImageBase64 = book.CoverImage != null
                    ? Convert.ToBase64String(book.CoverImage)
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        StartDate = a.StartDate,
                        EndDate = a.EndDate
                    })
                    .ToList()
            };


        }

        public async Task<BookResponseDTO> UpdateBookAsync(int bookId, BookRequestDTO dto, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.BOOK_OWNER || user.IsApproved == false)
                throw new Exception("Only Book Owners can create books");

            var book = await _bookRepo.GetByIdAsync(bookId);

            if (book == null)
                throw new Exception("Book not found");


            byte[] imageBytes = null;

            if (dto.CoverImage != null)
            {
                using var ms = new MemoryStream();
                await dto.CoverImage.CopyToAsync(ms);
                imageBytes = ms.ToArray();
            }


            book.Title = dto.Title;
            book.Genre = dto.Genre;
            book.ISBN = dto.ISBN;
            book.Language = dto.Language;
            book.BorrowPrice = dto.BorrowPrice;
            book.PublicationDate = dto.PublicationDate;
            book.OwnerId = userId;
            book.CoverImage = imageBytes;

            book.AvailabilityDates.Clear();

            if (dto.AvailabilityDates != null && dto.AvailabilityDates.Any())
            {
                foreach (var d in dto.AvailabilityDates)
                {
                    book.AvailabilityDates.Add(new AvailabilityDate
                    {
                        StartDate = d.StartDate,
                        EndDate = d.EndDate,
                        BookId = book.Id
                    });
                }
            }

            await _bookRepo.UpdateAsync(book);
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

                CoverImageBase64 = book.CoverImage != null
                    ? Convert.ToBase64String(book.CoverImage)
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        StartDate = a.StartDate,
                        EndDate = a.EndDate
                    }).ToList()
            };
        }
        public async Task<IEnumerable<BookResponseDTO>> GetAllBooks(int ownerId)
        {
            var user = await _userRepo.GetByIdAsync(ownerId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.BOOK_OWNER || !user.IsApproved)
                throw new Exception("Only Book Owners can show their books");

            var books = await _bookRepository.GetBooksByOwnerIdAsync(ownerId);

            if (books == null || !books.Any())
                return new List<BookResponseDTO>();

            return books.Select(static book => new BookResponseDTO
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

                CoverImageBase64 = book.CoverImage != null
                    ? Convert.ToBase64String(book.CoverImage)
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        StartDate = a.StartDate,
                        EndDate = a.EndDate
                    })
                    .ToList()
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

            var books = await _bookRepository.GetPendingPostsAsync();

            if (books == null || !books.Any())
                return new List<BookResponseDTO>();

            return books.Select(book => new BookResponseDTO
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

                CoverImageBase64 = book.CoverImage != null
                    ? Convert.ToBase64String(book.CoverImage)
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        StartDate = a.StartDate,
                        EndDate = a.EndDate
                    }).ToList()
            });
        }


        public async Task<IEnumerable<BookResponseDTO>> SearchBooksAsync(string? genre, string? language, decimal? maxPrice)
        {
            var books = await _bookRepository.SearchBooksAsync(genre, language, maxPrice);
            return books.Select(book => new BookResponseDTO
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

                CoverImageBase64 = book.CoverImage != null
                    ? Convert.ToBase64String(book.CoverImage)
                    : null,

                AvailabilityDates = book.AvailabilityDates
                    .Select(a => new AvailabilityDateDTO
                    {
                        StartDate = a.StartDate,
                        EndDate = a.EndDate
                    }).ToList()
            });
        }
    }
}