using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using MoneyFlow.Models.Usuario;
using MoneyFlow.DTO;
using System.Linq;
using System.Collections.Generic;

namespace MoneyFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        // Armazenamento em memória (temporário até ter banco)
        private static readonly List<Usuario> _usuarios = new();
        private static int _nextId = 1;
        private static readonly object _lock = new();

        [HttpPost("registro")]
        public IActionResult Registro([FromBody] Usuario user)
        {
            if (user == null)
                return BadRequest("Payload inválido");

            if (string.IsNullOrWhiteSpace(user.Name))
                return BadRequest("Nome é obrigatório");
            if (string.IsNullOrWhiteSpace(user.Email))
                return BadRequest("Email é obrigatório");
            if (string.IsNullOrWhiteSpace(user.Password) || user.Password.Length < 6)
                return BadRequest("Senha deve ter no mínimo 6 caracteres");

            lock (_lock)
            {
                if (_usuarios.Any(u => u.Email.ToLower() == user.Email.ToLower()))
                    return Conflict("E-mail já cadastrado");

                user.Id = _nextId++;
                _usuarios.Add(user);
            }

            return Created($"api/usuario/{user.Id}", new
            {
                id = user.Id,
                nome = user.Name,
                email = user.Email
            });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserDTO userDTO)
        {
            if (userDTO == null)
                return BadRequest("Payload inválido");

            if (string.IsNullOrWhiteSpace(userDTO.Email) || string.IsNullOrWhiteSpace(userDTO.Password))
                return BadRequest("Email e senha são obrigatórios");

            Usuario? usuario;
            lock (_lock)
            {
                usuario = _usuarios.FirstOrDefault(u => u.Email.ToLower() == userDTO.Email.ToLower());
            }

            if (usuario == null)
                return Unauthorized("Credenciais inválidas");

            if (usuario.Password != userDTO.Password)
                return Unauthorized("Credenciais inválidas");

            var tokenFake = System.Convert.ToBase64String(System.Guid.NewGuid().ToByteArray());

            return Ok(new
            {
                token = tokenFake,
                user = new
                {
                    id = usuario.Id,
                    nome = usuario.Name,
                    email = usuario.Email
                }
            });
        }
    }
}