using BookCircle.Data.Models;
using BookCircle.DTOs.ReadingLists;
using BookCircle.Services.Interfaces;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs.Books;

namespace BookCircle.Services.Implementations
{
    public class ReadingListService : IReadingListService
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Book> _bookRepo;
        private readonly IGenericRepository<ReadingList> _readingListRepo;
        private readonly IGenericRepository<ReadingListBook> _readingListBookRepo;
        //private readonly IReadingListBookRepository _readingListBook;
        //private readonly IReadingListRepository _readingList;

        public ReadingListService(
            IGenericRepository<User> userRepo,
            IGenericRepository<ReadingList> readingListRepo,
            IGenericRepository<ReadingListBook> readingListBookRepo,
            IGenericRepository<Book> bookRepo
            //IReadingListBookRepository  readingListBook
            //IReadingListRepository readingList

            )

        {
            _userRepo = userRepo;
            _readingListRepo = readingListRepo;
            _readingListBookRepo = readingListBookRepo;
            _bookRepo = bookRepo;
            //_readingListBook = readingListBook;
            //_readingList = readingList;
        }

        public async Task<ReadingListDTO> CreateReadingListAsync(ReadingListDTO dto, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");
            if(user.Role!=Enum.Role.READER)

                throw new Exception("reader only can create readinglist");
            var readingList = new ReadingList
            {
                Name = dto.Name,
                UserId = userId,
                CreatedAt= DateTime.UtcNow,
                Description = dto.Description,
            };

            await _readingListRepo.AddAsync(readingList);
            await _readingListRepo.SaveAsync();

            return new ReadingListDTO
            {
                Name = readingList.Name,
                  CreatedAt = readingList.CreatedAt,
                  UserId= userId,
                Description = readingList.Description,
            };

        }

        public async Task AddBookToReadingList(int readingListId, int bookId)
        {
            var readingList = await _readingListRepo.GetByIdAsync(readingListId);
            if (readingList == null)
                throw new Exception("Reading list not found");

            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book == null)
                throw new Exception("Book not found");

            var exists = await _readingListBookRepo
              .AnyAsync(
            criteria: x => x.ReadingListId == readingListId && x.BookId == bookId
        );

            if (exists)
                throw new Exception("Book already exists in reading list");

            var readingListBook = new ReadingListBook
            {
                ReadingListId = readingListId,
                BookId = bookId,
                AddedAt = DateTime.UtcNow
            };

            await _readingListBookRepo.AddAsync(readingListBook);
            await _readingListBookRepo.SaveAsync();
        }

        public async Task RemoveBookFromReadingList(int readingListId, int bookId)
        {
            var readingListBook = await _readingListBookRepo.GetFirstOrDefaultAsync(
            criteria: x => x.ReadingListId == readingListId && x.BookId == bookId
        );

            if (readingListBook == null)
                throw new Exception("Book not found in reading list");

             _readingListBookRepo.Delete(readingListBook);
            await _readingListBookRepo.SaveAsync();
        }


        public async Task DeleteReadingList(int readingListId)
        {
            var readingList = await _readingListRepo.GetByIdAsync(readingListId);

            if (readingList == null)
                throw new Exception("Reading list not found");

            // delete related books first
            var items = await _readingListBookRepo.
                GetAllAsync(
            criteria: x => x.ReadingListId == readingListId
        );

            foreach (var item in items)
            {
                _readingListBookRepo.Delete(item);
            }

            await _readingListBookRepo.SaveAsync();

            // now delete reading list
            _readingListRepo.Delete(readingList);
            await _readingListRepo.SaveAsync();
        }

        public async Task<IEnumerable<ReadingListDTO>> GetAllReadingLists(int userId)
        {
            var lists = await _readingListRepo
    .FindAsync(r => r.UserId == userId);

            if (lists == null || !lists.Any())
                return new List<ReadingListDTO>();

            return lists.Select(r => new ReadingListDTO
            {
         
                Name = r.Name,
                Description=r.Description,
                CreatedAt=r.CreatedAt,
                UserId=r.UserId



            }).ToList();
        }


        public async Task<IEnumerable<BookResponseDTO>> GetBooksInReadingList(int readingListId)
        {
            var list = await _readingListRepo.GetFirstOrDefaultAsync(
                criteria: r => r.Id == readingListId,
                includes: new[] { "ReadingListBooks.Book" }
            );
            Console.WriteLine($"ReadingListBooks count: {list?.ReadingListBooks?.Count}");

            if (list == null)
                throw new Exception("Reading list not found");

            if (list.ReadingListBooks == null || !list.ReadingListBooks.Any())
                return Enumerable.Empty<BookResponseDTO>();

            return list.ReadingListBooks.Select(rb => new BookResponseDTO
            {
                Id = rb.Book.Id,
                Title = rb.Book.Title,
                Genre = rb.Book.Genre,
                ISBN = rb.Book.ISBN,
                Language = rb.Book.Language,
                BorrowPrice = rb.Book.BorrowPrice,
                BorrowStatus = rb.Book.BorrowStatus.ToString(),
                PublicationDate = rb.Book.PublicationDate,
                CoverImageBase64 = rb.Book.CoverImage != null
                    ? Convert.ToBase64String(rb.Book.CoverImage)
                    : null
            }).ToList();
        }
   
    
    
    }
}