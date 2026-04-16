using BookCircle.Data.Models;

namespace BookCircle.Data.Repositories.Intefaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetPendingOwnersAsync();
    }

}
