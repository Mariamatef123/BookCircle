using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs.Comments;
using BookCircle.DTOs.Users;
using BookCircle.Enums;
using BookCircle.Services.Interfaces;

namespace BookCircle.Services.Implementations
{
    public class CommentService : ICommentService
    {
        private readonly IGenericRepository<Comment> _commentRepo;
        //private readonly ICommentRepository _comment;
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Book> _bookRepo;
        private readonly IGenericRepository<Notification> _notificationRepo;
        //private readonly IBookRepository _book;
        private readonly INotificationService _notificationService;

        public CommentService(IGenericRepository<Comment> commentRepo, IGenericRepository<User> userRepo, IGenericRepository<Book> bookRepo, INotificationService notificationService,IGenericRepository<Notification> notificationRepo)
        {
            _commentRepo = commentRepo;
            _userRepo = userRepo;
            _bookRepo = bookRepo;
            //_comment = comment;
            //_book = book;
            _notificationService = notificationService;
            _notificationRepo = notificationRepo;
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
                CreatedAt = DateTime.Now
            });

            await _commentRepo.AddAsync(comment);

            await _commentRepo.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: book.OwnerId,
    senderId: userId,
    message:$"{comment.User.Name} commented on your book {book.Title}",
    type: NotificationType.COMMENT_ADDED,
    commentId: comment.Id,
    bookId: book.Id
);
        }

        public async Task ReplyToComment(int userId, int parentId, string content)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            // ✅ FIX: get the actual parent comment by Id
            var parent = await _commentRepo.GetFirstOrDefaultAsync(
                p => p.Id == parentId,
                includes: new[] { "Book" }
            );

            if (parent == null) throw new Exception("Comment not found");

            // ✅ Enforce single-level replies
            if (parent.ParentId != null)
                throw new Exception("Cannot reply to a reply");

            var comment = new Comment
            {
                UserId = userId,
                BookId = parent.BookId,
                Content = content,
                ParentId = parentId,
                CreatedAt = DateTime.Now,
            };

            await _commentRepo.AddAsync(comment);
            await _commentRepo.SaveAsync();

            // ✅ Avoid notifying yourself (important edge case)
            if (parent.UserId != userId)
            {
                await _notificationService.SendNotificationAsync(
                    receiverId: parent.UserId,
                    senderId: userId,
                    message: $"{user.Name} replied to your comment on \"{parent.Book.Title}\"",
                    type: NotificationType.COMMENT_REPLIED,
                    commentId: comment.Id,
                    bookId: parent.BookId
                );
            }
        }
        public async Task DeleteComment(int userId, int commentId)
        {
            var comment = await _commentRepo.GetFirstOrDefaultAsync(
                c => c.Id == commentId,
                includes: new[] { "Replies", "Notifications", "Replies.Notifications" } // ✅ important
            );

            if (comment == null)
                throw new Exception("Comment not found");

            if (comment.UserId != userId)
                throw new Exception("You can only delete your own comments");

            // ✅ 1. Delete notifications of replies
            foreach (var reply in comment.Replies.ToList())
            {
                foreach (var notif in reply.Notifications.ToList())
                {
                    _notificationRepo.Delete(notif);
                }

                _commentRepo.Delete(reply);
            }

            // ✅ 2. Delete notifications of main comment
            foreach (var notif in comment.Notifications.ToList())
            {
                _notificationRepo.Delete(notif);
            }

            // ✅ 3. Delete main comment
            _commentRepo.Delete(comment);

            await _commentRepo.SaveAsync();
        }
        public async Task<List<CommentDTO>> GetBookCommentsAsync(int bookId)
        {
            var comments = await _commentRepo.GetAllAsync(
                criteria: c => c.BookId == bookId && c.ParentId == null,
                includes: new[]
                {
            "User",
            "Replies",
            "Replies.User"
                }
            );

            return comments.Select(c => new CommentDTO
            {
                Id = c.Id,
                Content = c.Content,
                UserId = c.UserId,
                CreatedAt = c.CreatedAt,

                User = c.User == null ? null : new UserDTO
                {
                    Id = c.User.Id,
                    Name = c.User.Name,
                    Role = c.User.Role.ToString()
                },

                Replies = c.Replies.Select(r => new ReplyDTO
                {
                    Id = r.Id,
                    Content = r.Content,
                    UserId = r.UserId,
                    CreatedAt = r.CreatedAt,

                    User = r.User == null ? null : new UserDTO
                    {
                        Id = r.User.Id,
                        Name = r.User.Name,
                        Role = r.User.Role.ToString()
                    }
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
            comment.UpdatedAt = DateTime.Now;

            await _commentRepo.UpdateAsync(comment);
            await _commentRepo.SaveAsync();
        }
    }
}
