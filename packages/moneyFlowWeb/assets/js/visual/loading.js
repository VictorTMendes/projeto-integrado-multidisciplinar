document.addEventListener('DOMContentLoaded', () => {

    // 1. IDs CORRIGIDOS: Apontam para seu formulário e overlay
    const loginForm = document.getElementById('sign-in-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    if (loginForm && loadingOverlay) {
        
        loginForm.addEventListener('submit', (event) => {
            // Impede o envio padrão
            event.preventDefault(); 
            
            // 2. MOSTRA o carregador
            loadingOverlay.classList.add('show');

            // 3. IDs CORRIGIDOS: Pega os valores dos campos certos
            const email = document.getElementById('email-login').value;
            const senha = document.getElementById('password-login').value;

            // 4. CHAME SUA LÓGICA DE LOGIN AQUI
            // (Provavelmente uma função do seu 'api.js' ou 'usuario.js')
            // Vou usar um exemplo simulado
            fazerLogin(email, senha);
        });
    }

    // Esta função deve ser substituída pela sua lógica real de API
    async function fazerLogin(email, senha) {
        
        try {
            //
            // --- COLOQUE SUA LÓGICA DE LOGIN REAL AQUI ---
            // Ex: const resultado = await suaFuncaoDeLogin(email, senha);
            //
            // Exemplo de simulação (apague isso no código real):
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Fim da simulação
            
            // SUCESSO: Redireciona
            alert("Login com sucesso! Redirecionando...");
            window.location.href = '../../../src/pages/newdashboard/newdashboard.html'; // Mude para sua página

        } catch (error) {
            // ERRO: Mostra a falha
            console.error('Falha no login:', error);
            alert('Email ou senha inválidos!');

        } finally {
            // 5. SEMPRE executa: ESCONDE o carregador
            // (Isso acontece em caso de sucesso ou erro)
            if (loadingOverlay) {
                loadingOverlay.classList.remove('show');
            }
        }
    }
});