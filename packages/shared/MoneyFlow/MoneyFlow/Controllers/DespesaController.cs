using Microsoft.AspNetCore.Mvc;
using MoneyFlow.Models.Financeiro;
using MoneyFlow.Services;

namespace MoneyFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DespesaController : ControllerBase
    {
        private readonly DespesaService _despesaService;

        public DespesaController(DespesaService despesaService)
        {
            _despesaService = despesaService;
        }

        [HttpPost]
        public ActionResult<Despesa> AdicionarDespesa([FromBody] Despesa despesa)
        {
            if (despesa == null)
                return BadRequest("Dados inválidos!");

            var novaDespesa = _despesaService.AdicionarDespesa(despesa);
            return CreatedAtAction(nameof(BuscarPorId), new { id = novaDespesa.Id }, novaDespesa);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Despesa>> ListarTodas()
        {
            return Ok(_despesaService.ListarTodas());
        }

        [HttpGet("{id}")]
        public ActionResult<Despesa> BuscarPorId(int id)
        {
            var despesa = _despesaService.BuscarPorId(id);
            if (despesa == null)
                return NotFound($"Despesa com ID {id} não encontrada!");

            return Ok(despesa);
        }

        [HttpGet("usuario/{usuarioId}")]
        public ActionResult<IEnumerable<Despesa>> ListarPorUsuario(int usuarioId)
        {
            var despesas = _despesaService.ListarPorUsuario(usuarioId);
            return Ok(despesas);
        }

        [HttpGet("categoria/{categoria}")]
        public ActionResult<IEnumerable<Despesa>> ListarPorCategoria(string categoria)
        {
            var despesas = _despesaService.ListarPorCategoria(categoria);
            return Ok(despesas);
        }

        [HttpPut("{id}")]
        public ActionResult<Despesa> AtualizarDespesa(int id, [FromBody] Despesa despesa)
        {
            var despesaAtualizada = _despesaService.AtualizarDespesa(id, despesa);
            if (despesaAtualizada == null)
                return NotFound($"Despesa com ID {id} não encontrada!");

            return Ok(despesaAtualizada);
        }

        [HttpDelete("{id}")]
        public ActionResult ExcluirDespesa(int id)
        {
            var resultado = _despesaService.ExcluirDespesa(id);
            if (!resultado)
                return NotFound($"Despesa com ID {id} não encontrada!");

            return Ok(new { message = "Despesa excluída com sucesso!" });
        }

        [HttpGet("total/{usuarioId}")]
        public ActionResult<double> SomarDespesas(int usuarioId)
        {
            var total = _despesaService.SomarDespesas(usuarioId);
            return Ok(new { total });
        }
    }
}