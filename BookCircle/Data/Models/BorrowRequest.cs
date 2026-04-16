namespace BookCircle.Data.Models;

using BookCircle.Enums;
using System.CodeDom.Compiler;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



public class BorrowRequest
{
    [Key]

    public int Id { get; set; }


    public int BookId { get; set; }

    [ForeignKey(nameof(BookId))]
    public Book Book { get; set; } = null!;



    public BorrowRequestStatus Status { get; set; } = BorrowRequestStatus.PENDING;

    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

    public DateTime? RespondedAt { get; set; }

    //public int OwnerId { get; set; }
    //[ForeignKey(nameof(OwnerId))]
    //public User Owner { get; set; }

    public int ReaderId { get; set; }

    [ForeignKey(nameof(ReaderId))]
    public User Reader { get; set; } = null!;
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
