
using System.Linq.Expressions;

namespace BookCircle.Data.Repositories.Intefaces
{
        public interface IGenericRepository<T> where T : class
        {
            Task<List<T>> GetAllAsync();
            Task<T?> GetByIdAsync(int id);

            Task AddAsync(T entity);
        Task UpdateAsync(T entity);
            void Delete(T entity);
        Task<T?> UpdateAsync(int id, T newEntity);
        Task<T?> DeleteByIdAsync(int id);

        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        Task SaveAsync();

       public void RemoveRange(IEnumerable<T> entities);
        Task<IEnumerable<T>> GetAllAsync(
            Expression<Func<T, bool>>? criteria = null,
            Expression<Func<T, object>>? orderBy = null,
            string orderByDirection = "ASC",
            string[]? includes = null
        );

        public  Task<T?> GetFirstOrDefaultAsync(
          Expression<Func<T, bool>>? criteria = null,
          Func<IQueryable<T>, IQueryable<T>>? include = null,
          string[]? includes = null,
          bool tracked = true
      );

        Task<bool> AnyAsync(Expression<Func<T, bool>> criteria);
    }
}
