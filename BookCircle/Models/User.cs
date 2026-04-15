using BookCircle.Enum;
using System.ComponentModel.DataAnnotations;

namespace BookCircle.Models
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
        public bool IsApproved { get; set; }//for owner approval

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        //any user can write comments

        // Notifications received
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        // Notifications sent (optional but important)
        public ICollection<Notification> SentNotifications { get; set; } = new List<Notification>();

        //public ICollection<Book> Books { get; set; } = new List<Book>();// owner can manage many books/ admin can accept,reject books
        public ICollection<Book> OwnedBooks { get; set; } = new List<Book>();
        public ICollection<Book> BorrowedBooks { get; set; } = new List<Book>();
        public ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();

        public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();//any user can  react on a book
        public ICollection<ReadingList> ReadingLists { get; set; } = new List<ReadingList>();//reader can create many readinglists
        public User() { }

    }
}
