// Funções para mostrar e esconder o loading overlay
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('show');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
    }
}

// --- Exemplo de como usar no seu formulário de Login/Registro ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form'); // Assuma que seu form tem ID 'login-form'
    const registerForm = document.getElementById('register-form'); // Assuma que seu form tem ID 'register-form'

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            showLoading(); // Mostra a tela de carregamento

            // --- SIMULAÇÃO DE UMA REQUISIÇÃO DE LOGIN ---
            // Substitua isso pela sua lógica real de login (fetch, axios, etc.)
            try {
                // await fetch('/api/login', { /* suas opções aqui */ });
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simula 2 segundos de carregamento
                
                // Se o login for bem-sucedido:
                alert('Login realizado com sucesso!');
                window.location.href = '../dashboard/newdashboard.html'; // Redireciona para o dashboard
                
            } catch (error) {
                console.error('Erro no login:', error);
                alert('Falha no login. Tente novamente.');
            } finally {
                hideLoading(); // Esconde a tela de carregamento, mesmo se houver erro
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            showLoading(); // Mostra a tela de carregamento

            // --- SIMULAÇÃO DE UMA REQUISIÇÃO DE REGISTRO ---
            // Substitua isso pela sua lógica real de registro (fetch, axios, etc.)
            try {
                // await fetch('/api/register', { /* suas opções aqui */ });
                await new Promise(resolve => setTimeout(resolve, 2500)); // Simula 2.5 segundos de carregamento

                // Se o registro for bem-sucedido:
                alert('Registro realizado com sucesso! Faça login para continuar.');
                window.location.href = 'login.html'; // Redireciona para a página de login
                
            } catch (error) {
                console.error('Erro no registro:', error);
                alert('Falha no registro. Tente novamente.');
            } finally {
                hideLoading(); // Esconde a tela de carregamento
            }
        });
    }

    // Opcional: Esconder o loading se a página for recarregada e ele estiver visível
    // (Útil se o navegador voltar com cache ou se houver um erro antes do hideLoading)
    window.addEventListener('load', hideLoading); 
});