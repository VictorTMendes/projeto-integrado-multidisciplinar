using MoneyFlow.Models.Usuario;

namespace MoneyFlow.Services
{
    public class UsuarioService
    {
        private readonly List<Usuario> _usuarios = new();
        private int _idCounter = 1;

        public Usuario Registrar(Usuario usuario)
        {
            usuario.Id = _idCounter++;
            _usuarios.Add(usuario);
            return usuario;
        }

        public Usuario? Login(string email, string senha)
        {
            return _usuarios.FirstOrDefault(u => u.Email == email && u.Password == senha);
        }

        public IEnumerable<Usuario> Listar()
        {
            return _usuarios;
        }
    }
}
