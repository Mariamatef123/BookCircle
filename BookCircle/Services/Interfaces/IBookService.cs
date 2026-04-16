using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs.Books;
using BookCircle.Enum;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BookCircle.Services.Interfaces
{
    public interface IBookService
    {
        Task<BookResponseDTO> CreateBookPostAsync(BookRequestDTO dto, int userId);
        Task<BookResponseDTO> DeleteBookById(int userId,int bookId);
        Task<IEnumerable<BookResponseDTO>> GetAllAcceptedBook();
        Task<BookResponseDTO> UpdateBookAsync(int bookId, BookRequestDTO dto,int userId);
        Task<IEnumerable<BookResponseDTO>> GetAllBooks(int ownerId);
        Task AcceptPost(int bookId, int userId);
        Task RejectPost(int bookId, int userId);

        Task<IEnumerable<BookResponseDTO>> GetPendingPosts(int userId);
   
    }
}
