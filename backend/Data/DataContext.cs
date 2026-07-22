using Microsoft.EntityFrameworkCore;
using VacationPlusNewAPI.Models;

namespace VacationPlusNewAPI.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }

    public DbSet<User> Users { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Unit> Units { get; set; }
    public DbSet<VacationInterval> VacationIntervals { get; set; }
    public DbSet<VacationYear> VacationYears { get; set; }
}