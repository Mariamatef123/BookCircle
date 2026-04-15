using BookCircle.Enum;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.Data.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }
      
        public PostStatus Status { get; set; } = PostStatus.PENDING;


        public int BookId { get; set; }

        [ForeignKey("BookId")]
        public Book Book { get; set; }

        public int OwnerId { get; set; }


        [ForeignKey("OwnerId")]
        public BookOwner BookOwner { get; set; }


        public ICollection<Comment> Comments { get; set; } = new List<Comment>();


        public int? AdminId { get; set; }
        [ForeignKey("AdminId")]
        public Admin Admin { get; set; }


    }
}
