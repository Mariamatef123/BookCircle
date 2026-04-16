using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly DataContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(DataContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FirstOrDefaultAsync(e =>
            EF.Property<int>(e, "Id") == id);
    }
    public async Task<T?> DeleteByIdAsync(int id)
    {
        var entity = await _dbSet.FindAsync(id);

        if (entity == null)
            return null;

        _dbSet.Remove(entity);

        return entity;
    }


    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }
    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }
    public async Task<T?> UpdateAsync(int id, T newEntity)
    {
        var existingEntity = await _dbSet.FindAsync(id);

        if (existingEntity == null)
            return null;

        _context.Entry(existingEntity).CurrentValues.SetValues(newEntity);

        return existingEntity;
    }
    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }

public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
{
    return await _dbSet.Where(predicate).ToListAsync();
}
}