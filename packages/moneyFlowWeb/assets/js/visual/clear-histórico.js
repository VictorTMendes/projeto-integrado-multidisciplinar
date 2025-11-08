document.addEventListener('DOMContentLoaded', () => {

    const clearHistoryBtn = document.getElementById('clear-history-btn');

    if (clearHistoryBtn) {
        
        clearHistoryBtn.addEventListener('click', async () => { // 'async' é importante
            
            // 1. Confirmação
            const confirmacao = confirm(
                'Você tem certeza que deseja apagar TODO o seu histórico financeiro (relatórios, transações, etc.)? Esta ação é PERMANENTE e não pode ser desfeita.'
            );

            if (!confirmacao) {
                return; // Usuário cancelou
            }

            // 2. Pega o Token de login
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Erro: Você não está logado. Faça o login novamente.');
                return;
            }

            // 3. Tenta fazer a chamada 'DELETE' para a API (Servidor)
            try {
                // !!! IMPORTANTE: '/api/historico/limpar-tudo' é um EXEMPLO !!!
                // Você precisa substituir pela URL CORRETA da sua API.
                const response = await fetch('/api/historico/limpar-tudo', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                // 4. Verifica a resposta do servidor
                if (response.ok) {
                    alert('Seu histórico foi limpo com sucesso!');
                    location.reload(); // Recarrega a página para zerar a tela
                } else {
                    // Se o servidor deu erro (401, 404, 500...)
                    const erroData = await response.json(); 
                    alert(`Erro ao limpar o histórico: ${erroData.message || response.statusText}`);
                }

            } catch (error) {
                // Erro de rede (não conectou)
                console.error('Erro na chamada da API para limpar histórico:', error);
                alert('Não foi possível conectar ao servidor para limpar o histórico.');
            }
        });
    }
});