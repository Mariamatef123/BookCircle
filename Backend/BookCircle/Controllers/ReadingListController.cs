using BookCircle.DTOs.Books;
using BookCircle.DTOs.ReadingLists;
using BookCircle.Services.Implementations;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReadingListController : ControllerBase
    {
        private readonly IReadingListService _readingListService;

        public ReadingListController(IReadingListService readingListService)
        {
            _readingListService = readingListService;
        }

        [HttpPost("create-readinglist/{userId}")]
        public async Task<ActionResult> CreateReadingList(
            [FromBody] ReadingListDTO readingListDTO,
            [FromRoute] int userId)
        {
            var result = await _readingListService.CreateReadingListAsync(readingListDTO, userId);

            if (result == null)
                return BadRequest("Failed to create reading list");

            return Ok(result);
        }

        [HttpPost("add-books/{readingListId}/{bookId}")]
        public async Task<IActionResult> AddBooks(
   [FromRoute] int readingListId,[FromRoute]int bookId
    )
        {
            await _readingListService.AddBookToReadingList(readingListId,bookId );
            return Ok("Books added successfully");
        }


        [HttpDelete("remove-book")]
        public async Task<IActionResult> RemoveBook(int readingListId, int bookId)
        {
            await _readingListService.RemoveBookFromReadingList(readingListId, bookId);
            return Ok("Book removed successfully");
        }

        [HttpDelete("remove-list")]
        public async Task<IActionResult> DeleteReadingList(int readingListId)
        {
            await _readingListService.DeleteReadingList(readingListId);
            return Ok("Readinglist removed successfully");
        }


        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ReadingListDTO>>> GetAllByUser(int userId)
        {
            var result = await _readingListService.GetAllReadingLists(userId);

            if (result == null || !result.Any())
                return NotFound("No reading lists found");

            return Ok(result);
        }

        [HttpGet("{readingListId}/books")]
        public async Task<ActionResult<IEnumerable<BookResponseDTO>>> GetBooks(int readingListId)
        {
            try
            {
                var books = await _readingListService.GetBooksInReadingList(readingListId);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}