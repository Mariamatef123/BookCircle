using BookCircle.Data.Models;
using BookCircle.Data.Repositories.Intefaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Security.Cryptography;

namespace BookCircle.Data.Repositories.Implementations
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _db;

        public AuthRepository(DataContext db)
        {
            _db = db;
        }

        public async Task<User?> Login(string email, string password)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
            {
                return null;
            }

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }

            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))//use the same salt used during registration
            {
                var computedHash = hmac.ComputeHash(
                    System.Text.Encoding.UTF8.GetBytes(password)
                );
//Convert password to bytes
// Hash it using HMACSHA512 +salt
//Produce new hash
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
            }//compare every byte

            return true;
        }//check pass correct or not
// password user input 
//passwordHash stored hashed password from DB
//passwordSalt random key used during hashing

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;

            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(
            string password,
            out byte[] passwordHash,
            out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;

                passwordHash = hmac.ComputeHash(
                    System.Text.Encoding.UTF8.GetBytes(password)
                );
            }
        }

        public async Task<bool> UserExist(string email)
        {
            return await _db.Users.AnyAsync(x => x.Email == email);
        }
    }
}