using BookCircle.DTOs.Users;

namespace BookCircle.DTOs.Comments
{
    public class ReplyDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }

        public UserDTO User { get; set; } = new();
    }
}
