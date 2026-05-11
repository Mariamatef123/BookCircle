using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.DTOs.Books
{
    public class BookRequestDTO
    {
        [Required]
        [MaxLength(300)]
        public string Title { get; set; }
        [Required]
        [MaxLength(100)]
        public string Genre { get; set; }
        [Required]
        [MaxLength(20)]
        public string ISBN { get; set; }
        [Required]
        [MaxLength(50)]
        public string Language { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal BorrowPrice { get; set; }
        public DateTime PublicationDate { get; set; }
        public string Description { get; set; }

        public int ownerId { get; set; }

        public List<AvailabilityDateDTO> AvailabilityDates { get; set; } = new();


        public IFormFile? CoverImage { get; set; }   
    }
}