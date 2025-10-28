using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Models;

namespace MoneyFlow.Context
{
    public class MoneyFlowContext : DbContext
    {
        public MoneyFlowContext(DbContextOptions<MoneyFlowContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Renda> Rendas { get; set; }

        public DbSet<Despesa> Despesas { get; set; }

        public DbSet<Categoria> Categorias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // usado para trabalhar com herança de classes no banco de dados
            modelBuilder.Entity<ContaFinanceira>().UseTptMappingStrategy();

            base.OnModelCreating(modelBuilder);
        }
    }
}