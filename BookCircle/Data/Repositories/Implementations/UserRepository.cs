using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Enum;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Data.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<User> _db;

        public UserRepository(DataContext context)
        {
            _context = context;
            _db = context.Set<User>();
        }

        public async Task<IEnumerable<User>> GetPendingOwnersAsync()
        {
            return await _db
               .Where(u => u.IsApproved == false && u.Role == Role.BOOK_OWNER)
                .ToListAsync();
        }
    }
}