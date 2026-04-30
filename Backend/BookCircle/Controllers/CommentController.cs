using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly ICommentService _commentService;


    public CommentController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddComment(int userId, int bookId, [FromBody] string content)
    {
        try
        {
            await _commentService.AddComment(userId, bookId, content);
            return Ok("Comment added successfully");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("reply/{parentId}")]
    public async Task<IActionResult> ReplyToComment(int userId, int parentId, [FromBody] string content)
    {
        try
        {
            await _commentService.ReplyToComment(userId, parentId, content);
            return Ok("Reply added successfully");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{commentId}")]
    public async Task<IActionResult> DeleteComment(int userId, int commentId)
    {
        try
        {
            await _commentService.DeleteComment(userId, commentId);
            return Ok("Comment deleted successfully");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("book-comments/{bookId}")]
    public async Task<IActionResult> GetBookComments(int bookId)
    {
        var result = await _commentService.GetBookCommentsAsync(bookId);
        return Ok(result);
    }
    [HttpPut("{commentId}")]
    public async Task<IActionResult> UpdateComment(int commentId, int userId, string content)
    {
        
        await _commentService.UpdateCommentAsync(userId,commentId, content);

        return Ok("Comment updated successfully");
    }

}