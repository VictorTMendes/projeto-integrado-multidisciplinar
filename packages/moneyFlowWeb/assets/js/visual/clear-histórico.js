document.addEventListener('DOMContentLoaded', () => {

    const clearHistoryBtn = document.getElementById('clear-history-btn');

    if (clearHistoryBtn) {
        
        clearHistoryBtn.addEventListener('click', async () => { // 'async' é importante
            
            const confirmacao = confirm(
                'Você tem certeza que deseja apagar TODO o seu histórico financeiro (relatórios, transações, etc.)? Esta ação é PERMANENTE e não pode ser desfeita.'
            );

            if (!confirmacao) {
                return; // Usuário cancelou
            }

            const token = localStorage.getItem('token');
            if (!token) {
                alert('Erro: Você não está logado. Faça o login novamente.');
                return;
            }

            try {
                const response = await fetch('/api/historico/limpar-tudo', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.ok) {
                    alert('Seu histórico foi limpo com sucesso!');
                    location.reload(); 
                } else {
                    const erroData = await response.json(); 
                    alert(`Erro ao limpar o histórico: ${erroData.message || response.statusText}`);
                }

            } catch (error) {
                console.error('Erro na chamada da API para limpar histórico:', error);
                alert('Não foi possível conectar ao servidor para limpar o histórico.');
            }
        });
    }
});