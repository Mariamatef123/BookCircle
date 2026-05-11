using Microsoft.AspNetCore.SignalR;

namespace BookCircle.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinUserGroup(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return;

            Console.WriteLine($"JOINED GROUP: user_{userId}");

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"user_{userId}"
            );
        }
    }
}