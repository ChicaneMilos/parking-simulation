using Microsoft.EntityFrameworkCore;
using GarageParking.Entities;

namespace GarageParking.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        public DbSet<Garage> Garages { get; set; }
    }
}
