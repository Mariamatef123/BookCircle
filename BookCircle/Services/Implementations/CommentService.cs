using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs.Comments;
using BookCircle.Enums;
using BookCircle.Services.Interfaces;

namespace BookCircle.Services.Implementations
{
    public class CommentService : ICommentService
    {
        private readonly IRepository<Comment> _commentRepo;
        private readonly ICommentRepository _comment;
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<Book> _bookRepo;
        private readonly IBookRepository _book;
        private readonly INotificationService _notificationService;

        public CommentService(IRepository<Comment> commentRepo, IRepository<User> userRepo, IRepository<Book> bookRepo, ICommentRepository comment, IBookRepository book, INotificationService notificationService)
        {
            _commentRepo = commentRepo;
            _userRepo = userRepo;
            _bookRepo = bookRepo;
            _comment = comment;
            _book = book;
            _notificationService = notificationService;
        }

        public async Task AddComment(int userId, int bookId, string content)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book == null) throw new Exception("Book not found");
            Comment comment = (new Comment
            {
                UserId = userId,
                BookId = bookId,
                Content = content,
                CreatedAt = DateTime.UtcNow
            });

            await _commentRepo.AddAsync(comment);

            await _commentRepo.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: book.OwnerId,
    senderId: userId,
    message: "Someone commented on your book",
    type: NotificationType.COMMENT_ADDED,
    commentId: comment.Id,
    bookId: book.Id
);
        }

        public async Task ReplyToComment(int userId, int parentId, string content)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            var parent = await _commentRepo.GetByIdAsync(parentId);
            if (parent == null) throw new Exception("Comment not found");

            // enforce single level
            if (parent.ParentId != null)
                throw new Exception("Cannot reply to a reply");
            Comment comment = new Comment
            {
                UserId = userId,
                BookId = parent.BookId,
                Content = content,
                ParentId = parentId,         // ✅ matches model property name
                CreatedAt = DateTime.UtcNow
            };

            await _commentRepo.AddAsync(comment);

            await _commentRepo.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: parentId, // original commenter
    senderId: userId,
    message: "Someone replied to your comment",
    type: NotificationType.COMMENT_REPLIED,
    commentId: userId,
    bookId: comment.BookId
);
        }

        // In Service
        public async Task DeleteComment(int userId, int commentId)
        {
            var comment = await _comment.GetByIdWithRepliesAsync(commentId);

            if (comment == null)
                throw new Exception("Comment not found");

            if (comment.UserId != userId)
                throw new Exception("You can only delete your own comments");

            foreach (var reply in comment.Replies.ToList())
            {
                _commentRepo.Delete(reply);
            }

            _commentRepo.Delete(comment);

            await _commentRepo.SaveAsync();
        }
        public async Task<List<CommentDTO>> GetBookCommentsAsync(int bookId)
        {
            var comments = await _comment.GetCommentsByBookAsync(bookId);

            return comments.Select(c => new CommentDTO
            {
                Id = c.Id,
                Content = c.Content,
                UserId = c.UserId,
                CreatedAt = DateTime.UtcNow,
                Replies = c.Replies.Select(r => new ReplyDTO
                {
                    Id = r.Id,
                    Content = r.Content,
                    UserId = r.UserId,
                    CreatedAt=DateTime.UtcNow
                }).ToList()
            }).ToList();
        }
        public async Task UpdateCommentAsync(int userId, int commentId, string newContent)
        {
            var comment = await _commentRepo.GetByIdAsync(commentId);

            if (comment == null)
                throw new Exception("Comment not found");

            if (comment.UserId != userId)
                throw new Exception("You can only update your own comments");

            if (string.IsNullOrWhiteSpace(newContent))
                throw new Exception("Comment cannot be empty");

            comment.Content = newContent;
            comment.UpdatedAt = DateTime.UtcNow; // if you have it

            await _commentRepo.UpdateAsync(comment);
            await _commentRepo.SaveAsync();
        }
    }
}
