using BookCircle.Data;
using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Implementations;
using BookCircle.Data.Repositories.Intefaces;
using BookCircle.DTOs.Books;
using BookCircle.Hubs;
using BookCircle.Services;
using BookCircle.Services.Implementations;
using BookCircle.Services.Interfaces;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));


builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IAuthService,AuthService>();
//builder.Services.AddScoped<IBookRepository, BookRepository>();
////builder.Services.AddScoped<IUserRepository, UserRepository>();
////builder.Services.AddScoped<IReactionRepository, ReactionRepository>();

//builder.Services.AddScoped<ICommentRepository, CommentRepository>();
//builder.Services.AddScoped<IBookRequestRepository, BorrowRequestRepository>();
//builder.Services.AddScoped<IReadingListBookRepository, ReadingListBookRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IReadingListService, ReadingListService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IBorrowRequestService, BorrowRequestService>();
builder.Services.AddScoped<IReactionService, ReactionService>();
//builder.Services.AddScoped<IReadingListRepository, ReadingListRepository>();

builder.Services.AddSignalR();
builder.Services.AddScoped<INotificationService, NotificationService>();
//builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddControllers()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(
        new JsonStringEnumConverter()
    );
});


builder.Services.AddHangfire(config =>
    config.UseSqlServerStorage(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!))
    };
});
var app = builder.Build();
app.UseCors("AllowReactApp");
app.UseHangfireDashboard();

using (var scope = app.Services.CreateScope())
{
    var recurringJob = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();
    var bookService = scope.ServiceProvider.GetRequiredService<IBookService>();

    recurringJob.AddOrUpdate(
        "sync-book-status",
        () => bookService.UpdateBookStatuses(),
        Cron.Daily);
}

app.MapHub<NotificationHub>("/hubs/notifications");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
