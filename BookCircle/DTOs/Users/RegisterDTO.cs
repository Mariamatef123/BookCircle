using BookCircle.Enum;

namespace BookCircle.DTOs.Users
{
    public class RegisterDTO
    {
   
            public string Name { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public Role Role { get; set; }
        
    }
}
