namespace MoneyFlow.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public DateTime DataCriacao { get; set; } = DateTime.Now;


        public ICollection<Despesa> Despesas { get; set; } = new List<Despesa>();
        public ICollection<Renda> Rendas { get; set; } = new List<Renda>();
    }
}
