using Microsoft.AspNetCore.SignalR;

namespace BookCircle.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinUserGroup(string userId)
        {
            if (string.IsNullOrEmpty(userId)) return;

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"user_{userId}"
            );
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}