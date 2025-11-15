document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("passwordForm");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const messageContainer = document.getElementById("message-container");
    const loadingOverlay = document.getElementById("loadingOverlay");

    // PEGAR TOKEN DA URL
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
        showMessage("Token não encontrado. Abra o link enviado no e-mail.", "error");
        form.style.display = "none";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const novaSenha = passwordInput.value.trim();
        const confirmarSenha = confirmPasswordInput.value.trim();

        // VALIDAR SENHAS
        if (novaSenha !== confirmarSenha) {
            showMessage("As senhas não coincidem!", "error");
            return;
        }

        if (novaSenha.length < 6) {
            showMessage("A senha deve ter pelo menos 6 caracteres.", "error");
            return;
        }

        // Mostrar loading
        loadingOverlay.style.display = "flex";

        try {
            const response = await fetch("https://moneyflowapi-1.onrender.com/api/RecuperacaoSenha/resetar-senha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    novaSenha: novaSenha
                })
            });

            const result = await response.text();

            if (!response.ok) {
                showMessage("Erro: " + result, "error");
                loadingOverlay.style.display = "none";
                return;
            }

            // *** SE TUDO DEU CERTO ***
            showMessage("Senha redefinida com sucesso! Redirecionando...", "success");

            setTimeout(() => {
                window.location.href = "./login.html";
            }, 2000);

        } catch (error) {
            console.error("Erro:", error);
            showMessage("Erro de conexão com o servidor.", "error");
        } finally {
            loadingOverlay.style.display = "none";
        }
    });

    // Exibir mensagens
    function showMessage(msg, type) {
        messageContainer.textContent = msg;
        messageContainer.className = type === "error" ? "msg-error" : "msg-success";
    }
});

// Mostrar / esconder senha
function togglePassword(fieldId, btn) {
    const input = document.getElementById(fieldId);
    input.type = input.type === "password" ? "text" : "password";
}
