using BookCircle.Data.Models;
using BookCircle.DTOs.Books;

namespace BookCircle.Data.Repositories.Intefaces
{
    public interface IBookRepository
    {
        Task<IEnumerable<BookResponseDTO>> GetAllAcceptedBooks();
        Task<IEnumerable<Book>> GetBooksByOwnerIdAsync(int ownerId);
        Task<IEnumerable<Book>> GetPendingPostsAsync();
    }
}
