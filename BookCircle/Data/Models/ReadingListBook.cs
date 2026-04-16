using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.Data.Models
{
    public class ReadingListBook
    {

        [ForeignKey("ReadingList")]
        public int ReadingListId { get; set; }


        public ReadingList ReadingList { get; set; } = null!;


        [ForeignKey("Book")]
        public int BookId { get; set; }


        public Book Book { get; set; } = null!;

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}
