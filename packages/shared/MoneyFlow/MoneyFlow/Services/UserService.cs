using MoneyFlow.Context;
using MoneyFlow.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace MoneyFlow.Services
{
    public class UsuarioService
    {
        private readonly MoneyFlowContext _context;

        public UsuarioService(MoneyFlowContext context)
        {
            _context = context;
        }

        public Usuario Registrar(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            _context.SaveChanges(); // <-- Agora grava no banco
            return usuario;
        }

        public Usuario? Login(string email, string senha)
        {
            return _context.Usuarios
                .FirstOrDefault(u => u.Email == email && u.Senha == senha);
        }

        public IEnumerable<Usuario> Listar()
        {
            return _context.Usuarios.AsNoTracking().ToList();
        }
    }
}
