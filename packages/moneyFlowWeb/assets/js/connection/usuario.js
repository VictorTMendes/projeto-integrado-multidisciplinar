const apiUrl = "https://moneyflowapi-1.onrender.com/api/usuarios";

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nome: e.target.name.value,
    email: e.target.email.value,
    senha: e.target.password.value,
  };

  try {
    const res = await fetch(`${apiUrl}/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      alert(errorText || "Erro ao registrar usuário.");
      return;
    }

    const result = await res.json();

    // Armazena dados básicos do usuário
    localStorage.setItem("usuarioId", result.usuario.Id);
    localStorage.setItem("usuarioNome", result.usuario.Nome);
    localStorage.setItem("usuarioEmail", result.usuario.Email);

    // Exibe mensagem e redireciona
    alert(result.message || "Usuário criado com sucesso!");
    localStorage.setItem("token", result.token);
    window.location.href = "./../newdashboard/newdashboard.html";

  } catch (error) {
    console.error("Erro no registro:", error);
    alert("Erro de conexão com o servidor.");
  }
});

document.getElementById("sign-in-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: e.target["email-login"].value,
    senha: e.target["password-login"].value,
  };

  try {
    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      alert(error || "Falha no login");
      return;
    }

    const result = await res.json();

    // Salva o usuário (e token, se houver) no localStorage
    localStorage.setItem("usuarioId", result.usuario.Id);
    localStorage.setItem("usuarioNome", result.usuario.Nome);
    localStorage.setItem("usuarioEmail", result.usuario.Email);

    localStorage.setItem("token", result.token);
    window.location.href = "./../newdashboard/newdashboard.html";


  } catch (error) {
    console.error("Erro:", error);
    alert("Erro de conexão com o servidor");
  }
});
