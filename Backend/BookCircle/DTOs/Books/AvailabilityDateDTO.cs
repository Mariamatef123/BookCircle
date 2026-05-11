using System.ComponentModel.DataAnnotations;

namespace BookCircle.DTOs.Books
{

    public class AvailabilityDateDTO
    {
        [Required]
        public int Duration { get; set; }
    }

}
