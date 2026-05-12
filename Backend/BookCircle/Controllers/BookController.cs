using BookCircle.DTOs.Books;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {


        private readonly IBookService _bookService;

       
        public BookController(IBookService bookService)
        {

            _bookService = bookService;


        }
        [Authorize]
        [HttpPost("{userId}/create-post")]
        public async Task<IActionResult> CreateBook([FromForm] BookRequestDTO dto, [FromRoute] int userId)
        {
            var book = await _bookService.CreateBookPostAsync(dto, userId);

            if (book == null)
                return BadRequest("Book creation failed");

            return Ok(book);
        }
   
        [HttpGet("get-accepted-books")]
        public async Task<ActionResult<IEnumerable<BookResponseDTO>>> GetAllAcceptedBooks()
        {
            var books = await _bookService.GetAllAcceptedBook();

            if (books == null || !books.Any())
                return NotFound("No accepted books found");

            return Ok(books);
        }
        [Authorize]
        [HttpDelete("{userId}/delete-book/{bookId}")]
        public async Task<ActionResult<BookResponseDTO>> DeleteBookById([FromRoute] int userId, [FromRoute] int bookId)
        {
            var book = await _bookService.DeleteBookById(userId, bookId);

            if (book == null)
                return NotFound("No books found");

            return Ok(book);
        }
        [Authorize]
        [HttpPut("{userId}/update-book/{bookId}")]
        public async Task<IActionResult> UpdateBook([FromRoute] int bookId, [FromForm] BookRequestDTO dto, [FromRoute] int userId)
        {
            var result = await _bookService.UpdateBookAsync(bookId, dto, userId);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }

        [Authorize]
        [HttpGet("{userId}/get-all-books")]
        public async Task<ActionResult<IEnumerable<BookResponseDTO>>> GetAllBooks([FromRoute] int userId)
        {
            var books = await _bookService.GetAllBooks(userId);

            if (books == null || !books.Any())
                return NotFound("No  books found");

            return Ok(books);
        }

        //admin
        [Authorize]
        [HttpPost("{userId}/accept-post/{bookId}")]
        public async Task<IActionResult> acceptPost([FromRoute] int bookId, [FromRoute] int userId)
        {
            await _bookService.AcceptPost(bookId, userId);

            return Ok();
        }
        [Authorize]
        [HttpPost("{userId}/reject-post/{bookId}")]
        public async Task<IActionResult> rejectPost([FromRoute] int bookId, [FromRoute] int userId)
        {
            await _bookService.RejectPost(bookId, userId);

            return Ok();
        }
        [Authorize]
        [HttpGet("{userId}/pending-posts")]
        public async Task<IActionResult> GetPendingPosts(int userId)
        {
            var book = await _bookService.GetPendingPosts(userId);
            return Ok(book);
        }


        [HttpGet("browse")]
        public async Task<IActionResult> Browse(
    [FromQuery] string? title,
    [FromQuery] string? genre,
    [FromQuery] string? language,
    [FromQuery] decimal? maxPrice, int pageNumber=1, int pageSize=10, bool availableOnly=true)
        {
            if (maxPrice.HasValue && maxPrice.Value < 0)
                return BadRequest(new { message = "maxPrice cannot be negative." });

            try
            {
                var results = await _bookService.SearchBooksAsync(title, genre, language, maxPrice,pageNumber,pageSize,availableOnly);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.", detail = ex.Message });
            }
        }

        [HttpGet("pagination")]
        public async Task<IActionResult> GetBooks(int pageNumber = 1, int pageSize = 10, bool availableOnly = true)
        {
            var booksStatistics = await _bookService.GetBooks(pageNumber, pageSize,  availableOnly);
            return Ok(booksStatistics);
        }
    }


}
