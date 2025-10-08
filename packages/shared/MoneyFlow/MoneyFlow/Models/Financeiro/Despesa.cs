namespace MoneyFlow.Models.Financeiro
{
    public class Despesa
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public double Valor { get; set; }
        public DateTime Data { get; set; }
        public string Categoria { get; set; }
        public int UsuarioId { get; set; }
    }
}