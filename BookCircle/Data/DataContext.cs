using BookCircle.Data.Models;
using BookCircle.Enum;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace BookCircle.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        //public DbSet<Admin> Admins { get; set; }
        //public DbSet<BookOwner> BookOwners { get; set; }
        //public DbSet<Reader> Readers { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<AvailabilityDate> AvailabilityDates { get; set; }
        //public DbSet<Post> Posts { get; set; }
        public DbSet<BorrowRequest> BorrowRequests { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<ReadingList> ReadingLists { get; set; }
        public DbSet<ReadingListBook> ReadingListBooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<ReadingListBook>()
                .HasKey(x => new { x.ReadingListId, x.BookId });


            modelBuilder.Entity<ReadingListBook>()
                .HasOne(rlb => rlb.ReadingList)
                .WithMany(rl => rl.ReadingListBooks)
                .HasForeignKey(rlb => rlb.ReadingListId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Book>()
    .HasOne(b => b.Owner)
    .WithMany(u => u.OwnedBooks)
    .HasForeignKey(b => b.OwnerId)
    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Book>()
                .HasOne(b => b.CurrentBorrower)
                .WithMany(u => u.BorrowedBooks)
                .HasForeignKey(b => b.CurrentBorrowerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
    .HasOne(n => n.Receiver)
    .WithMany(u => u.Notifications)
    .HasForeignKey(n => n.ReceiverId)
    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Sender)
                .WithMany(u => u.SentNotifications)
                .HasForeignKey(n => n.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
    .HasOne(c => c.Parent)
    .WithMany(c => c.Replies)
    .HasForeignKey(c => c.ParentId)
    .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Book>()
    .HasOne(b => b.Owner)
    .WithMany(u => u.OwnedBooks)
    .HasForeignKey(b => b.OwnerId)
    .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Reaction>()
        .HasKey(r => new { r.BookId, r.UserId });





            modelBuilder.Entity<BorrowRequest>()
    .HasOne(br => br.Book)
    .WithMany(b => b.BorrowRequests)
    .HasForeignKey(br => br.BookId)
    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BorrowRequest>()
    .HasOne(br => br.AvailabilityDate)
    .WithMany()
    .HasForeignKey(br => br.AvailabilityDateId)
    .OnDelete(DeleteBehavior.Restrict);

            //        modelBuilder.Entity<WaitingList>()
            //.HasIndex(w => new { w.BookId, w.UserId })
            //.IsUnique();

            //        modelBuilder.Entity<WaitingList>()
            //            .HasOne(w => w.Book)
            //            .WithMany(b => b.WaitingLists)
            //            .HasForeignKey(w => w.BookId);

            //        modelBuilder.Entity<WaitingList>()
            //            .HasOne(w => w.User)
            //            .WithMany(u => u.WaitingLists)
            //            .HasForeignKey(w => w.UserId);

        }
    }
}