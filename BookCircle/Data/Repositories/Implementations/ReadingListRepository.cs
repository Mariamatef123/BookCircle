using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Data.Repositories.Implementations
{
    public class ReadingListRepository : IReadingListRepository
    {
        private readonly DataContext _context;

        public ReadingListRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<ReadingList?> GetReadingListWithBooks(int readingListId)
        {
            return await _context.ReadingLists
                .Include(r => r.ReadingListBooks)
                    .ThenInclude(rb => rb.Book)
                .FirstOrDefaultAsync(r => r.Id == readingListId);
        }
    }
}
