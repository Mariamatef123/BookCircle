using BookCircle.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.Data.Models
{
    public class Reaction
    {

        [Key]
        public int Id { get; set; }

        public ReactionType Type { get; set; }



        public int BookId { get; set; }

        [ForeignKey(nameof(BookId))]
        public Book Book { get; set; }//post or book?

        public int ReaderId { get; set; }
        [ForeignKey(nameof(ReaderId))]
        public Reader Reader { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
