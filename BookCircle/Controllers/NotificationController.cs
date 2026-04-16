using BookCircle.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetNotifications(int userId)
    {
        try
        {
            var notifications = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("{notificationId}/read")]
    public async Task<IActionResult> MarkAsRead(int notificationId, [FromQuery] int userId)
    {
        try
        {
            await _notificationService.MarkAsReadAsync(notificationId, userId);
            return Ok("Notification marked as read");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}