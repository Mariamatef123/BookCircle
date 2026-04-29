using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReactionController : ControllerBase
    {

        private readonly IReactionService _reactionService;
   
        public ReactionController(IReactionService reactionService)
        {

            _reactionService = reactionService;

        }

        [HttpPost("{userId}/like/{bookId}")]
        public async Task<IActionResult> like(int userId, int bookId)
        {
            await _reactionService.Like(userId, bookId);
            return Ok();
        }
        [HttpPost("{userId}/dislike/{bookId}")]
        public async Task<IActionResult> dislike(int userId, int bookId)
        {
            await _reactionService.Dislike(userId, bookId);
            return Ok();
        }

        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetReactionsByBook(int bookId)
        {
            var reactions = await _reactionService.GetReactionsByBookId(bookId);
            return Ok(reactions);
        }
    }
}
