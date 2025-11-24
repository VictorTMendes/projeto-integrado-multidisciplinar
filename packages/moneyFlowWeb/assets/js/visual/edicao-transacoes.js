document.addEventListener('DOMContentLoaded', () => {

    const listaTransacoes = document.getElementById('ultimas-transacoes');

    const modalEdicao = document.getElementById('modal-edicao');
    const formEdicao = document.getElementById('form-edicao');
    const btnFecharModal = modalEdicao?.querySelector('.modal-close-btn');
    const valorEdicaoInput = document.getElementById('valor-edicao');
    const descricaoEdicaoInput = document.getElementById('descricao-edicao');
    const categoriaEdicaoSelect = document.getElementById('categoria-edicao');

    const STORAGE_KEY = 'transactions';

    if (!listaTransacoes) {
        console.warn("Elemento #ultimas-transacoes não encontrado. A edição e exclusão não funcionarão.");
        return;
    }

    function fecharTodosOsDropdowns(exceptoEste = null) {
        document.querySelectorAll('.dropdown-acoes.show').forEach(dropdown => {
            if (dropdown !== exceptoEste) {
                dropdown.classList.remove('show');
            }
        });
    }

    listaTransacoes.addEventListener('click', (event) => {

        const acoesButton = event.target.closest('.acoes-button');
        if (acoesButton) {
            event.stopPropagation();
            const dropdown = acoesButton.nextElementSibling;
            const estaAberto = dropdown.classList.contains('show');
            fecharTodosOsDropdowns(null);
            if (!estaAberto && dropdown) {
                dropdown.classList.add('show');
            }
            return; 
        }

        const botaoExcluir = event.target.closest('.btn-excluir');
        if (botaoExcluir) {
            event.preventDefault();
            const itemDaLista = botaoExcluir.closest('li');
            const transacaoId = itemDaLista?.dataset.id; 

            if (!itemDaLista || !transacaoId) return;

            if (confirm('Tem certeza que deseja excluir esta transação?')) {
                itemDaLista.remove();
                removerTransacaoDoLocalStorage(transacaoId); 

            }
            return; 
        }

        const botaoEditar = event.target.closest('.btn-editar');
        if (botaoEditar) {
            event.preventDefault();
            const itemDaLista = botaoEditar.closest('li');
            const transacaoId = itemDaLista?.dataset.id; // Pega o data-id

            if (!itemDaLista || !transacaoId || !modalEdicao) return;

            const transacao = buscarTransacaoPorId(transacaoId);
            if (!transacao) return alert("Erro: Transação não encontrada.");

            if (descricaoEdicaoInput) descricaoEdicaoInput.value = transacao.descricao || '';
            if (categoriaEdicaoSelect) categoriaEdicaoSelect.value = transacao.categoria || '';

            if (valorEdicaoInput && valorEdicaoInput.imask) {
                const valorNumerico = parseFloat(transacao.valor);
                valorEdicaoInput.imask.typedValue = isNaN(valorNumerico) ? 0 : valorNumerico;
            } else if (valorEdicaoInput) {
                valorEdicaoInput.value = transacao.valor;
            }

            if (formEdicao) formEdicao.dataset.editingId = transacaoId;

            modalEdicao.classList.add('show');
            return;
        }
    });

    window.addEventListener('click', (event) => {
        if (!event.target.closest('.transacoes-acoes')) {
            fecharTodosOsDropdowns(null);
        }
    });


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

            const novaDescricao = descricaoEdicaoInput?.value.trim();
            const novaCategoria = categoriaEdicaoSelect?.value;
            let novoValorNumerico = 0;

            if (valorEdicaoInput && valorEdicaoInput.imask) {
                 novoValorNumerico = valorEdicaoInput.imask.number;
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

            const itemDaListaNaTela = listaTransacoes.querySelector(`li[data-id="${idParaEditar}"]`);
            if (itemDaListaNaTela && transacaoOriginal) {
                 itemDaListaNaTela.querySelector('.transacao-info p').textContent = novaDescricao;
                 itemDaListaNaTela.querySelector('.transacao-info span[class*="tag-categoria"]').textContent = novaCategoria;
                 const tipo = transacaoOriginal.tipo;
                 const valorFormatado = novoValorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                 const prefixo = tipo === 'entrada' ? '+' : '-';
                 itemDaListaNaTela.querySelector('.transacao-valor span').textContent = `${prefixo} ${valorFormatado}`;
            }
            
            fecharModal();
        });
    }
});
