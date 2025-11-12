const apiUrl = "https://moneyflowapi-1.onrender.com/api/usuarios";
const apiBaseTeste = "https://localhost:7249/api"

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
    localStorage.setItem("usuarioId", result.usuario.id);
    localStorage.setItem("usuarioNome", result.usuario.nome);
    localStorage.setItem("usuarioEmail", result.usuario.email);

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
    console.log("RETORNO DA API DE LOGIN:", result);

    // Salva o usuário (e token, se houver) no localStorage
    localStorage.setItem("usuarioId", result.usuario.id);
    localStorage.setItem("usuarioNome", result.usuario.nome);
    localStorage.setItem("usuarioEmail", result.usuario.email);

    localStorage.setItem("token", result.token);
    window.location.href = "./../newdashboard/newdashboard.html";


  } catch (error) {
    console.error("Erro:", error);
    alert("Erro de conexão com o servidor");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteBtn = document.getElementById("delete-account-btn");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const usuarioId = localStorage.getItem("usuarioId");
      const token = localStorage.getItem("token");

      if (!usuarioId || !token) {
        alert("Erro: usuário não autenticado.");
        return;
      }

      const confirmacao = confirm(
        "Tem certeza que deseja excluir sua conta?\n\nTodos os seus dados financeiros serão apagados permanentemente."
      );
      if (!confirmacao) return;

      try {
        const res = await fetch(`${apiBaseTeste}/excluir/${usuarioId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const erro = await res.text();
          alert("Erro ao excluir conta: " + erro);
          return;
        }

        alert("Conta excluída com sucesso!");
        localStorage.clear();
        window.location.href = "../login/login.html"; // redireciona para login
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert("Falha de conexão com o servidor.");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const confirmar = confirm("Tem certeza que deseja sair da conta?");
      if (!confirmar) return;

      localStorage.clear();
      window.location.href = "../../../src/pages/login/login.html";
    });
  }
});
