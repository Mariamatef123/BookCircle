
namespace BookCircle.DTOs.Comments
{
    public class CommentDTO
    {
    
            public int Id { get; set; }
            public string Content { get; set; }
            public int UserId { get; set; }
            public List<ReplyDTO> Replies { get; set; } = new();
           public DateTime CreatedAt { get; set; }

      
    }
}
