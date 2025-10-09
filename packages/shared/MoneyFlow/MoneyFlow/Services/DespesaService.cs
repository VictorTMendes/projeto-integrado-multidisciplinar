using MoneyFlow.Models.Financeiro;
using System.Xml.Linq;

namespace MoneyFlow.Services
{
    public class DespesaService
    {
        private readonly List<Despesa> _despesas = new();
        private int _idCounter = 1;

        public Despesa AdicionarDespesa(Despesa despesa)
        {
            despesa.Id = _idCounter++;
            _despesas.Add(despesa);
            return despesa;
        }

        public IEnumerable<Despesa> ListarTodas()
        {
            return _despesas;
        }

        public Despesa? BuscarPorId(int id)
        {
            return _despesas.FirstOrDefault(d => d.Id == id);
        }

        public IEnumerable<Despesa> ListarPorUsuario(int usuarioId)
        {
            return _despesas.Where(d => d.UsuarioId == usuarioId);
        }

        public IEnumerable<Despesa> ListarPorCategoria(string categoria)
        {
            return _despesas.Where(d => d.Categoria.Equals(categoria, StringComparison.OrdinalIgnoreCase));
        }

        public Despesa? AtualizarDespesa(int id, Despesa despesaAtualizada)
        {
            var despesa = BuscarPorId(id);
            if (despesa == null)
                return null;

            despesa.Nome = despesaAtualizada.Nome;
            despesa.Descricao = despesaAtualizada.Descricao;
            despesa.Valor = despesaAtualizada.Valor;
            despesa.Data = despesaAtualizada.Data;
            despesa.Categoria = despesaAtualizada.Categoria;
            despesa.UsuarioId = despesaAtualizada.UsuarioId;

            return despesa;
        }

        public bool ExcluirDespesa(int id)
        {
            var despesa = BuscarPorId(id);
            if (despesa == null)
                return false;

            _despesas.Remove(despesa);
            return true;
        }

        public double SomarDespesas(int usuarioId)
        {
            return _despesas.Where(d => d.UsuarioId == usuarioId).Sum(d => d.Valor);
        }

        public double SubtrairTotal(int usuarioId, double valorTotal)
        {
            var totalDespesas = SomarDespesas(usuarioId);
            return valorTotal - totalDespesas;
        }
    }
}