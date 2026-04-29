using BookCircle.Data.Models;
using BookCircle.DTOs.Users;

namespace BookCircle.DTOs.Books
{
    public class BookResponseDTO
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Genre { get; set; }
        public string ISBN { get; set; }
        public string Language { get; set; }

        public decimal BorrowPrice { get; set; }
        public string BorrowStatus { get; set; }

        public DateTime PublicationDate { get; set; }

        public List<AvailabilityDateDTO> AvailabilityDates { get; set; } 
        public string Description { get; set; }
        public UserDTO Owner { get; set; }

        public string Status { get; set; }

        public string? CoverImageBase64 { get; set; } 
    }
}