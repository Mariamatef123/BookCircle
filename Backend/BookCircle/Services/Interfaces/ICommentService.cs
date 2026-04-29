
using BookCircle.DTOs.Comments;

namespace BookCircle.Services.Interfaces
{
    public interface ICommentService
    {
        Task AddComment(int userId, int bookId, string content);
        Task DeleteComment(int userId, int commentId);
        Task ReplyToComment(int userId, int parentId, string content);
        Task<List<CommentDTO>> GetBookCommentsAsync(int bookId);
        Task UpdateCommentAsync(int userId, int commentId, string newContent);
    }
}
