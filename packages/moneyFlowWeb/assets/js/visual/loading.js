document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('sign-in-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    const loginButton = loginForm ? loginForm.querySelector('button[type="submit"]') : null;

    const messageArea = document.getElementById('login-message-area'); 

    if (loginForm && loadingOverlay && loginButton) {
        
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            
            if (messageArea) messageArea.textContent = '';

            loadingOverlay.classList.add('show');
            loginButton.disabled = true;

            const email = document.getElementById('email-login').value;
            const senha = document.getElementById('password-login').value;

            fazerLogin(email, senha);
        });
    }

    /**
     * Função de Login (Simulada)
   
     */
    async function fazerLogin(email, senha) {
        
        try {

            await new Promise(resolve => setTimeout(resolve, 2000));

            if (email === 'teste@gmail.com' && senha === '123') {

                window.location.href = '../dashboard/newdashboard.html';
                

            } else {
                
                // FALHA (Login/Senha errados):
                // Lança um erro para ser pego pelo "catch"
                // throw new Error('Email ou senha inválidos.');
            }

        } catch (error) {
            
            // --- 3. CONTROLE DE ERRO (QUALQUER FALHA) ---
            
            console.error('Falha no login:', error.message);
            
            // Mostra o erro para o usuário
            if (messageArea) {
                messageArea.textContent = error.message;
            } else {
                alert(error.message); // Fallback se a 'messageArea' não existir
            }

            // ESCONDE o carregador
            if (loadingOverlay) {
                loadingOverlay.classList.remove('show');
            }
            
            // REABILITA o botão para o usuário tentar de novo
            if (loginButton) {
                loginButton.disabled = false;
            }
        }
        // O 'finally' foi removido daqui propositalmente.
    }
});