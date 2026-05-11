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
        private readonly IGenericRepository<AvailabilityDate> _availabilityRepo;
        private readonly IGenericRepository<Notification> _notificationRepo;
        private readonly INotificationService _notificationService;

        public BorrowRequestService(IGenericRepository<User> userRepo, IGenericRepository<Book> bookRepo, IGenericRepository<BorrowRequest> borrowRequest,INotificationService NotificationService, IGenericRepository<AvailabilityDate> availabilityRepo,IGenericRepository<Notification> notificationRepo)
        {

            _userRepo = userRepo;
            _bookRepo = bookRepo;
            _borrowRequest = borrowRequest;
            _notificationService = NotificationService;
            _availabilityRepo = availabilityRepo;
            _notificationRepo = notificationRepo;

        }
        public async Task<bool> IsBorrowRequestExists(int readerId, int bookId)
        {
            var borrowReq = await _borrowRequest.GetFirstOrDefaultAsync(
                a => a.ReaderId == readerId && a.BookId == bookId
            );

            return borrowReq != null;
        }
        public async Task sendBorrowRequest(int readerId, int bookId, int chosenDuration)
        {
            var reader = await _userRepo.GetByIdAsync(readerId);
            var book = await _bookRepo.GetByIdAsync(bookId);
            var availability = await _availabilityRepo.GetFirstOrDefaultAsync(
                criteria: a => a.Duration == chosenDuration && a.BookId == bookId
            );

            if (await IsBorrowRequestExists(readerId, bookId))
                throw new Exception("This request already exists");

            if (reader == null)
                throw new Exception("User not found");

            if (reader.Role != Role.READER)
                throw new Exception("Only reader can send borrow request");

            if (book == null)
                throw new Exception("Book not found");

            if (!await IsBookAvailable(bookId))
                throw new Exception("Book is currently borrowed");

            if (availability == null)
                throw new Exception("Book duration not available");

            var bookRequest = new BorrowRequest
            {
                ReaderId = readerId,
                BookId = bookId,
                AvailabilityDate = availability
            };

            await _borrowRequest.AddAsync(bookRequest);
            await _borrowRequest.SaveAsync();

            // ✅ FIX: use already-loaded `reader` variable, NOT bookRequest.Reader (null after save)
            await _notificationService.SendNotificationAsync(
                receiverId: book.OwnerId,   // ← only the OWNER receives this
                senderId: readerId,
                message: $"You have a new borrow request on book {book.Title} from {reader.Name}",
                type: NotificationType.BORROW_REQUEST,
                borrowRequestId: bookRequest.Id,
                bookId: book.Id
            );
        }
        public async Task<IEnumerable<BorrowRequest>> GetPendingBorrowRequests(int ownerId)
        {
            var borrowRequests = await _borrowRequest.GetAllAsync(
                br => br.Book.OwnerId == ownerId && br.Status == BorrowRequestStatus.PENDING,
                includes: new[] { "Reader", "AvailabilityDate" ,"Book"}
            );

            if (borrowRequests == null || !borrowRequests.Any())
                throw new Exception("No borrow requests");

            return borrowRequests;
        }
        public async Task<bool> IsBookAvailable(int bookId)
        {
            var activeBorrow = await _borrowRequest.GetFirstOrDefaultAsync(
                br => br.BookId == bookId &&
                      br.Status == BorrowRequestStatus.ACCEPTED &&
                      br.EndedAt > DateTime.Now
            );

            return activeBorrow == null;
        }
        public async Task ReturnBook(int bookId, int userId)
        {
            var activeBorrow = await _borrowRequest.GetFirstOrDefaultAsync(
                br => br.BookId == bookId &&
                      br.Status == BorrowRequestStatus.ACCEPTED &&
                      br.EndedAt > DateTime.Now
            );

            if (activeBorrow == null)
                throw new Exception("No active borrow");

            if (activeBorrow.ReaderId != userId)
                throw new Exception("Not your borrow");

     
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
                includes: new[] { "Book", "Book.Owner", "AvailabilityDate" }
            );

            if (borrowRequest == null)
                throw new Exception("Borrow request not found");

            var book = borrowRequest.Book;
            if (book == null)
                throw new Exception("Book not found");

            if (book.BorrowStatus == BookStatus.BORROWED)
                throw new Exception("Book already borrowed");

            var now = DateTime.Now;

            borrowRequest.Status = BorrowRequestStatus.ACCEPTED;
            borrowRequest.RespondedAt = now;

            if (borrowRequest.AvailabilityDate != null)
            {
                borrowRequest.EndedAt = now.AddDays(borrowRequest.AvailabilityDate.Duration);
            }
            

            

            

            book.CurrentBorrowerId = borrowRequest.ReaderId;
            book.BorrowStatus = BookStatus.BORROWED;

            await _borrowRequest.UpdateAsync(borrowRequest);
            await _bookRepo.UpdateAsync(book);

            var otherRequests = await _borrowRequest.GetAllAsync(
                r => r.BookId == book.Id && r.Id != borrowRequestId
            );

            foreach (var r in otherRequests)
            {
                r.Status = BorrowRequestStatus.REJECTED;
                r.RespondedAt = now;
                await _borrowRequest.UpdateAsync(r);
                await _borrowRequest.SaveAsync();
            }

       

            foreach (var r in otherRequests)
            {
                await _notificationService.SendNotificationAsync(
                    receiverId: r.ReaderId,
                    senderId: ownerId,
                    message: $"Your borrow request on book {book.Title} was rejected by {owner.Name}",
                    type: NotificationType.BORROW_REJECTED,
                    borrowRequestId: r.Id,
                    bookId: book.Id
                );
            }

            await _notificationService.SendNotificationAsync(
                receiverId: borrowRequest.ReaderId,
                senderId: ownerId,
                message: $"Your borrow request on book {book.Title} has been accepted by {owner.Name}",
                type: NotificationType.BORROW_ACCEPTED,
                borrowRequestId: borrowRequest.Id,
                bookId: book.Id
            );
        }
        public async Task ReleaseExpiredBorrows()
        {
            var expiredBorrows = await _borrowRequest.GetAllAsync(
                br => br.Status == BorrowRequestStatus.ACCEPTED &&
                      br.EndedAt <= DateTime.Now,
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
         
            var owner = await _userRepo.GetFirstOrDefaultAsync(
                criteria: u => u.Id == ownerId
            );

            if (owner == null)
                throw new Exception("User not found");

            if (owner.Role != Role.BOOK_OWNER)
                throw new Exception("Only owners can reject borrow requests");

         
            var borrowRequest = await _borrowRequest.GetFirstOrDefaultAsync(
                criteria: br => br.Id == borrowRequestId,
                includes: new[] { "Book", "Reader" },
                tracked: true
            );

            if (borrowRequest == null)
                throw new Exception("Borrow request not found");

      
            borrowRequest.Status = BorrowRequestStatus.REJECTED;
            borrowRequest.RespondedAt = DateTime.Now;
            if (borrowRequest == null)
                throw new Exception("borrowRequest is null");

            if (_notificationService == null)
                throw new Exception("notificationService is null");

            if (borrowRequest.ReaderId == null)
                throw new Exception("ReaderId is null");
         
            await _borrowRequest.SaveAsync();

    
            await _notificationService.SendNotificationAsync(
                receiverId: borrowRequest.ReaderId,
                senderId: ownerId,
                message: $"Your borrow request on book {borrowRequest.Book.Title} has been rejected",
                type: NotificationType.BORROW_REJECTED,
                borrowRequestId: borrowRequest.Id,
                bookId: borrowRequest.BookId
            );
        }

        public async Task<IEnumerable<BorrowRequest>> RequestsSentByUser(int userId)
        {
            var reader = await _userRepo.GetFirstOrDefaultAsync(
    criteria: u => u.Id == userId
);


            if (reader == null)
                throw new Exception("User not found");

            var requests = await _borrowRequest.GetAllAsync(
              br => br.ReaderId == userId,
              includes: new[] { "Book" , "AvailabilityDate" }
          );
            return requests;
        }
        public async Task CancelBorrowRequest(int userId ,int borrowRequestId)
        {
            var reader = await _userRepo.GetFirstOrDefaultAsync(
               criteria: u => u.Id == userId
           );


            if (reader == null)
                throw new Exception("User not found");

            if (reader.Role != Role.READER)
                throw new Exception("Only Reader can reject borrow requests");


            var borrowRequest = await _borrowRequest.GetFirstOrDefaultAsync(
                criteria: br => br.Id == borrowRequestId,
                includes: new[] { "Book", "Reader" ,"Notifications"},
                tracked: true
            );

            if (borrowRequest == null)
                throw new Exception("Borrow request not found");


       
            foreach(var n in borrowRequest.Notifications)
            {
               await _notificationRepo.DeleteByIdAsync(n.Id);

            }
            await _borrowRequest.DeleteByIdAsync(borrowRequestId);

 
            await _borrowRequest.SaveAsync();


      
        }
    }
    
}
