using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Models;
using MoneyFlow.Models.Financeiro;

namespace MoneyFlow.Context
{
    public class MoneyFlowContext : DbContext
    {
        public MoneyFlowContext(DbContextOptions<MoneyFlowContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Renda> Rendas { get; set; }
        public DbSet<Despesa> Despesas { get; set; }
        //public DbSet<Categoria> Categorias { get; set; }
        // adicione outros DbSets aqui (Ex: Transacoes, Categorias etc.)
    }
}