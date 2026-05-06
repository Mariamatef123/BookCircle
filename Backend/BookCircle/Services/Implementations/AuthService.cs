using BookCircle.Data.Models;
using BookCircle.Enum;
using BookCircle.DTOs.Users;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Services.Interfaces;

namespace BookCircle.Services
{
    public class AuthService:IAuthService
    {
        private readonly IAuthRepository _userRepo;

        public AuthService(IAuthRepository userRepo)
        {
            _userRepo = userRepo;
        }

        // REGISTER
        public async Task RegisterAsync(UserDTO dto)
        {
            dto.Email = dto.Email.ToLower();

            var exists = await _userRepo.UserExist(dto.Email);
            if (exists)
                throw new Exception("Email already exists");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Role = System.Enum.Parse<Role>(dto.Role)
            };

            await _userRepo.Register(user, dto.Password);
        }

        // LOGIN
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