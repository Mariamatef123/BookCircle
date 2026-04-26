using BookCircle.Data.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCircle.DTOs.ReadingLists
{
    public class ReadingListDTO
    {
     
      public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }


    }
}
