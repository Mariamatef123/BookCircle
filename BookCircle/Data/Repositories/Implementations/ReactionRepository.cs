using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Data.Repositories.Implementations
{
    public class ReactionRepository : IReactionRepository
    {
        private readonly DataContext _context;

        public ReactionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Reaction?> GetByIdAsync(int bookId, int userId)
        {
            return await _context.Reactions
                .FirstOrDefaultAsync(r => r.BookId == bookId && r.UserId == userId);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
