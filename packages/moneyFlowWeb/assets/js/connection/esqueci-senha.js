const apiBaseTeste = "https://localhost:7249/api/recuperacaosenha"; 
const apiUrl = "https://moneyflowapi-1.onrender.com/api/recuperacaosenha"; // Produção

document.getElementById("forgot-password-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const messageContainer = document.getElementById("message-container");

    messageContainer.innerHTML = "Enviando...";

    try {
        const res = await fetch(`${apiBaseTeste}/esqueci-senha`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const result = await res.text();

        if (!res.ok) {
            messageContainer.innerHTML = `<p style="color:red;">${result}</p>`;
            return;
        }

        messageContainer.innerHTML = 
            `<p style="color:green;">Se este e-mail existir, enviaremos o link de recuperação.</p>`;

    } catch (error) {
        console.error(error);
        messageContainer.innerHTML = `<p style="color:red;">Erro ao conectar com servidor.</p>`;
    }
});
