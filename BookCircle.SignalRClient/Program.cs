using Microsoft.AspNetCore.SignalR.Client;

var userId = 4;

var connection = new HubConnectionBuilder()
    .WithUrl($"https://localhost:7071/hubs/notifications?userId={userId}")
    .Build();

connection.On<object>("ReceiveNotification", notification =>
{
    Console.WriteLine("🔔 New Notification:");
    Console.WriteLine(notification);
});

await connection.StartAsync();

Console.WriteLine("Connected to SignalR...");
Console.ReadLine();