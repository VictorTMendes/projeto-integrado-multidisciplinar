// Espera todo o conteúdo do HTML ser carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA O MENU DE OPÇÕES (TRÊS PONTOS) ---
    const acoesButtons = document.querySelectorAll('.acoes-button');

    acoesButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Impede que o clique se espalhe para outros elementos

            // Encontra o menu dropdown que é "irmão" do botão clicado
            const dropdown = button.nextElementSibling;
            
            // Fecha todos os outros menus que possam estar abertos
            fecharTodosOsDropdowns(dropdown);

            // Mostra ou esconde o menu atual
            dropdown.classList.toggle('show');
        });
    });

    // Função para fechar todos os dropdowns, exceto o atual
    function fecharTodosOsDropdowns(exceptoEste) {
        const dropdownsAbertos = document.querySelectorAll('.dropdown-acoes.show');
        dropdownsAbertos.forEach(dropdown => {
            if (dropdown !== exceptoEste) {
                dropdown.classList.remove('show');
            }
        });
    }

    // Fecha qualquer menu que esteja aberto se o usuário clicar em qualquer lugar da tela
    window.addEventListener('click', () => {
        fecharTodosOsDropdowns(null);
    });


    // --- LÓGICA DO BOTÃO DE EXCLUIR ---
    const botoesExcluir = document.querySelectorAll('.btn-excluir');

    botoesExcluir.forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.preventDefault(); // Impede que o link '#' cause um pulo na página

            // Pede confirmação ao usuário
            const confirmou = confirm('Tem certeza que deseja excluir esta transação?');

            if (confirmou) {
                // Encontra o item <li> que é o "bisavô" do botão
                const itemDaLista = event.target.closest('li');
                // Remove o item da lista da tela
                itemDaLista.remove();
                // Aqui você também chamaria uma função para remover do banco de dados no futuro
            }
        });
    });


    // --- LÓGICA DO BOTÃO DE EDITAR (ABRIR O MODAL) ---
    const botoesEditar = document.querySelectorAll('.btn-editar');
    const modalEdicao = document.getElementById('modal-edicao');
    const formEdicao = document.getElementById('form-edicao');
    const btnFecharModal = document.querySelector('.modal-close-btn');

    botoesEditar.forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.preventDefault();

            // Pega os dados da transação clicada
            const itemDaLista = event.target.closest('li');
            const descricaoAtual = itemDaLista.querySelector('.transacao-info p').textContent;
            const valorAtualTexto = itemDaLista.querySelector('.transacao-valor span').textContent;
            
            // Preenche o formulário do modal com os dados
            document.getElementById('descricao-edicao').value = descricaoAtual;
            // (Aqui você precisará de uma lógica para limpar o "R$" e pegar só o número do valor)
            document.getElementById('valor-edicao').value = parseFloat(valorAtualTexto.replace("R$", "").replace("+", "").replace(",", "."));

            // Mostra o modal de edição
            modalEdicao.classList.add('show');
        });
    });

    // Função para fechar o modal de edição
    function fecharModal() {
        modalEdicao.classList.remove('show');
    }

    // Fecha o modal ao clicar no botão "X"
    if(btnFecharModal) {
        btnFecharModal.addEventListener('click', fecharModal);
    }
    
    // Fecha o modal ao clicar no fundo escuro
    modalEdicao.addEventListener('click', (event) => {
        if (event.target === modalEdicao) {
            fecharModal();
        }
    });

    // Lógica para salvar as alterações (exemplo)
    formEdicao.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Transação salva!');
        fecharModal();
    });

});