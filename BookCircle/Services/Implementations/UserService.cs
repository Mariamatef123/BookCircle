using BookCircle.Data;
using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs;
using BookCircle.Enum;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Services.Implementations
{
    public class UserService : IUserService

    {
        private readonly DataContext _context;

        private readonly IRepository<User> _userRepo;

        private readonly IUserRepository _userRepository;

        public UserService( IRepository<User> userRepo, IUserRepository userRepository)
        {
           
            _userRepo = userRepo;
            _userRepository = userRepository;
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
            _userRepo.Delete(owner);
          
            await _userRepo.SaveAsync();

        }

    }
}
