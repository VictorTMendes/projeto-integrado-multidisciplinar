// ✅ usuario-info.js
// Exibe nome e e-mail do usuário nas telas com sidebar

const API_BASE = "https://moneyflowapi-1.onrender.com/api";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");
  const usuarioNome = localStorage.getItem("usuarioNome");
  const usuarioEmail = localStorage.getItem("usuarioEmail");

  // 🔒 Redireciona se não estiver logado
  if (!token) {
    window.location.href = "/pages/login/login.html";
    return;
  }

  // 🔹 Logs de debug (pode remover depois)
  console.log("DEBUG usuario-info.js", { usuarioId, usuarioNome, usuarioEmail });

  // 🔹 Atualiza o HTML
  const nomeEl = document.getElementById("profile-name");
  const emailEl = document.getElementById("profile-email");

  if (nomeEl) nomeEl.textContent = usuarioNome || "Usuário não identificado";
  if (emailEl) emailEl.textContent = usuarioEmail || "Email não disponível";

  // 🔹 Botão de logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "/pages/login/login.html";
    });
  }
});
