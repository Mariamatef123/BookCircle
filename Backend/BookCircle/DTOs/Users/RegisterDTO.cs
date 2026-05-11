using BookCircle.Enum;
using System.ComponentModel.DataAnnotations;

namespace BookCircle.DTOs.Users
{
    public class RegisterDTO
    {

        [Required]
            public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
            public Role Role { get; set; }
        
    }
}
