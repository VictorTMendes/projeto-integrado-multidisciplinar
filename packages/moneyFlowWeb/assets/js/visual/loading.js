// Espera o HTML ser totalmente carregado
document.addEventListener('DOMContentLoaded', () => {

    // Pega os elementos do formulário que vamos usar
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('loginButton');
    const messageArea = document.getElementById('message-area');

    // PEGA O SEU NOVO OVERLAY DE LOADING
    const loadingOverlay = document.getElementById('loading-overlay');

    // Escuta o evento de "submit" (envio) do formulário
    loginForm.addEventListener('submit', (event) => {
        
        // Impede que a página recarregue
        event.preventDefault();


        // Limpa mensagens de erro ou sucesso anteriores
        messageArea.textContent = '';
        messageArea.className = '';

        // ATIVA O "CARREGANDO..."
        // Em vez de mudar o botão, agora mostramos o overlay
        loadingOverlay.classList.add('show');
        
        // (Ainda é bom desabilitar o botão para evitar cliques duplos)
        loginButton.disabled = true;

        // CHAMA A FUNÇÃO DE VALIDAÇÃO
        simularValidacao(email, senha);
    });

    /**
     * Esta é uma função de validação SIMULADA.
     * Ela finge estar "conversando com o servidor" por 2 segundos.
     */
    function simularValidacao(email, senha) {
        console.log("Enviando para o servidor (simulado):", email, senha);

        // Simula uma espera de 2 segundos (2000ms)
        setTimeout(() => {
            
            // DESATIVA O "CARREGANDO..."
            // Esconde o overlay
            loadingOverlay.classList.remove('show');
            
            // Reabilita o botão
            loginButton.disabled = false;

            // VERIFICA OS DADOS (Lógica Fictícia)
            if (email === 'teste@gmail.com' && senha === '123') {
                
                // SUCESSO
                messageArea.textContent = 'Login bem-sucedido! Redirecionando...';
                messageArea.className = 'success';
                
                // Aqui você redirecionaria para a página principal
                // Ex: setTimeout(() => { window.location.href = '/dashboard'; }, 1000);

            } else {
                
                // ERRO
                messageArea.textContent = 'Email ou senha inválidos.';
                messageArea.className = 'error';
            }

        }, 2000); // 2000 milissegundos = 2 segundos
    }
});