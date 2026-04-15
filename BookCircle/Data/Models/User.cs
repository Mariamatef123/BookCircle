using BookCircle.Enum;
using System.ComponentModel.DataAnnotations;

namespace BookCircle.Data.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }

        public Role Role { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Comment> Comments { get; set; }

        // Notifications received
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        // Notifications sent (optional but important)
        public ICollection<Notification> SentNotifications { get; set; } = new List<Notification>();
        public User() { }

    }
}
