// 1. Espera o HTML ser totalmente carregado
    document.addEventListener('DOMContentLoaded', () => {

        // 2. Pega os elementos do formulário que vamos usar
        const loginForm = document.getElementById('login-form');
        const loginButton = document.getElementById('loginButton');
        const messageArea = document.getElementById('message-area');

        // 3. Escuta o evento de "submit" (envio) do formulário
        loginForm.addEventListener('submit', (event) => {
            
            // 4. Impede que a página recarregue (comportamento padrão)
            event.preventDefault();

            // 5. Pega os valores que o usuário digitou
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            // 6. Limpa mensagens de erro ou sucesso anteriores
            messageArea.textContent = '';
            messageArea.className = '';

            // 7. ATIVA O "CARREGANDO..."
            //    Adiciona a classe 'loading' (o CSS cuida da animação)
            //    e desabilita o botão para evitar cliques duplos.
            loginButton.classList.add('loading');
            loginButton.disabled = true;

            // 8. CHAMA A FUNÇÃO DE VALIDAÇÃO
            //    (No futuro, você trocará isso por uma chamada 'fetch' para sua API)
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
                
                // 9. DESATIVA O "CARREGANDO..."
                //    Remove a classe 'loading' e reabilita o botão.
                loginButton.classList.remove('loading');
                loginButton.disabled = false;

                // 10. VERIFICA OS DADOS (Lógica Fictícia)
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