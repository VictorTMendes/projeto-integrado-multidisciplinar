using Microsoft.AspNetCore.Mvc;
using MoneyFlow.Models;
using MoneyFlow.Services;

namespace MoneyFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RendaController : ControllerBase
    {
        private readonly RendaService _rendaService;

        public RendaController(RendaService rendaService)
        {
            _rendaService = rendaService;
        }

        [HttpPost]
        public ActionResult<Renda> AdicionarRenda([FromBody] Renda renda)
        {
            if (renda == null)
                return BadRequest("Dados inválidos!");

            var novaRenda = _rendaService.AdicionarRenda(renda);
            return CreatedAtAction(nameof(BuscarPorId), new { id = novaRenda.Id }, novaRenda);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Renda>> ListarTodas()
        {
            return Ok(_rendaService.ListarTodas());
        }

        [HttpGet("{id}")]
        public ActionResult<Renda> BuscarPorId(int id)
        {
            var renda = _rendaService.BuscarPorId(id);
            if (renda == null)
                return NotFound($"Renda com ID {id} não encontrada!");

            return Ok(renda);
        }

        [HttpGet("usuario/{usuarioId}")]
        public ActionResult<IEnumerable<Renda>> ListarPorUsuario(int usuarioId)
        {
            var rendas = _rendaService.ListarPorUsuario(usuarioId);
            return Ok(rendas);
        }

        [HttpGet("categoria/{categoria}")]
        public ActionResult<IEnumerable<Renda>> ListarPorCategoria(string categoria)
        {
            var rendas = _rendaService.ListarPorCategoria(categoria);
            return Ok(rendas);
        }

        [HttpPut("{id}")]
        public ActionResult<Renda> AtualizarRenda(int id, [FromBody] Renda renda)
        {
            var rendaAtualizada = _rendaService.AtualizarRenda(id, renda);
            if (rendaAtualizada == null)
                return NotFound($"Renda com ID {id} não encontrada!");

            return Ok(rendaAtualizada);
        }

        [HttpDelete("{id}")]
        public ActionResult ExcluirRenda(int id)
        {
            var resultado = _rendaService.ExcluirRenda(id);
            if (!resultado)
                return NotFound($"Renda com ID {id} não encontrada!");

            return Ok(new { message = "Renda excluída com sucesso!" });
        }

        [HttpGet("total/{usuarioId}")]
        public ActionResult<double> SomarTotal(int usuarioId)
        {
            var total = _rendaService.SomarTotal(usuarioId);
            return Ok(new { total });
        }
    }
}