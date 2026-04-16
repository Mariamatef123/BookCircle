using BookCircle.Data.Models;

namespace BookCircle.Data.Repositories.Intefaces
{
    public interface IReactionRepository
    {
        Task<Reaction?> GetByIdAsync(int bookId, int userId);
        Task SaveAsync();
    }
}
