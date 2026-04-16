using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Data.Repositories.Implementations
{
    public class CommentRepository : ICommentRepository
    {
        private readonly DataContext _context;

        public CommentRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Comment?> GetByIdWithRepliesAsync(int commentId)
        {
            return await _context.Comments
                .Include(c => c.Replies)
                .FirstOrDefaultAsync(c => c.Id == commentId);
        }

        public async Task<List<Comment>> GetCommentsByBookAsync(int bookId)
        {
            return await _context.Comments
                .Where(c => c.BookId == bookId && c.ParentId == null) // 🔥 IMPORTANT
                .Include(c => c.Replies)
                .ToListAsync();
        }
    }
}