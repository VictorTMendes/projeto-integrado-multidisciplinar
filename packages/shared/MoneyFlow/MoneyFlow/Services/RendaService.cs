using MoneyFlow.Models.Financeiro;
using System.Xml.Linq;

namespace MoneyFlow.Services
{
    public class RendaService
    {
        private readonly List<Renda> _rendas = new();
        private int _idCounter = 1;

        public Renda AdicionarRenda(Renda renda)
        {
            renda.Id = _idCounter++;
            _rendas.Add(renda);
            return renda;
        }

        public IEnumerable<Renda> ListarTodas()
        {
            return _rendas;
        }

        public Renda? BuscarPorId(int id)
        {
            return _rendas.FirstOrDefault(r => r.Id == id);
        }

        public IEnumerable<Renda> ListarPorUsuario(int usuarioId)
        {
            return _rendas.Where(r => r.UsuarioId == usuarioId);
        }

        public IEnumerable<Renda> ListarPorCategoria(string categoria)
        {
            return _rendas.Where(r => r.Categoria.Equals(categoria, StringComparison.OrdinalIgnoreCase));
        }

        public Renda? AtualizarRenda(int id, Renda rendaAtualizada)
        {
            var renda = BuscarPorId(id);
            if (renda == null)
                return null;

            renda.Nome = rendaAtualizada.Nome;
            renda.Descricao = rendaAtualizada.Descricao;
            renda.Valor = rendaAtualizada.Valor;
            renda.Data = rendaAtualizada.Data;
            renda.Categoria = rendaAtualizada.Categoria;
            renda.UsuarioId = rendaAtualizada.UsuarioId;

            return renda;
        }

        public bool ExcluirRenda(int id)
        {
            var renda = BuscarPorId(id);
            if (renda == null)
                return false;

            _rendas.Remove(renda);
            return true;
        }

        public double SomarTotal(int usuarioId)
        {
            return _rendas.Where(r => r.UsuarioId == usuarioId).Sum(r => r.Valor);
        }
    }
}