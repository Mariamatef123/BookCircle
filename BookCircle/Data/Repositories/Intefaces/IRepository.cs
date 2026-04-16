namespace BookCircle.Data.Repositories.Intefaces
{
        public interface IRepository<T> where T : class
        {
            Task<List<T>> GetAllAsync();
            Task<T?> GetByIdAsync(int id);

            Task AddAsync(T entity);
        Task UpdateAsync(T entity);
            void Delete(T entity);
        Task<T?> UpdateAsync(int id, T newEntity);
        Task<T?> DeleteByIdAsync(int id);



            Task SaveAsync();
        
    }
}
