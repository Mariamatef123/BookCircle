using BookCircle.Data.Models;
using BookCircle.Enum;
using System.ComponentModel.DataAnnotations;

namespace BookCircle.DTOs.Users
{
    public class UserDTO
    {
     
            public int Id { get; set; }
            public string Email { get; set; }
        public string Password { get; set; }

        public string Name { get; set; }

            public string Role { get; set; }




        }
    }

