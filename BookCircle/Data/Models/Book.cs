using BookCircle.DTOs.Books;
using BookCircle.Enum;
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


        public string Description { get; set; }


        [Column(TypeName = "decimal(10,2)")]
        public decimal BorrowPrice { get; set; }
        public BookStatus BorrowStatus { get; set; } = BookStatus.AVAILABLE;
        public DateTime PublicationDate { get; set; } 
        public ICollection<AvailabilityDate> AvailabilityDates { get; set; }
     = new List<AvailabilityDate>();
        public byte[]? CoverImage { get; set; }

        public PostStatus Status { get; set; } = PostStatus.PENDING;



        //public int OwnerId { get; set; }//1 owner can manage Many book posts,1 admin can accept,reject many book posts(dont put it)

        //[ForeignKey(nameof(OwnerId))]
        //public User Owner { get; set; }  = null!;//Navigation property\\
        public int OwnerId { get; set; }

        [ForeignKey(nameof(OwnerId))]
        public User Owner { get; set; }
        public ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();
        public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();


        [ForeignKey(nameof(CurrentBorrower))]
        public int? CurrentBorrowerId { get; set; }
        public User? CurrentBorrower { get; set; }

        public ICollection<ReadingListBook> ReadingListBooks { get; set; } = new List<ReadingListBook>();


        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        //public ICollection<WaitingList> WaitingLists { get; set; } = new List<WaitingList>();
     
        public Book() { }   
    }
}
