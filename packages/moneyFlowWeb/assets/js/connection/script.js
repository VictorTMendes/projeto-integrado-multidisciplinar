document.getElementById("sign-in-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email-login").value;
  const senha = document.getElementById("password-login").value;

  const data = await loginUsuario(email, senha);
  alert(data.message || "Login efetuado!");
});

document.getElementById("sign-up-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  const data = await registrarUsuario(nome, email, senha);
  alert("Usuário registrado: " + data.nome);
});