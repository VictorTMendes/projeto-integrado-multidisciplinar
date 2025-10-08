using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using MoneyFlow.DTO;
using MoneyFlow.Models.Usuario;
using MoneyFlow.Services;
using System.Collections.Generic;
using System.Linq;

namespace MoneyFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public UsuarioController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost("registrar")]
        public ActionResult<Usuario> Registrar([FromBody] Usuario usuario)
        {
            var novoUsuario = _usuarioService.Registrar(usuario);
            return Ok(novoUsuario);
        }

        [HttpPost("login")]
        public ActionResult Login([FromBody] UsuarioDTO request)
        {
            var usuario = _usuarioService.Login(request.Email, request.Password);

            if (usuario == null)
                return Unauthorized("Email ou senha incorretos!");

            return Ok(new { message = $"Bem-vindo {usuario.Name}!" });
        }

        [HttpGet("usuarios")]
        public ActionResult<IEnumerable<Usuario>> Listar()
        {
            return Ok(_usuarioService.Listar());
        }
    }
}