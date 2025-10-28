// Seleciona o formulário
const registerForm = document.getElementById("register-form");

// Escuta o evento de envio
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o reload da página

    // Coleta os dados do formulário
    const nome = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
        // Faz a requisição à API (mesmo endpoint do Swagger)
        const response = await fetch("http://localhost:4000/api/Usuario/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, email, senha })
        });

        if (response.ok) {
            const data = await response.json();
            alert("Usuário cadastrado com sucesso!");
            console.log("Resposta da API:", data);

            // Redirecionar, se quiser:
            window.location.href = "newdashboard.html";
        } else {
            const error = await response.json();
            alert("Erro ao registrar: " + (error.message || "Verifique os dados."));
        }

    } catch (err) {
        console.error("Erro de conexão com o servidor:", err);
        alert("Erro de conexão com o servidor. Verifique se a API está rodando.");
    }
});
