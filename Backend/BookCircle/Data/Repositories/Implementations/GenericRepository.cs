using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly DataContext _context;
    protected readonly DbSet<T> _dbSet;

    public GenericRepository(DataContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }
    public void RemoveRange(IEnumerable<T> entities)
    {
        _context.Set<T>().RemoveRange(entities);
         _context.SaveChangesAsync();
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


    public async Task<IEnumerable<T>> GetAllAsync(
    Expression<Func<T, bool>>? criteria = null,
    string[]? includes = null)
    {
        IQueryable<T> query = _dbSet;

        if (criteria != null)
            query = query.Where(criteria);

        if (includes != null)
            foreach (var include in includes)
                query = query.Include(include);

        return await query.AsNoTracking().ToListAsync();
    }


    public async Task<IEnumerable<T>> GetAllAsync(
        Expression<Func<T, bool>>? criteria = null,
        Expression<Func<T, object>>? orderBy = null,
        string orderByDirection = "ASC",
        string[]? includes = null)
    {
        IQueryable<T> query = _dbSet;

        if (criteria != null)
            query = query.Where(criteria);

        if (includes != null)
            foreach (var include in includes)
                query = query.Include(include);

        if (orderBy != null)
            query = orderByDirection == "DESC"
                ? query.OrderByDescending(orderBy)
                : query.OrderBy(orderBy);

        return await query.AsNoTracking().ToListAsync();
    }

    public async Task<T?> GetFirstOrDefaultAsync(
       Expression<Func<T, bool>>? criteria = null,
       Func<IQueryable<T>, IQueryable<T>>? include = null,
       string[]? includes = null,
       bool tracked = true
   )
    {
        IQueryable<T> query = _dbSet;

        if (!tracked)
            query = query.AsNoTracking();


        if (include != null)
            query = include(query);

     
        if (includes != null)
            foreach (var inc in includes)
                query = query.Include(inc);

        if (criteria != null)
            query = query.Where(criteria);

        return await query.FirstOrDefaultAsync();
    }

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> criteria)
            => await _dbSet.AnyAsync(criteria);
}