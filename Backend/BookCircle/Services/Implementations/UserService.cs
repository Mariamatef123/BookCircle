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

        private readonly IGenericRepository<User> _userRepo;

        //private readonly IUserRepository _userRepository;
        private readonly IGenericRepository<Book> _bookRepo;

        private readonly IGenericRepository<BorrowRequest> _borrowRequest;
        private readonly IGenericRepository<Reaction> _reaction;
        //private readonly IReactionRepository _reactionRepo;
        private readonly IGenericRepository<Comment> _commentRepo;
        private readonly IGenericRepository<Notification> _notificationRepo;

        //private readonly IBookRequestRepository _borrowRequestRepo;
        private readonly INotificationService _notificationService;

        public UserService(IGenericRepository<User> userRepo, IGenericRepository<Book> bookRepo, IGenericRepository<BorrowRequest> borrowRequest, IGenericRepository<Reaction> reaction, IGenericRepository<Comment> commentRepo, INotificationService _NotificationService,IGenericRepository<Notification>notificationRepo)
        {

            _userRepo = userRepo;

            _bookRepo = bookRepo;
            _borrowRequest = borrowRequest;
            //_borrowRequestRepo = borrowRequestRepo;
            _reaction = reaction;
            //_reactionRepo = reactionRepo;
            _commentRepo = commentRepo;
            _notificationService = _NotificationService;
            _notificationRepo = notificationRepo;
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
    message: "Welcome in your new account",
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

            return await _userRepo.GetAllAsync(
    criteria: u => u.IsApproved == false && u.Role == Role.BOOK_OWNER
);


        }

        public async Task RejectOwner(int ownerId, int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            if (user.Role != Role.ADMIN)
                throw new Exception("Only admins can reject owners");

            var owner = await _userRepo.GetByIdAsync(ownerId);
            if (owner == null)
                throw new Exception("Owner not found");

            if (owner.Role != Role.BOOK_OWNER)
                throw new Exception("Must be an owner");
            var notification = await _notificationRepo.GetFirstOrDefaultAsync(n => n.SenderId == ownerId);
            if (notification != null)
            {
                _notificationRepo.Delete(notification);
              await  _notificationRepo.SaveAsync();

            }


            //await _notificationService.SendNotificationAsync(
            //      receiverId: ownerId,
            //      senderId: userId,
            //      message: "Your account has been rejected",
            //      type: NotificationType.OWNER_REJECTED
            //  );
            owner.IsApproved = false;
            _userRepo.Delete(owner);
            await _userRepo.SaveAsync();



        }


        //public async Task RegisterAsync(RegisterDTO dto)
        //{
        //    var existingUser = await _userRepo.FindAsync(u => u.Email == dto.Email);

        //    if (existingUser.Any())
        //        throw new Exception("Email already exists");

        //    var user = new User
        //    {
        //        Name = dto.Name,
        //        Email = dto.Email,
        //        //PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        //        Role = dto.Role,
        //        IsApproved = dto.Role == Role.BOOK_OWNER ? false : true
        //    };

        //    await _userRepo.AddAsync(user);
        //    await _userRepo.SaveAsync();
        //}
        //public async Task<User> LoginAsync(LoginDTO dto)
        //{
        //    var users = await _userRepo.FindAsync(u => u.Email == dto.Email);
        //    var user = users.FirstOrDefault();

        //    if (user == null)
        //        throw new Exception("User not found");

        //    //if (string.IsNullOrWhiteSpace(user.PasswordHash))
        //    //    throw new Exception("Invalid stored password (not hashed)");

        //    //bool isValidPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        //    //if (!isValidPassword)
        //    //    throw new Exception("Invalid password");

        //    if (user.Role == Role.BOOK_OWNER && user.IsApproved == false)
        //        throw new Exception("Owner not approved yet");

        //    return user;
        //}



    }



}
