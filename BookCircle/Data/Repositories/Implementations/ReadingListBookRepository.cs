using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Data;
using Microsoft.EntityFrameworkCore;
using BookCircle.Data.Models;

public class ReadingListBookRepository : IReadingListBookRepository
{
    private readonly DataContext _context;

    public ReadingListBookRepository(DataContext context)
    {
        _context = context;
    }
    public async Task<ReadingListBook?> GetAsync(int readingListId, int bookId)
    {
        return await _context.ReadingListBooks
            .FirstOrDefaultAsync(x =>
                x.ReadingListId == readingListId &&
                x.BookId == bookId);
    }
    public async Task<bool> ExistsAsync(int readingListId, int bookId)
    {
        return await _context.ReadingListBooks
            .AnyAsync(x => x.ReadingListId == readingListId && x.BookId == bookId);
    }

    public async Task<List<ReadingListBook>> GetByReadingListIdAsync(int readingListId)
    {
        return await _context.ReadingListBooks
            .Where(x => x.ReadingListId == readingListId)
            .ToListAsync();
    }

}