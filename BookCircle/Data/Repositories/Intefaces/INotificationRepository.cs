using BookCircle.Data.Models;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(int id);
    Task<IEnumerable<Notification>> GetByReceiverIdAsync(int receiverId);
    Task AddAsync(Notification notification);
    Task SaveAsync();
}