document.addEventListener('DOMContentLoaded', () => {

    // --- Início: Lógica de troca de painel (O SEU CÓDIGO) ---
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (registerBtn) { // Adicionamos uma verificação
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });
    }

    if (loginBtn) { // Adicionamos uma verificação
        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    }
    // --- Fim: Lógica de troca de painel ---


    // --- Início: Lógica para Ver Senha (CORRIGIDA) ---

    // 1. Seleciona TODOS os botões de ver senha na página
    const toggleButtons = document.querySelectorAll('.toggle-password-btn');

    toggleButtons.forEach(button => {
        
        button.addEventListener('click', () => {
            
            // 2. Pega o ID do input alvo
            const inputId = button.dataset.input;
            const passwordInput = document.getElementById(inputId);
            
            // 3. Pega o ícone < i > que está dentro do botão
            const icon = button.querySelector('i');

            // 4. Verifica se o tipo atual é 'password'
            const isPassword = passwordInput.type === 'password';

            // 5. Inverte o tipo do input
            passwordInput.type = isPassword ? 'text' : 'password';

            // 6. Troca o ícone (LÓGICA CORRIGIDA)
            if (isPassword) {
                // Se estava 'password', agora é 'text' (vendo a senha)
                // Mostrar ícone "ABERTO"
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                // Se estava 'text', agora é 'password' (escondendo a senha)
                // Mostrar ícone "CORTADO"
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });
    // --- Fim: Lógica para Ver Senha ---

}); 