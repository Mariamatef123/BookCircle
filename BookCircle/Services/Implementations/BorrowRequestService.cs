using BookCircle.Data;
using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Enum;
using BookCircle.Enums;
using BookCircle.Services.Interfaces;

namespace BookCircle.Services.Implementations
{
    public class BorrowRequestService : IBorrowRequestService


    {
        private readonly DataContext _context;

        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Book> _bookRepo;
        private readonly IGenericRepository<BorrowRequest> _borrowRequest;
        private readonly INotificationService _notificationService;

        public BorrowRequestService(IGenericRepository<User> userRepo, IGenericRepository<Book> bookRepo, IGenericRepository<BorrowRequest> borrowRequest,INotificationService _NotificationService)
        {

            _userRepo = userRepo;
            _bookRepo = bookRepo;
            _borrowRequest = borrowRequest;
            _notificationService = _NotificationService;
        }

        public async Task sendBorrowRequest(int readerId, int bookId, int chosenDuration)
        {
            var reader = await _userRepo.GetByIdAsync(readerId);
            var book = await _bookRepo.GetByIdAsync(bookId);


            if (reader == null)
                throw new Exception("User not found");

            if (reader.Role != Role.READER)
                throw new Exception("Only  reader can send borrow request");

            if (book == null)

                throw new Exception("book not found");
            if (!await IsBookAvailable(bookId))
                throw new Exception("Book is currently borrowed");

            BorrowRequest bookRequest = new BorrowRequest();
            bookRequest.ReaderId = readerId;
            bookRequest.BookId = bookId;
            bookRequest.AvailabilityDate.Duration = chosenDuration;

            await _borrowRequest.AddAsync(bookRequest);
            await _borrowRequest.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: book.OwnerId,
    senderId: readerId,
    message: "You have a new borrow request",
    type: NotificationType.BORROW_REQUEST,
    borrowRequestId: bookRequest.Id,
    bookId: book.Id
);
        }
        public async Task<bool> IsBookAvailable(int bookId)
        {
            var activeBorrow = await _borrowRequest.GetFirstOrDefaultAsync(
                br => br.BookId == bookId &&
                      br.Status == BorrowRequestStatus.ACCEPTED &&
                      br.EndedAt > DateTime.UtcNow
            );

            return activeBorrow == null;
        }
        public async Task ReturnBook(int bookId, int userId)
        {
            var activeBorrow = await _borrowRequest.GetFirstOrDefaultAsync(
                br => br.BookId == bookId &&
                      br.Status == BorrowRequestStatus.ACCEPTED &&
                      br.EndedAt > DateTime.UtcNow
            );

            if (activeBorrow == null)
                throw new Exception("No active borrow");

            if (activeBorrow.ReaderId != userId)
                throw new Exception("Not your borrow");

            // 👇 user manually returned the book
            activeBorrow.Status = BorrowRequestStatus.RETURNED;
            activeBorrow.Book.BorrowStatus = BookStatus.AVAILABLE;
            var book = await _bookRepo.GetByIdAsync(bookId);
            book.CurrentBorrowerId = null;

            await _borrowRequest.UpdateAsync(activeBorrow);
            await _bookRepo.UpdateAsync(book);
            await _borrowRequest.SaveAsync();
        }

        public async Task AcceptBorrowRequest(int ownerId, int borrowRequestId)
        {
            var owner = await _userRepo.GetByIdAsync(ownerId);
            if (owner == null)
                throw new Exception("User not found");
            if (owner.Role != Role.BOOK_OWNER)
                throw new Exception("Only owners can accept borrow requests");

            var borrowRequest = await _borrowRequest.GetFirstOrDefaultAsync(
        criteria: br => br.Id == borrowRequestId,
        includes: new[] { "Book" }
    );
            if (borrowRequest == null)
                throw new Exception("Borrow request not found");

            var book = borrowRequest.Book;
            if (book == null)
                throw new Exception("Book not found");
            if (book.BorrowStatus == BookStatus.BORROWED)
                throw new Exception("Book already borrowed");


            borrowRequest.Status = BorrowRequestStatus.ACCEPTED;
            borrowRequest.RespondedAt = DateTime.UtcNow;

            if (borrowRequest.RespondedAt.HasValue)
            {
                borrowRequest.EndedAt = borrowRequest.RespondedAt.Value
                    .AddDays(borrowRequest.AvailabilityDate.Duration);
            }


            book.CurrentBorrowerId = borrowRequest.ReaderId;
            book.BorrowStatus = BookStatus.BORROWED;

            await _borrowRequest.UpdateAsync(borrowRequest);
            await _bookRepo.UpdateAsync(book);

            var otherRequests = await _borrowRequest
               .GetAllAsync(
        criteria: r => r.BookId == book.Id && r.Id != borrowRequestId
    );

            foreach (var r in otherRequests)
            {
                r.Status = BorrowRequestStatus.REJECTED;
                r.RespondedAt = DateTime.UtcNow;
                await _borrowRequest.UpdateAsync(r);
            }

            await _borrowRequest.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: borrowRequest.ReaderId,
    senderId: ownerId,
    message: "Your borrow request has been accepted",
    type: NotificationType.BORROW_ACCEPTED,
    borrowRequestId: borrowRequest.Id,
    bookId: book.Id
);
        }



        public async Task ReleaseExpiredBorrows()
        {
            var expiredBorrows = await _borrowRequest.GetAllAsync(
                br => br.Status == BorrowRequestStatus.ACCEPTED &&
                      br.EndedAt <= DateTime.UtcNow,
                includes: new[] { "Book" }
            );

            foreach (var borrow in expiredBorrows)
            {
                borrow.Status = BorrowRequestStatus.EXPIRED;

                if (borrow.Book != null)
                {
                    borrow.Book.BorrowStatus = BookStatus.AVAILABLE;
                    borrow.Book.CurrentBorrowerId = null;
                }

                await _borrowRequest.UpdateAsync(borrow);
                await _bookRepo.UpdateAsync(borrow.Book);
            }

            await _borrowRequest.SaveAsync();
        }



        public async Task RejectBorrowRequest(int ownerId, int borrowRequestId)
        {
            // 1. Get owner
            var owner = await _userRepo.GetFirstOrDefaultAsync(
                criteria: u => u.Id == ownerId
            );

            if (owner == null)
                throw new Exception("User not found");

            if (owner.Role != Role.BOOK_OWNER)
                throw new Exception("Only owners can reject borrow requests");

            // 2. Get borrow request with includes
            var borrowRequest = await _borrowRequest.GetFirstOrDefaultAsync(
                criteria: br => br.Id == borrowRequestId,
                includes: new[] { "Book", "Reader" },
                tracked: true
            );

            if (borrowRequest == null)
                throw new Exception("Borrow request not found");

            // 3. Update entity
            borrowRequest.Status = BorrowRequestStatus.REJECTED;
            borrowRequest.RespondedAt = DateTime.UtcNow;
            if (borrowRequest == null)
                throw new Exception("borrowRequest is null");

            if (_notificationService == null)
                throw new Exception("notificationService is null");

            if (borrowRequest.ReaderId == null)
                throw new Exception("ReaderId is null");
            // 4. Save changes
            await _borrowRequest.SaveAsync();

            // 5. Notification
            await _notificationService.SendNotificationAsync(
                receiverId: borrowRequest.ReaderId,
                senderId: ownerId,
                message: "Your borrow request has been rejected",
                type: NotificationType.BORROW_REJECTED,
                borrowRequestId: borrowRequest.Id,
                bookId: borrowRequest.BookId
            );
        }

    }
}
