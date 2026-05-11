using BookCircle.Data.Models;
using BookCircle.DTOs.Books;
using BookCircle.Services.Implementations;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BookCircle.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;

        }
        [HttpPost("{userId}/accept-owner/{ownerId}")]
        public async Task<IActionResult> acceptOwner([FromRoute] int ownerId, [FromRoute] int userId)
        {
            await _userService.AcceptOwner(ownerId, userId);

            return Ok();
        }

        [HttpPost("{userId}/reject-owner/{ownerId}")]
        public async Task<IActionResult> rejectOwner([FromRoute] int ownerId, [FromRoute] int userId)
        {
            await _userService.RejectOwner(ownerId, userId);

            return Ok();
        }


        [HttpGet("{adminId}/pending-owners")]

        public async Task<IActionResult> GetPendingOwner(int adminId)
        {
            var users = await _userService.GetPendingOwners(adminId);
            return Ok(users);
        }

    }
}