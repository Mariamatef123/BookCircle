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
       
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public Role Role { get; set; }


        public DateTime CreatedAt { get; set; }=DateTime.Now;
        public bool IsApproved { get; set; } = true;//for owner approval

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        //any user can write comments

        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<Notification> SentNotifications { get; set; } = new List<Notification>();

        public ICollection<Book> OwnedBooks { get; set; } = new List<Book>();
        public ICollection<Book> BorrowedBooks { get; set; } = new List<Book>();
        public ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();

        public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();//any user can  react on a book
        public ICollection<ReadingList> ReadingLists { get; set; } = new List<ReadingList>();//reader can create many readinglists


        public User() { }

    }
}
