using BookCircle.Data.Models;
using BookCircle.Enum;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace BookCircle.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<BookOwner> BookOwners { get; set; }
        public DbSet<Reader> Readers { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<AvailabilityDate> AvailabilityDates { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<BorrowRequest> BorrowRequests { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<ReadingList> ReadingLists { get; set; }
        public DbSet<ReadingListBook> ReadingListBooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // TPH: all user types in one Users table
            modelBuilder.Entity<User>()
                .HasDiscriminator<Role>("Role")
                .HasValue<Admin>(Role.ADMIN)
                .HasValue<BookOwner>(Role.BOOK_OWNER)
                .HasValue<Reader>(Role.READER);

            // Unique email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // One reaction per (Reader, Book)
            modelBuilder.Entity<Reaction>()
                .HasIndex(r => new { r.ReaderId, r.BookId })
                .IsUnique();

            // Composite PK for ReadingListBook junction table
            modelBuilder.Entity<ReadingListBook>()
                .HasKey(rlb => new { rlb.ReadingListId, rlb.BookId });

            // Comment self-reference — restrict to avoid cascade cycle
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Parent)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Book → BookOwner — restrict to prevent accidental owner deletion
            modelBuilder.Entity<Book>()
                .HasOne(b => b.Owner)
                .WithMany(o => o.Books)
                .HasForeignKey(b => b.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // BorrowRequest → Reader — restrict cascade
            modelBuilder.Entity<BorrowRequest>()
                .HasOne(br => br.Reader)
                .WithMany(r => r.BorrowRequests)
                .HasForeignKey(br => br.ReaderId)
                .OnDelete(DeleteBehavior.Restrict);

            // One post per book
            modelBuilder.Entity<Post>()
                .HasIndex(p => p.BookId)
                .IsUnique();
        }
    }
}