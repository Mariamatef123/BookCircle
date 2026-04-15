using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.Data.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        // Receiver (who gets the notification)
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        // Sender (who triggered it)
        public int? SenderId { get; set; }

        [ForeignKey(nameof(SenderId))]
        public User? Sender { get; set; }

        public string Message { get; set; } = null!;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Related entities (optional)
        public int? BorrowRequestId { get; set; }

        [ForeignKey(nameof(BorrowRequestId))]
        public BorrowRequest? BorrowRequest { get; set; }

        public int? CommentId { get; set; }

        [ForeignKey(nameof(CommentId))]
        public Comment? Comment { get; set; }

        public int? BookId { get; set; }

        [ForeignKey(nameof(BookId))]
        public Book? Book { get; set; }
    }
}