using BookCircle.Data.Models;
using BookCircle.DTOs.Books;
using BookCircle.Services.Implementations;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BookCircle.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        private readonly IBookService _bookService;

        //owner
        public UserController(IUserService userService, IBookService bookService)
        {
            _userService = userService;
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

        [HttpGet("{userId}get-all-books")]
        public async Task<ActionResult<IEnumerable<BookResponseDTO>>> GetAllBooks([FromRoute]int userId)
        {
            var books = await _bookService.GetAllBooks(userId);

            if (books == null || !books.Any())
                return NotFound("No  books found");

            return Ok(books);
        }

        //admin

        [HttpPost("{userId}/accept-post/{bookId}")]
        public async Task<IActionResult> acceptPost([FromRoute]int bookId, [FromRoute] int userId)
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

        [HttpGet("{userId}/pending-posts")]
        public async Task<IActionResult> GetPendingPosts(int userId)
        {
             var book=await _bookService.GetPendingPosts(userId);
            return Ok(book);
        }

        [HttpGet("{adminId}/pending-owners")]
       
        public async Task<IActionResult> GetPendingOwner(int adminId)
        {
            var users = await _userService.GetPendingOwners(adminId);
            return Ok(users);
        }

        [HttpPost("{readerId}/send-request/{bookId}")]
        public async Task<IActionResult> sendBorrowRequest(int readerId, int bookId)
        {
            await _userService.sendBorrowRequest(readerId,bookId);
            return Ok();
        }

        [HttpPost("{ownerId}/accept-request/{borrowRequestId}")]
        public async Task<IActionResult> acceptBorrowRequest(int ownerId, int borrowRequestId)
        {
            await _userService.AcceptBorrowRequest(ownerId, borrowRequestId);
            return Ok();
        }

        [HttpPost("{ownerId}/reject-request/{borrowRequestId}")]
        public async Task<IActionResult> rejectBorrowRequest(int ownerId, int borrowRequestId)
        {
            await _userService.RejectBorrowRequest(ownerId, borrowRequestId);
            return Ok();
        }


        [HttpPost("{userId}/like/{bookId}")]
        public async Task<IActionResult> like(int userId, int bookId)
        {
            await _userService.Like(userId, bookId);
            return Ok();
        }
        [HttpPost("{userId}/dislike/{bookId}")]
        public async Task<IActionResult> dislike(int userId, int bookId)
        {
            await _userService.Dislike(userId, bookId);
            return Ok();
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