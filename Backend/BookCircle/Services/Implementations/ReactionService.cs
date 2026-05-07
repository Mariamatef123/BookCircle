using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Enum;
using BookCircle.Enums;
using BookCircle.Services.Interfaces;

namespace BookCircle.Services.Implementations
{
    public class ReactionService : IReactionService
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Book> _bookRepo;
        private readonly IGenericRepository<Reaction> _reaction;
        private readonly INotificationService _notificationService;

        public ReactionService(IGenericRepository<User> userRepo, IGenericRepository<Book> bookRepo,  IGenericRepository<Reaction> reaction,  INotificationService _NotificationService)
        {

            _userRepo = userRepo;
            _bookRepo = bookRepo;
            _reaction = reaction;
            _notificationService = _NotificationService;
        }

        public async Task Like(int userId, int bookId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book == null)
                throw new Exception("Book not found");

            var existing = await _reaction.GetFirstOrDefaultAsync(
                criteria: r => r.BookId == bookId && r.UserId == userId
            );

            bool sendNotification = false;

            if (existing == null)
            {
                await _reaction.AddAsync(new Reaction
                {
                    UserId = userId,
                    BookId = bookId,
                    Type = ReactionType.LIKE,
                    CreatedAt = DateTime.Now
                });
                sendNotification = true;
            }
            else if (existing.Type == ReactionType.LIKE)
            {
                _reaction.Delete(existing);
            }
            else
            {
          
                existing.Type = ReactionType.LIKE;
                await _reaction.UpdateAsync(existing);
                sendNotification = true;
            }

            await _reaction.SaveAsync();

       
            if (sendNotification)
                await _notificationService.SendNotificationAsync(
                    receiverId: book.OwnerId,
                    senderId: userId,
                    message: $"{user.Name} liked your book {book.Title}",
                    type: NotificationType.BOOK_LIKED,
                    bookId: book.Id
                );
        }
        public async Task Dislike(int userId, int bookId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book == null)
                throw new Exception("Book not found");

            var existing = await _reaction.GetFirstOrDefaultAsync(
        criteria: r => r.BookId == bookId && r.UserId == userId
            ); ;

            if (existing == null)
            {

                await _reaction.AddAsync(new Reaction
                {
                    UserId = userId,
                    BookId = bookId,
                    Type = ReactionType.DISLIKE,
                    CreatedAt = DateTime.Now
                });
            }
            else if (existing.Type == ReactionType.DISLIKE)
            {

                _reaction.Delete(existing);
            }
            else
            {

                existing.Type = ReactionType.DISLIKE;
                await _reaction.UpdateAsync(existing);
            }

            await _reaction.SaveAsync();
            await _notificationService.SendNotificationAsync(
    receiverId: book.OwnerId,
    senderId: userId,
    message: $"{user.Name} disliked your book {book.Title}",
    type: NotificationType.BOOK_DISLIKED,
    bookId: book.Id
);
        }
        public async Task<IEnumerable<Reaction>> GetReactionsByBookId(int bookId)
        {
            var reactions = await _reaction.GetAllAsync(
       criteria: r => r.BookId == bookId,
       includes: new[] { "User" }
   );
            return reactions;
        }
    }
}
