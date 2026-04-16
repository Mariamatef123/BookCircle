using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Enum;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Data.Repositories.Implementations
{
    public class BorrowRequestRepository : IBookRequestRepository

    {
        private readonly DataContext _context;

        public BorrowRequestRepository(DataContext context)
        {
            _context = context;
        }


        public async Task<BorrowRequest?> GetByIdWithBookAsync(int borrowRequestId)
        {
            return await _context.BorrowRequests
                .Include(br => br.Book)
                .FirstOrDefaultAsync(br => br.Id == borrowRequestId);
        }

        public async Task<IEnumerable<BorrowRequest>> GetOtherRequestsForBook(int bookId, int excludedRequestId)
        {
            return await _context.BorrowRequests
                .Where(r => r.BookId == bookId && r.Id != excludedRequestId)
                .ToListAsync();
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}