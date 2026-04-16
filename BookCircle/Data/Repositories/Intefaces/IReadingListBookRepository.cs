using BookCircle.Data.Models;

namespace BookCircle.Data.Repositories.Intefaces
{
    public interface IReadingListBookRepository
    {
        Task<bool> ExistsAsync(int readingListId, int bookId);
        Task<ReadingListBook?> GetAsync(int readingListId, int bookId);
        Task<List<ReadingListBook>> GetByReadingListIdAsync(int readingListId);

    }
}
