using BookCircle.Data;
using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs;
using BookCircle.DTOs.Books;
using BookCircle.DTOs.Users;
using BookCircle.Enum;
using BookCircle.Enums;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Services.Implementations
{
    public class UserService : IUserService

    {
        private readonly DataContext _context;

        private readonly IRepository<User> _userRepo;

        private readonly IUserRepository _userRepository;
        private readonly IRepository<Book> _bookRepo;

        private readonly IRepository<BorrowRequest> _borrowRequest;
        private readonly IRepository<Reaction> _reaction;
        private readonly IReactionRepository _reactionRepo;
        private readonly IRepository<Comment> _commentRepo;


        private readonly IBookRequestRepository _borrowRequestRepo;
        private readonly INotificationService _notificationService;

        public UserService( IRepository<User> userRepo, IUserRepository userRepository, IRepository<Book> bookRepo, IRepository<BorrowRequest>borrowRequest, IBookRequestRepository borrowRequestRepo, IRepository<Reaction> reaction, IReactionRepository reactionRepo, IRepository<Comment> commentRepo, INotificationService notificationService)
        {
           
            _userRepo = userRepo;
            _userRepository = userRepository;
            _bookRepo = bookRepo;
            _borrowRequest = borrowRequest;
            _borrowRequestRepo = borrowRequestRepo;
            _reaction = reaction;
            _reactionRepo = reactionRepo;
            _commentRepo = commentRepo;
            _notificationService = notificationService;
        }
        public async Task AcceptOwner(int ownerId, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.ADMIN)
                throw new Exception("Only  admins can accept owners ");

            var owner = await _userRepo.GetByIdAsync(ownerId);

            if (owner == null)
                throw new Exception("owner not found");
            if (owner.Role != Role.BOOK_OWNER)
                throw new Exception("must be owner ");
            owner.IsApproved = true;
            await _notificationService.SendNotificationAsync(
    receiverId: ownerId,
    senderId: userId,
    message: "Your account has been approved",
    type: NotificationType.OWNER_APPROVED
);
            await _userRepo.SaveAsync();
        }

        public async Task<IEnumerable<User>> GetPendingOwners(int adminId)
        {
            var admin = await _userRepo.GetByIdAsync(adminId);

            if (admin == null)
                throw new Exception("User not found");

            if (admin.Role != Role.ADMIN)
                throw new Exception("Only Admin can view pending users");

            return await _userRepository.GetPendingOwnersAsync();

        }

        public async Task RejectOwner(int ownerId, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.ADMIN)
                throw new Exception("Only  admins can reject owners ");

            var owner = await _userRepo.GetByIdAsync(ownerId);


            if (owner == null)
                throw new Exception("owner not found");
            if (owner.Role != Role.BOOK_OWNER)
                throw new Exception("must be owner ");
            owner.IsApproved = false;
            await _notificationService.SendNotificationAsync(
    receiverId: ownerId,
    senderId: userId,
    message: "Your account has been rejected",
    type: NotificationType.OWNER_REJECTED
);
            _userRepo.Delete(owner);
          
            await _userRepo.SaveAsync();

        }
       public async Task sendBorrowRequest(int readerId,int bookId)
        {
            var reader = await _userRepo.GetByIdAsync(readerId);
            var book =await _bookRepo.GetByIdAsync(bookId);


            if (reader == null)
                throw new Exception("User not found");

            if (reader.Role != Role.READER)
                throw new Exception("Only  reader can send borrow request");

            if (book == null)
                throw new Exception("book not found");
            BorrowRequest bookRequest =new BorrowRequest();
            bookRequest.ReaderId = readerId;
            bookRequest.BookId = bookId;
          await  _borrowRequest.AddAsync(bookRequest);
          await  _borrowRequest.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: book.OwnerId,
    senderId: readerId,
    message: "You have a new borrow request",
    type: NotificationType.BORROW_REQUEST,
    borrowRequestId: bookRequest.Id,
    bookId: book.Id
);
        }

        public async Task AcceptBorrowRequest(int ownerId, int borrowRequestId)
        {
            var owner = await _userRepo.GetByIdAsync(ownerId);
            if (owner == null)
                throw new Exception("User not found");
            if (owner.Role != Role.BOOK_OWNER)
                throw new Exception("Only owners can accept borrow requests");

            var borrowRequest = await _borrowRequestRepo.GetByIdWithBookAsync(borrowRequestId);
            if (borrowRequest == null)
                throw new Exception("Borrow request not found");

            var book = borrowRequest.Book;
            if (book == null)
                throw new Exception("Book not found");
            if (book.BorrowStatus == BookStatus.BORROWED)
                throw new Exception("Book already borrowed");

           
            borrowRequest.Status = BorrowRequestStatus.ACCEPTED;
            borrowRequest.RespondedAt = DateTime.UtcNow;

            book.CurrentBorrowerId = borrowRequest.ReaderId;
            book.BorrowStatus = BookStatus.BORROWED;

            await _borrowRequest.UpdateAsync(borrowRequest);
            await _bookRepo.UpdateAsync(book);

            var otherRequests = await _borrowRequestRepo
                .GetOtherRequestsForBook(book.Id, borrowRequestId);

            foreach (var r in otherRequests)
            {
                r.Status = BorrowRequestStatus.REJECTED;
                r.RespondedAt = DateTime.UtcNow;
                await _borrowRequest.UpdateAsync(r);
            }

            await _borrowRequestRepo.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: borrowRequest.ReaderId,
    senderId: ownerId,
    message: "Your borrow request has been accepted",
    type: NotificationType.BORROW_ACCEPTED,
    borrowRequestId: borrowRequest.Id,
    bookId: book.Id
);
        }


        public async Task RejectBorrowRequest(int ownerId, int borrowRequestId)
        {
            var owner = await _userRepo.GetByIdAsync(ownerId);
            if (owner == null)
                throw new Exception("User not found");
            if (owner.Role != Role.BOOK_OWNER)
                throw new Exception("Only owners can reject borrow requests");

            var borrowRequest = await _borrowRequestRepo.GetByIdWithBookAsync(borrowRequestId);
            if (borrowRequest == null)
                throw new Exception("Borrow request not found");
            borrowRequest.Status = BorrowRequestStatus.REJECTED;
            borrowRequest.RespondedAt = DateTime.UtcNow;
            await _borrowRequest.UpdateAsync(borrowRequest);
            await _borrowRequestRepo.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: borrowRequest.ReaderId,
    senderId: ownerId,
    message: "Your borrow request has been rejected",
    type: NotificationType.BORROW_REJECTED,
    borrowRequestId: borrowRequest.Id,
    bookId: borrowRequest.BookId
);
        }
        public async Task Like(int userId, int bookId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book == null)
                throw new Exception("Book not found");

            var existing = await _reactionRepo.GetByIdAsync(bookId, userId);

            if (existing == null)
            {
                // No reaction yet → add LIKE
                await _reaction.AddAsync(new Reaction
                {
                    UserId = userId,
                    BookId = bookId,
                    Type = ReactionType.LIKE,
                    CreatedAt = DateTime.UtcNow
                });
            }
            else if (existing.Type == ReactionType.LIKE)
            {
                // Already liked → toggle off
               _reaction.Delete(existing);
            }
            else
            {
                // Had a different reaction → switch to LIKE
                existing.Type = ReactionType.LIKE;
                await _reaction.UpdateAsync(existing);
            }

            await _reactionRepo.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: book.OwnerId,
    senderId: userId,
    message: "Someone liked your book",
    type: NotificationType.BOOK_LIKED,
    bookId: book.Id
);
        }
        public async Task Dislike(int userId, int bookId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book == null)
                throw new Exception("Book not found");

            var existing = await _reactionRepo.GetByIdAsync(bookId, userId);

            if (existing == null)
            {
            
                await _reaction.AddAsync(new Reaction
                {
                    UserId = userId,
                    BookId = bookId,
                    Type = ReactionType.DISLIKE,
                    CreatedAt = DateTime.UtcNow
                });
            }
            else if (existing.Type == ReactionType.DISLIKE)
            {

                 _reaction.Delete(existing);
            }
            else
            {
       
                existing.Type = ReactionType.DISLIKE;
                await _reaction.UpdateAsync(existing);
            }

            await _reactionRepo.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: book.OwnerId,
    senderId: userId,
    message: "Someone disliked your book",
    type: NotificationType.BOOK_DISLIKED,
    bookId: book.Id
);
        }

        public async Task RegisterAsync(RegisterDTO dto)
        {
            var existingUser = await _userRepo.FindAsync(u => u.Email == dto.Email);

            if (existingUser.Any())
                throw new Exception("Email already exists");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                IsApproved = dto.Role == Role.BOOK_OWNER ? false : true
            };

            await _userRepo.AddAsync(user);
            await _userRepo.SaveAsync();
        }

        public async Task<User> LoginAsync(LoginDTO dto)
        {
            var users = await _userRepo.FindAsync(u => u.Email == dto.Email);
            var user = users.FirstOrDefault();

            if (user == null)
                throw new Exception("User not found");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid password");

            if (user.Role == Role.BOOK_OWNER && user.IsApproved == false)
                throw new Exception("Owner not approved yet");

            return user;
        }


   
    }



}
