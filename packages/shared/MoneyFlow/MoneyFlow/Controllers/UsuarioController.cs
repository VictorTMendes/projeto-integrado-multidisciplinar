using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using MoneyFlow.Models.Usuario;

namespace MoneyFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [HttpPost("registro")]
        public IActionResult Registro([FromBody] Usuario user)
        {
            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            return Ok();
        }
    }
}