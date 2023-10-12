namespace SomeDomain.Data
{
    using Microsoft.EntityFrameworkCore;
    using SomeDomain.Data.Infrastructure;

    public class DataContext : DbContext
    {
        public DataContext(string connectionString)
            : base(new DbContextOptionsBuilder().UseMySQL(connectionString).Options)
        {
        }

        public DbSet<Entities.Domain> Domain { get; set; }
        public DbSet<Entities.DomainOffer> DomainOffers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Entities.Domain>(entity => entity.ToTable("domains"));
            builder.Entity<Entities.DomainOffer>(entity => entity.ToTable("domain_offers"));
           
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(bool))
                    {
                        property.SetValueConverter(new BoolToIntConverter());
                    }
                }
            }
        }
    }
}