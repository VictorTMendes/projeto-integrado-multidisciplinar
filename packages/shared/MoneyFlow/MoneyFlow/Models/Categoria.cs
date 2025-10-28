namespace MoneyFlow.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;

        public ICollection<Despesa> Despesas { get; set; } = new List<Despesa>();
        public ICollection<Renda> Rendas { get; set; } = new List<Renda>();
    }
}