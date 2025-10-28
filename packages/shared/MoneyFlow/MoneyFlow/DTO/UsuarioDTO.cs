using MoneyFlow.Models;

namespace MoneyFlow.DTO
{
    public class UsuarioDTO : Usuario
    {
        public string Email { get; set; }

        public string Senha { get; set; }
    }
}
