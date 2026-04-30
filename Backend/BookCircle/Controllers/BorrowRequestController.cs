using BookCircle.Data.Models;
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
        [HttpGet("{ownerId}/get-pending-borrow-requests")]
        public async Task<IActionResult> GetPendingBorrowRequests(int ownerId)
        {
          IEnumerable<BorrowRequest>borrowRequests=  await _borrowRequestService.GetPendingBorrowRequests(ownerId);
            return Ok(borrowRequests);
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
        [HttpGet("myRequests")]
        public async Task<IActionResult> GetMyRequests([FromQuery] int userId)
        {
            var requests = await _borrowRequestService.RequestsSentByUser(userId);
            return Ok(new { data = requests });
        }

        [HttpPut("{borrowRequestId}/cancel")]
        public async Task<IActionResult> CancelRequest(int borrowRequestId, [FromQuery] int userId)
        {
            await _borrowRequestService.CancelBorrowRequest(userId, borrowRequestId);
            return Ok(new { message = "Borrow request cancelled successfully" });
        }


    }
}
