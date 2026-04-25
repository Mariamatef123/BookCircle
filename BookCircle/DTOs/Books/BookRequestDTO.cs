using Microsoft.AspNetCore.Http;

namespace BookCircle.DTOs.Books
{
    public class BookRequestDTO
    {
        public string Title { get; set; }
        public string Genre { get; set; }
        public string ISBN { get; set; }
        public string Language { get; set; }
        public decimal BorrowPrice { get; set; }
        public DateTime PublicationDate { get; set; }
        public string Description { get; set; }

        public int ownerId { get; set; }

        public List<AvailabilityDateDTO> AvailabilityDates { get; set; } = new();

        public IFormFile? CoverImage { get; set; }   
    }
}