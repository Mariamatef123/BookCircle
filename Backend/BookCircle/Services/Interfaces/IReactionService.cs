using BookCircle.Data.Models;

namespace BookCircle.Services.Interfaces
{
    public interface IReactionService
    {
        Task Like(int userId, int bookId);
        Task Dislike(int userId, int bookId);
        Task<IEnumerable<Reaction>> GetReactionsByBookId(int bookId);
    }
}
