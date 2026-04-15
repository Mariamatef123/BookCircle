using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.Models
{
    public class ReadingList
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }//reaader


        public User User { get; set; } = null!;

        public ICollection<ReadingListBook> ReadingListBooks { get; set; } = new List<ReadingListBook>();

        public DateTime CreatedAt { get; set; }
    }
}
