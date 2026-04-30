using BookCircle.Data.Models;
using BookCircle.Enums;

namespace BookCircle.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(
            int receiverId,
            int? senderId,
            string message,
            NotificationType type,
            int? borrowRequestId = null,
            int? commentId = null,
            int? bookId = null);

        Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId);

        Task MarkAsReadAsync(int notificationId, int userId);
    }
}