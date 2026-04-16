using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs.Books;
using BookCircle.Enum;
using BookCircle.Enums;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Data.Repositories.Implementations
{
    public class BookRepository : IBookRepository
    {
        protected readonly DataContext _context;
        protected readonly DbSet<Book> _db;

        public BookRepository(DataContext context)
        {
            _context = context;
            _db = context.Set<Book>();
        }
        public async Task<IEnumerable<BookResponseDTO>> GetAllAcceptedBooks()
        {
            var books = await _db
                .Include(b => b.AvailabilityDates)
                .Where(b => b.Status == PostStatus.ACCEPTED)
                .ToListAsync();

            return books.Select(b => new BookResponseDTO
            {
                Id = b.Id,
                Title = b.Title,
                Genre = b.Genre,
                ISBN = b.ISBN,
                Language = b.Language,

                BorrowPrice = b.BorrowPrice,
                BorrowStatus = b.BorrowStatus.ToString(),

                PublicationDate = b.PublicationDate,
                Status = b.Status.ToString(),

                CoverImageBase64 = b.CoverImage != null
                    ? Convert.ToBase64String(b.CoverImage)
                    : null,

                AvailabilityDates = b.AvailabilityDates
                    .Select(a => new DTOs.Books.AvailabilityDateDTO
                    {
                        StartDate = a.StartDate,
                        EndDate = a.EndDate
                    }).ToList()
            });

        }


        public async Task<IEnumerable<Book>> GetBooksByOwnerIdAsync(int ownerId)
        {
            var books = await _db
                    .Where(b => b.OwnerId == ownerId)
                    .Include(b => b.AvailabilityDates)
                    .ToListAsync();
            return books;

        }

        public async Task<IEnumerable<Book>> GetPendingPostsAsync()
        {
            return await _db
                .Where(b => b.Status == PostStatus.PENDING)
                .Include(b => b.AvailabilityDates) 
                .ToListAsync();
        }

        public async Task<Book?> GetBookWithCommentsAsync(int bookId)
        {
            return await _context.Books
                .Include(b => b.Comments)
                    .ThenInclude(c => c.Replies)
                .FirstOrDefaultAsync(b => b.Id == bookId);
        }


        public async Task<IEnumerable<Book>> SearchBooksAsync(string? genre, string? language, decimal? borrowPrice)
        {
            var query = _context.Books
     .Include(b => b.AvailabilityDates)
     .Where(b => b.BorrowStatus == BookStatus.AVAILABLE)
     .Where(b => b.Status == PostStatus.ACCEPTED)
     .AsQueryable();

            if (!string.IsNullOrEmpty(genre))
                query = query.Where(b => b.Genre.ToLower() == genre.ToLower());

            if (!string.IsNullOrEmpty(language))
                query = query.Where(b => b.Language.ToLower() == language.ToLower());

            if (borrowPrice.HasValue)
                query = query.Where(b => b.BorrowPrice <= borrowPrice.Value);

            return await query.ToListAsync();
        }
    }
}