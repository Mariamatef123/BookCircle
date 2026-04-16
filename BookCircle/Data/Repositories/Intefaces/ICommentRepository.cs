using BookCircle.Data.Models;

namespace BookCircle.Data.Repositories.Intefaces
{
    public interface ICommentRepository
    {
        Task<Comment?> GetByIdWithRepliesAsync(int commentId);
        Task<List<Comment>> GetCommentsByBookAsync(int bookId);


    }
}
