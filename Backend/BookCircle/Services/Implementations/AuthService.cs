using BookCircle.Data.Models;
using BookCircle.Enum;
using BookCircle.DTOs.Users;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Services.Interfaces;
using BookCircle.Enums;

namespace BookCircle.Services
{
    public class AuthService:IAuthService
    {
        private readonly IAuthRepository _userRepo;
        private readonly INotificationService _notificationService;
        private readonly IGenericRepository<User> _user;

        public AuthService(IAuthRepository userRepo,INotificationService notificationService,IGenericRepository<User>user)
        {
            _userRepo = userRepo;
            _notificationService = notificationService;
            _user = user;
        }

        public Task<IEnumerable<Role>> GetRoles()
        {
            var roles = System.Enum.GetValues<Role>()
                            .Where(r => r != Role.ADMIN);

            return Task.FromResult(roles);
        }
        public async Task RegisterAsync(UserDTO dto)
        {
            dto.Email = dto.Email.ToLower();

            var exists = await _userRepo.UserExist(dto.Email);
            var admin = await _user.GetFirstOrDefaultAsync(u => u.Role == Role.ADMIN);
            if (exists)
                throw new Exception("Email already exists");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Role = System.Enum.Parse<Role>(dto.Role)
            };
            if (user.Role == Role.BOOK_OWNER)
            {
                user.IsApproved = false;
            }

            await _userRepo.Register(user, dto.Password);
            await _notificationService.SendNotificationAsync(
                 receiverId: admin.Id,
                 senderId: user.Id,
                 message: $"{user.Name} Request Approved Account",
                 type: NotificationType.ACCOUNT_REQUEST


             );
        }

       
        public async Task<User> LoginAsync(LoginDTO dto)
        {
            var user = await _userRepo.Login(dto.Email.ToLower(), dto.Password);

            if (user == null)
                throw new Exception("Invalid email or password");

            if (user.Role == Role.BOOK_OWNER && user.IsApproved == false)
                throw new Exception("Owner not approved yet");

            return user;
        }


    }
}