using BookCircle.Data.Models;

namespace BookCircle.Data.Repositories.Intefaces
{
    public interface IAuthRepository
    {
        public Task<User> Login(string email, string password);
        public Task<User> Register(User user, string password);
        public Task<bool> UserExist(string email);
    }
}
