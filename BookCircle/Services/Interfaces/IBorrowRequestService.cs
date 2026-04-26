using BookCircle.Data.Models;

namespace BookCircle.Services.Interfaces
{
    public interface IBorrowRequestService
    {
        Task sendBorrowRequest(int readerId, int bookId, int ChosenDurarion);
        Task AcceptBorrowRequest(int ownerId, int borrowRequestId);
        Task RejectBorrowRequest(int ownerId, int borrowRequestId);
        public Task ReturnBook(int bookId, int userId);
        public  Task<IEnumerable<BorrowRequest>> GetPendingBorrowRequests(int ownerId);
    }
}
