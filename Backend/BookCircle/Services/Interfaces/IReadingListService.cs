using BookCircle.DTOs.Books;
using BookCircle.DTOs.ReadingLists;

namespace BookCircle.Services.Interfaces
{
    public interface IReadingListService
    {
        Task<ReadingListDTO> CreateReadingListAsync(ReadingListDTO readingListDTO, int userId);
        Task AddBookToReadingList(int readingListId, int bookId);
        Task RemoveBookFromReadingList(int readingListId, int bookId);
        Task DeleteReadingList(int readingListId);
        Task<IEnumerable<ReadingListDTO>> GetAllReadingLists(int userId);
        Task<IEnumerable<BookResponseDTO>> GetBooksInReadingList(int readingListId);
    }
}
