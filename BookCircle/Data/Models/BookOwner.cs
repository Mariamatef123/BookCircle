using BookCircle.Enums;

using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.Data.Models
{
    public class BookOwner : User
    {
        public BookOwnerStatus Status { get; set; } = BookOwnerStatus.PENDING;


        public ICollection<Book> Books { get; set; } = new List<Book>();

        public ICollection<Post> Posts { get; set; } = new List<Post>();

        public ICollection<BorrowRequest> BorrowRequests { get; set; }
        public BookOwner() { }
    }
}
