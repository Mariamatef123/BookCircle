using BookCircle.Data.Models;
using BookCircle.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Services.Interfaces
{
    public interface IUserService
    {
        Task AcceptOwner(int ownerId, int userId);
        Task RejectOwner(int ownerId, int userId);
        Task<IEnumerable<User>> GetPendingOwners(int userId);


    }
}
