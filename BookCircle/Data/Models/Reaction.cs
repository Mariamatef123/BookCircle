using BookCircle.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.Data.Models
{
    public class Reaction
    {



        public ReactionType Type { get; set; }



        [ForeignKey("Book")]
        public int BookId { get; set; }
        public Book Book { get; set; }


        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
