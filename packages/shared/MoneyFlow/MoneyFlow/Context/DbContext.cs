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
        // adicione outros DbSets aqui (Ex: Transacoes, Categorias etc.)
    }
}