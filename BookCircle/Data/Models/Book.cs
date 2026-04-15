using BookCircle.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BookCircle.Data.Models
{
    [Index(nameof(Genre))]
    [Index(nameof(Language))]
    [Index(nameof(BorrowPrice))]
    public class Book
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(300)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Genre { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ISBN { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Language { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal BorrowPrice { get; set; }
        public BookStatus Borrow_Status { get; set; } = BookStatus.AVAILABLE;
        public DateTime PublicationDate { get; set; }
        public ICollection<AvailabilityDate> AvailabilityDates { get; set; } = new List<AvailabilityDate>();
        public byte[]? CoverImage { get; set; }


        public int OwnerId { get; set; }
        [ForeignKey("OwnerId")]
        public BookOwner Owner { get; set; }

        public ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();
        public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();



        public ICollection<ReadingListBook> ReadingListBooks { get; set; } = new List<ReadingListBook>();

        public Post? Post { get; set; }
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
