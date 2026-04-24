using BookCircle.DTOs.Books;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {


        private readonly IBookService _bookService;

        //owner
        public BookController(IBookService bookService)
        {

            _bookService = bookService;


        }

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

        [HttpDelete("{userId}/delete-book/{bookId}")]
        public async Task<ActionResult<BookResponseDTO>> DeleteBookById([FromRoute] int userId, [FromRoute] int bookId)
        {
            var book = await _bookService.DeleteBookById(userId, bookId);

            if (book == null)
                return NotFound("No books found");

            return Ok(book);
        }
        [HttpPut("{userId}/update-book/{bookId}")]
        public async Task<IActionResult> UpdateBook([FromRoute] int bookId, [FromForm] BookRequestDTO dto, [FromRoute] int userId)
        {
            var result = await _bookService.UpdateBookAsync(bookId, dto, userId);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }

        [HttpGet("{userId}/get-all-books")]
        public async Task<ActionResult<IEnumerable<BookResponseDTO>>> GetAllBooks([FromRoute] int userId)
        {
            var books = await _bookService.GetAllBooks(userId);

            if (books == null || !books.Any())
                return NotFound("No  books found");

            return Ok(books);
        }

        //admin

        [HttpPost("{userId}/accept-post/{bookId}")]
        public async Task<IActionResult> acceptPost([FromRoute] int bookId, [FromRoute] int userId)
        {
            await _bookService.AcceptPost(bookId, userId);

            return Ok();
        }

        [HttpPost("{userId}/reject-post/{bookId}")]
        public async Task<IActionResult> rejectPost([FromRoute] int bookId, [FromRoute] int userId)
        {
            await _bookService.RejectPost(bookId, userId);

            return Ok();
        }
        [HttpGet("{userId}/pending-posts")]
        public async Task<IActionResult> GetPendingPosts(int userId)
        {
            var book = await _bookService.GetPendingPosts(userId);
            return Ok(book);
        }


        [HttpGet("browse")]
        public async Task<IActionResult> Browse(
        [FromQuery] string? genre,
        [FromQuery] string? language,
        [FromQuery] decimal? maxPrice)
        {
            try
            {
                var books = await _bookService.SearchBooksAsync(genre, language, maxPrice);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }

}
