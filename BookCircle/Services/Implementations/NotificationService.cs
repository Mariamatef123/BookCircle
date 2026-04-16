using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Enums;
using BookCircle.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace BookCircle.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepo;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(
            INotificationRepository notificationRepo,
            IHubContext<NotificationHub> hubContext)
        {
            _notificationRepo = notificationRepo;
            _hubContext = hubContext;
        }

        public async Task SendNotificationAsync(
            int receiverId,
            int? senderId,
            string message,
            NotificationType type,
            int? borrowRequestId = null,
            int? commentId = null,
            int? bookId = null)
        {
            // 1. Save to DB
            var notification = new Notification
            {
                ReceiverId = receiverId,
                SenderId = senderId,
                Message = message,
                Type = type,
                BorrowRequestId = borrowRequestId,
                CommentId = commentId,
                BookId = bookId,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepo.AddAsync(notification);
            await _notificationRepo.SaveAsync();

            // 2. Send via SignalR (GROUP based)
            await _hubContext.Clients
                .Group($"user_{receiverId}")
                .SendAsync("ReceiveNotification", new
                {
                    notification.Id,
                    notification.Message,
                    notification.Type,
                    notification.CreatedAt,
                    notification.IsRead,
                    notification.SenderId,
                    notification.BorrowRequestId,
                    notification.CommentId,
                    notification.BookId
                });
        }

        // GET USER NOTIFICATIONS
        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId)
        {
            return await _notificationRepo.GetByReceiverIdAsync(userId);
        }

        // MARK AS READ
        public async Task MarkAsReadAsync(int notificationId, int userId)
        {
            var notification = await _notificationRepo.GetByIdAsync(notificationId);

            if (notification == null)
                throw new Exception("Notification not found");

            if (notification.ReceiverId != userId)
                throw new Exception("Unauthorized");

            notification.IsRead = true;

            await _notificationRepo.SaveAsync();
        }
    }
}