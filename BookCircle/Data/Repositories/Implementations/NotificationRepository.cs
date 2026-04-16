using BookCircle.Data.Models;
using BookCircle.Data;
using Microsoft.EntityFrameworkCore;

public class NotificationRepository : INotificationRepository
{
    private readonly DataContext _context;
    protected readonly DbSet<Notification> _db;

    public NotificationRepository(DataContext context)
    {
        _context = context;
        _db = context.Set<Notification>();
    }

    public async Task<Notification?> GetByIdAsync(int id)
    {
        return await _db
       .FirstOrDefaultAsync(n => n.Id == id);
    }

    public async Task<IEnumerable<Notification>> GetByReceiverIdAsync(int receiverId)
    {
        return await _db
            .Where(n => n.ReceiverId == receiverId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(Notification notification)
    {
        await _db.AddAsync(notification);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}