using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.Data.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } 
        public int? ParentId { get; set; }

        [ForeignKey(nameof(ParentId))]
        public Comment? Parent { get; set; }

        public ICollection<Comment> Replies { get; set; } = new List<Comment>();

        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }


        [ForeignKey("Book")]
        public int BookId { get; set; }


        public Book Book { get; set; }
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
