using BookCircle.Data.Repositories.Intefaces;
using BookCircle.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Org.BouncyCastle.Utilities;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly DataContext _context;//bridge to db, database connection manager
//It knows:
//    which database you are using
//    all tables
//    how to save changes
    protected readonly DbSet<T> _dbSet;//table dynamically

    public GenericRepository(DataContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
        //connects to db
        // points _dbSet to correct table
        //its dependency injection
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
        //it represent single row from table e.Id
     //can be return await _dbSet.FindAsync(id);
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
        await _context.SaveChangesAsync();
    }
    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }//update whole object and overwrite the database row with it
    public async Task<T?> UpdateAsync(int id, T newEntity)
    {
        var existingEntity = await _dbSet.FindAsync(id);

        if (existingEntity == null)
            return null;

        _context.Entry(existingEntity).CurrentValues.SetValues(newEntity);

        return existingEntity;
    }//get values and update the old value but with same id if value not changes remained
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
}//get all record from table match this condition
    //Func<Book, bool> predicate = b => b.Price > 100;

    //IEnumerable read-only query results not add,remove from the collection lightweight best for db
    public async Task<IEnumerable<T>> GetAllAsync(
    Expression<Func<T, bool>>? criteria = null,
    string[]? includes = null)
    {
        IQueryable<T> query = _dbSet;//start building sql

        if (criteria != null)
            query = query.Where(criteria);

        if (includes != null)//like join
            foreach (var include in includes)
                query = query.Include(include);

        return await query.AsNoTracking().ToListAsync();//low memory storage Just give me the document and forget about it
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
       //include: q => q.Include(x => x.Author).Include(x => x.Category)
       string[]? includes = null,
       bool tracked = true
   )
        //tracked true
// loads entity
// starts tracking it
// detects changes automatically
     //tracked false
//does NOT track entity
//ignores changes
//no update generated
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
    //Does at least one record exist?


    public IQueryable<T> GetQueryable(
        Expression<Func<T, bool>>? criteria = null)
    {
        IQueryable<T> query = _dbSet;

        if (criteria != null)
            query = query.Where(criteria);

        return query.AsNoTracking();
    }//can add the where,... later not can make it in findAsync bec execute immediately
}