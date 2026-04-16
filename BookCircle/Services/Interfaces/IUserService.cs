using BookCircle.Data.Models;
using BookCircle.DTOs;
using BookCircle.DTOs.Users;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Services.Interfaces
{
    public interface IUserService
    {
        Task AcceptOwner(int ownerId, int userId);
        Task RejectOwner(int ownerId, int userId);
        Task<IEnumerable<User>> GetPendingOwners(int userId);
        Task sendBorrowRequest(int readerId,int bookId);
        Task AcceptBorrowRequest(int ownerId, int borrowRequestId);
        Task RejectBorrowRequest(int ownerId, int borrowRequestId);
        Task Like(int userId, int bookId);
        Task Dislike(int userId, int bookId);

        Task RegisterAsync(RegisterDTO dto);
        Task<User> LoginAsync(LoginDTO dto);
    }
}
