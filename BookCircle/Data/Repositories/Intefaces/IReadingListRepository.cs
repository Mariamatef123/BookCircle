using BookCircle.Data.Models;

namespace BookCircle.Data.Repositories.Intefaces
{
    public interface IReadingListRepository
    {
        Task<ReadingList?> GetReadingListWithBooks(int readingListId);
    }
}
