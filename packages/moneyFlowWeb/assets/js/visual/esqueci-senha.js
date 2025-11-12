document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');
    const emailInput = document.getElementById('email');
    const messageContainer = document.getElementById('message-container');
    const submitButton = document.getElementById('submit-button');

    form.addEventListener('submit', async (event) => {
        
        event.preventDefault();

        messageContainer.innerHTML = '';
        messageContainer.className = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        const email = emailInput.value;

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });
            
            messageContainer.className = 'success';
            messageContainer.textContent = 'Se um usuário com este e-mail existir em nosso sistema, um link para redefinição de senha foi enviado.';

        } catch (error) {
            messageContainer.className = 'error';
            messageContainer.textContent = 'Ocorreu um erro ao tentar enviar sua solicitação. Tente novamente mais tarde.';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar link de recuperação';
        }
    });
});