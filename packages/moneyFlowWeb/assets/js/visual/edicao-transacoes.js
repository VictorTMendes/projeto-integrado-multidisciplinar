// Em: ../../../assets/js/visual/edicao-transacoes.js

document.addEventListener('DOMContentLoaded', () => {

    // Seleciona a lista principal <ul>
    const listaTransacoes = document.getElementById('ultimas-transacoes');
    
    // Seleciona os elementos do Modal (apenas uma vez)
    const modalEdicao = document.getElementById('modal-edicao');
    const formEdicao = document.getElementById('form-edicao');
    const btnFecharModal = modalEdicao?.querySelector('.modal-close-btn');
    const valorEdicaoInput = document.getElementById('valor-edicao');
    const descricaoEdicaoInput = document.getElementById('descricao-edicao');
    const categoriaEdicaoSelect = document.getElementById('categoria-edicao');

    // Chave do LocalStorage (mude se for diferente)
    const STORAGE_KEY = 'transactions';

    if (!listaTransacoes) {
        console.warn("Elemento #ultimas-transacoes não encontrado. A edição e exclusão não funcionarão.");
        return;
    }

    // --- FUNÇÕES DE CONTROLE DO DROPDOWN ---
    function fecharTodosOsDropdowns(exceptoEste = null) {
        document.querySelectorAll('.dropdown-acoes.show').forEach(dropdown => {
            if (dropdown !== exceptoEste) {
                dropdown.classList.remove('show');
            }
        });
    }

    // --- LISTENER PRINCIPAL (DELEGAÇÃO DE EVENTO) ---
    // Ouve cliques na LISTA INTEIRA (<ul>)
    listaTransacoes.addEventListener('click', (event) => {
        
        // --- LÓGICA DO MENU DE OPÇÕES (TRÊS PONTOS) ---
        const acoesButton = event.target.closest('.acoes-button');
        if (acoesButton) {
            event.stopPropagation();
            const dropdown = acoesButton.nextElementSibling;
            const estaAberto = dropdown.classList.contains('show');
            fecharTodosOsDropdowns(null); // Fecha todos os outros
            if (!estaAberto && dropdown) {
                dropdown.classList.add('show'); // Abre o atual
            }
            return; // Ação concluída
        }

        // --- LÓGICA DO BOTÃO DE EXCLUIR ---
        const botaoExcluir = event.target.closest('.btn-excluir');
        if (botaoExcluir) {
            event.preventDefault();
            const itemDaLista = botaoExcluir.closest('li');
            const transacaoId = itemDaLista?.dataset.id; // Pega o data-id

            if (!itemDaLista || !transacaoId) return;

            if (confirm('Tem certeza que deseja excluir esta transação?')) {
                itemDaLista.remove(); // Remove da tela
                removerTransacaoDoLocalStorage(transacaoId); // Remove dos dados
                // TODO: Chamar sua função de atualizar os cards/gráficos
                // ex: atualizarResumos();
            }
            return; // Ação concluída
        }

        // --- LÓGICA DO BOTÃO DE EDITAR (ABRIR O MODAL) ---
        const botaoEditar = event.target.closest('.btn-editar');
        if (botaoEditar) {
            event.preventDefault();
            const itemDaLista = botaoEditar.closest('li');
            const transacaoId = itemDaLista?.dataset.id; // Pega o data-id

            if (!itemDaLista || !transacaoId || !modalEdicao) return;

            // 1. Busca a transação original no localStorage
            const transacao = buscarTransacaoPorId(transacaoId);
            if (!transacao) return alert("Erro: Transação não encontrada.");

            // 2. Preenche o formulário
            if (descricaoEdicaoInput) descricaoEdicaoInput.value = transacao.descricao || '';
            if (categoriaEdicaoSelect) categoriaEdicaoSelect.value = transacao.categoria || '';

            // 3. CORREÇÃO DO NaN: Usa IMask para definir o valor
            if (valorEdicaoInput && valorEdicaoInput.imask) {
                const valorNumerico = parseFloat(transacao.valor);
                valorEdicaoInput.imask.typedValue = isNaN(valorNumerico) ? 0 : valorNumerico;
            } else if (valorEdicaoInput) {
                valorEdicaoInput.value = transacao.valor; // Fallback (sem máscara)
            }

            // 4. Guarda o ID da transação no formulário
            if (formEdicao) formEdicao.dataset.editingId = transacaoId;

            // 5. Mostra o modal
            modalEdicao.classList.add('show');
            return; // Ação concluída
        }
    });

    // Fecha dropdowns se clicar fora
    window.addEventListener('click', (event) => {
        if (!event.target.closest('.transacoes-acoes')) {
            fecharTodosOsDropdowns(null);
        }
    });


    // --- FUNÇÕES AUXILIARES DE DADOS (Helpers) ---
    function getTransactions() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }
    function saveTransactions(transactions) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
    function buscarTransacaoPorId(id) {
        const transacoesSalvas = getTransactions();
        return transacoesSalvas.find(t => String(t.id) === String(id));
    }
    function removerTransacaoDoLocalStorage(id) {
        let transacoesSalvas = getTransactions();
        transacoesSalvas = transacoesSalvas.filter(t => String(t.id) !== String(id));
        saveTransactions(transacoesSalvas);
    }


    // --- LÓGICA DE FECHAR E SALVAR O MODAL ---
    function fecharModal() {
        if (modalEdicao) modalEdicao.classList.remove('show');
        if (formEdicao) formEdicao.removeAttribute('data-editing-id');
    }

    if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);
    if (modalEdicao) modalEdicao.addEventListener('click', (event) => {
        if (event.target === modalEdicao) fecharModal();
    });

    // Salvar alterações
    if (formEdicao) {
        formEdicao.addEventListener('submit', (event) => {
            event.preventDefault();
            const idParaEditar = formEdicao.dataset.editingId;
            if (!idParaEditar) return alert("Erro: ID da transação não encontrado.");

            // Pega os novos valores
            const novaDescricao = descricaoEdicaoInput?.value.trim();
            const novaCategoria = categoriaEdicaoSelect?.value;
            let novoValorNumerico = 0;

            if (valorEdicaoInput && valorEdicaoInput.imask) {
                 novoValorNumerico = valorEdicaoInput.imask.number; // Pega o NÚMERO
            } else if (valorEdicaoInput) {
                 novoValorNumerico = parseFloat(valorEdicaoInput.value) || 0;
            }
            
            if (!novaDescricao || !novaCategoria) return alert("Preencha todos os campos.");

            // Atualiza o localStorage
            let transacoesSalvas = getTransactions();
            let transacaoOriginal = null;
            transacoesSalvas = transacoesSalvas.map(t => {
                if (String(t.id) === String(idParaEditar)) {
                    transacaoOriginal = t; 
                    return { ...t, valor: novoValorNumerico, descricao: novaDescricao, categoria: novaCategoria };
                }
                return t;
            });
            saveTransactions(transacoesSalvas);

            // Atualiza o LI na tela (DOM)
            const itemDaListaNaTela = listaTransacoes.querySelector(`li[data-id="${idParaEditar}"]`);
            if (itemDaListaNaTela && transacaoOriginal) {
                 itemDaListaNaTela.querySelector('.transacao-info p').textContent = novaDescricao;
                 itemDaListaNaTela.querySelector('.transacao-info span[class*="tag-categoria"]').textContent = novaCategoria;
                 // Formata o valor de volta
                 const tipo = transacaoOriginal.tipo;
                 const valorFormatado = novoValorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                 const prefixo = tipo === 'entrada' ? '+' : '-';
                 itemDaListaNaTela.querySelector('.transacao-valor span').textContent = `${prefixo} ${valorFormatado}`;
            }
            
            // TODO: Chamar função para atualizar cards e gráficos
            // ex: atualizarResumos(); 
            // ex: renderizarGraficos(); 
            fecharModal();
        });
    }
});