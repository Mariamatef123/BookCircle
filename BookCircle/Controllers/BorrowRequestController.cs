using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BorrowRequestController : ControllerBase
    {


        private readonly IBookService _bookService;
        private readonly IBorrowRequestService _borrowRequestService;
 
        public BorrowRequestController(IBookService bookService, IBorrowRequestService borrowRequestService)
        {
            _bookService = bookService;
            _borrowRequestService = borrowRequestService;
      

        }
        [HttpPost("{readerId}/send-request/{bookId}")]
        public async Task<IActionResult> sendBorrowRequest(int readerId, int bookId, int chosenDuration)
        {
            await _borrowRequestService.sendBorrowRequest(readerId, bookId, chosenDuration);
            return Ok();
        }

        [HttpPost("{ownerId}/accept-request/{borrowRequestId}")]
        public async Task<IActionResult> acceptBorrowRequest(int ownerId, int borrowRequestId)
        {
            await _borrowRequestService.AcceptBorrowRequest(ownerId, borrowRequestId);
            return Ok();
        }

        [HttpPost("{ownerId}/reject-request/{borrowRequestId}")]
        public async Task<IActionResult> rejectBorrowRequest(int ownerId, int borrowRequestId)
        {
            await _borrowRequestService.RejectBorrowRequest(ownerId, borrowRequestId);
            return Ok();
        }


    }
}
