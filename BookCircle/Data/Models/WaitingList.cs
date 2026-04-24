//using System.ComponentModel.DataAnnotations.Schema;
//using System.ComponentModel.DataAnnotations;
//using BookCircle.Enums;

//namespace BookCircle.Data.Models
//{
//    public class WaitingList
//    {
//        [Key]
//        public int Id { get; set; }


//        [Required]
//        public int BookId { get; set; }

//        [ForeignKey(nameof(BookId))]
//        public Book Book { get; set; }

//        [Required]
//        public int UserId { get; set; }

//        [ForeignKey(nameof(UserId))]
//        public User User { get; set; }
//        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

      
//        public int? Position { get; set; }


//        public WaitingStatus Status { get; set; } = WaitingStatus.Waiting;
        


//        public DateTime? ServedDate { get; set; }



//    }
//}
