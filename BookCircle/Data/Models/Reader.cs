namespace BookCircle.Data.Models
{
    public class Reader : User
    {
        public ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();

        public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
        public ICollection<ReadingList> ReadingLists { get; set; } = new List<ReadingList>();
    }
}
