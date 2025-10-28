// Registrar usuário
async function registrarUsuario(nome, email, senha) {
  return await apiRequest("/Usuario/registrar", "POST", { nome, email, senha });
}

// Login de usuário
async function loginUsuario(email, senha) {
  return await apiRequest("/Usuario/login", "POST", { email, senha });
}
