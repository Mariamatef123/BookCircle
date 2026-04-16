using BookCircle.Data.Models;
using BookCircle.DTOs.Books;

namespace BookCircle.Data.Repositories.Intefaces
{
    public interface IBookRepository
    {
        Task<IEnumerable<BookResponseDTO>> GetAllAcceptedBooks();
        Task<IEnumerable<Book>> GetBooksByOwnerIdAsync(int ownerId);
        Task<IEnumerable<Book>> GetPendingPostsAsync();
        Task<Book?> GetBookWithCommentsAsync(int bookId);
        Task<IEnumerable<Book>> SearchBooksAsync(string? genre, string? language, decimal? borrowPrice);
    }
}
