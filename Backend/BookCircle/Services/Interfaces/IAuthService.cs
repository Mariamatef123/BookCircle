using BookCircle.Data.Models;
using BookCircle.DTOs.Users;
using BookCircle.Enum;

namespace BookCircle.Services.Interfaces
{
    public interface IAuthService
    {
        public  Task RegisterAsync(UserDTO dto);
        public  Task<User> LoginAsync(LoginDTO dto);
        public Task<IEnumerable<Role>> GetRoles();
    }
}
