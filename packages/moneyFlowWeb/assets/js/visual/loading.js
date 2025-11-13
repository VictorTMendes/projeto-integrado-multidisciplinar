document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PEGANDO TODOS OS ELEMENTOS ---
    const loginForm = document.getElementById('sign-in-form');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Assumindo que seu botão de login está DENTRO do formulário
    const loginButton = loginForm ? loginForm.querySelector('button[type="submit"]') : null;
    
    // Assumindo que você tem uma área de mensagem (se não tiver, o "alert" no catch funcionará)
    // Você pode criar um <p id="login-message-area"></p> no seu HTML
    const messageArea = document.getElementById('login-message-area'); 

    if (loginForm && loadingOverlay && loginButton) {
        
        loginForm.addEventListener('submit', (event) => {
            // Impede o envio padrão
            event.preventDefault(); 
            
            // Limpa erros antigos
            if (messageArea) messageArea.textContent = '';
            
            // MOSTRA o carregador e DESABILITA o botão
            loadingOverlay.classList.add('show');
            loginButton.disabled = true;

            const email = document.getElementById('email-login').value;
            const senha = document.getElementById('password-login').value;

            // Chama a lógica de login
            fazerLogin(email, senha);
        });
    }

    /**
     * Função de Login (Simulada)
   
     */
    async function fazerLogin(email, senha) {
        
        try {
            // --- INÍCIO DA SIMULAÇÃO ---
            // (Substitua esta parte pela sua chamada de API real)
            await new Promise(resolve => setTimeout(resolve, 2000));
            // --- FIM DA SIMULAÇÃO ---

            
            // --- 2. LÓGICA DE VALIDAÇÃO ---
            if (email === 'teste@gmail.com' && senha === '123') {
                
                // SUCESSO:
                // O alert é opcional, pois o redirecionamento é imediato
                // alert("Login com sucesso! Redirecionando...");
                window.location.href = '../dashboard/newdashboard.html';
                
                // O script para aqui, pois a página vai mudar

            } else {
                
                // FALHA (Login/Senha errados):
                // Lança um erro para ser pego pelo "catch"
                throw new Error('Email ou senha inválidos.');
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