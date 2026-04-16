using BookCircle.Data.Models;

namespace BookCircle.Data.Repositories.Intefaces
{
    public interface IBookRequestRepository
    {
        Task<BorrowRequest?> GetByIdWithBookAsync(int borrowRequestId);
        Task<IEnumerable<BorrowRequest>> GetOtherRequestsForBook(int bookId, int excludedRequestId);
        Task SaveAsync();
    }
}
