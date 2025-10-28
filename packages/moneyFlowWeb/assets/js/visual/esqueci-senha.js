document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');
    const emailInput = document.getElementById('email');
    const messageContainer = document.getElementById('message-container');
    const submitButton = document.getElementById('submit-button');

    form.addEventListener('submit', async (event) => {
        // 1. Impede o comportamento padrão de recarregar a página
        event.preventDefault();

        // Limpa mensagens antigas e desabilita o botão
        messageContainer.innerHTML = '';
        messageContainer.className = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        const email = emailInput.value;

        try {
            // 2. Envia a requisição para o backend
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });
            
            // O backend deve sempre responder com sucesso para não vazar informações
            // A mensagem de sucesso é genérica de propósito
            messageContainer.className = 'success';
            messageContainer.textContent = 'Se um usuário com este e-mail existir em nosso sistema, um link para redefinição de senha foi enviado.';

        } catch (error) {
            // 3. Trata erros de rede ou do servidor
            messageContainer.className = 'error';
            messageContainer.textContent = 'Ocorreu um erro ao tentar enviar sua solicitação. Tente novamente mais tarde.';
        } finally {
            // 4. Reabilita o botão, independentemente do resultado
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar link de recuperação';
        }
    });
});