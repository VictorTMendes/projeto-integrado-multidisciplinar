document.addEventListener('DOMContentLoaded', () => {
    
    // Tenta carregar as transações do localStorage
    const transacoes = JSON.parse(localStorage.getItem('transactions')) || [];

    // Variáveis globais para os gráficos, para podermos atualizá-los
    let graficoPizza = null;
    let graficoBarras = null;

    // --- Funções de Processamento de Dados ---

    /**
     * Processa os dados para o gráfico de pizza (Gastos por Categoria)
     */
    function prepararDadosPizza() {
        const gastosPorCategoria = {}; // Ex: { Alimentacao: 100, Transporte: 50 }

        // Filtra apenas saídas e soma os valores por categoria
        transacoes
            .filter(t => t.tipo === 'saida')
            .forEach(t => {
                if (gastosPorCategoria[t.categoria]) {
                    gastosPorCategoria[t.categoria] += t.valor;
                } else {
                    gastosPorCategoria[t.categoria] = t.valor;
                }
            });

        const labels = Object.keys(gastosPorCategoria);
        const data = Object.values(gastosPorCategoria);

        return { labels, data };
    }

    /**
     * Processa os dados para o gráfico de barras (Receitas vs Despesas Mensal)
     */
    function prepararDadosBarras() {
        const labels = []; // Nomes dos meses (ex: "Maio", "Junho", ...)
        const dataReceitas = [];
        const dataDespesas = [];

        const hoje = new Date();
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        for (let i = 5; i >= 0; i--) { // Começa de 5 para pegar os últimos 6 meses (0-5)
            // Cria uma data para o mês 'i' meses atrás
            const dataAlvo = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            
            const nomeMes = meses[dataAlvo.getMonth()];
            const ano = dataAlvo.getFullYear();
            labels.push(`${nomeMes}/${ano}`); // Adiciona "Out/2025" ao label

            let receitaMes = 0;
            let despesaMes = 0;

            // Filtra transações para o mês e ano específicos
            transacoes.forEach(t => {
                const dataTransacao = new Date(t.data + "T00:00:00"); // Adiciona T00:00 para evitar problemas de fuso
                
                if (dataTransacao.getMonth() === dataAlvo.getMonth() && dataTransacao.getFullYear() === dataAlvo.getFullYear()) {
                    if (t.tipo === 'entrada') {
                        receitaMes += t.valor;
                    } else if (t.tipo === 'saida') {
                        despesaMes += t.valor;
                    }
                }
            });

            dataReceitas.push(receitaMes);
            dataDespesas.push(despesaMes);
        }

        return { labels, datasets: [
            {
                label: 'Receitas',
                data: dataReceitas,
                backgroundColor: 'rgba(93, 214, 44, 0.7)', // Verde
                borderColor: '#5DD62C',
                borderWidth: 1
            },
            {
                label: 'Despesas',
                data: dataDespesas,
                backgroundColor: 'rgba(228, 84, 84, 0.7)', // Vermelho
                borderColor: '#e45454',
                borderWidth: 1
            }
        ]};
    }

    // --- Funções de Renderização dos Gráficos ---

    /**
     * Define as opções globais dos gráficos (cores de fonte, etc.)
     */
    function getChartOptions() {
        const isLightMode = document.body.classList.contains('light-mode');
        const corTexto = isLightMode ? '#333333' : '#F8F8F8';
        const corGrid = isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: corTexto, // Cor do texto da legenda
                        font: {
                            size: 14,
                            family: 'Roboto, Arial, sans-serif'
                        }
                    }
                }
            },
            scales: { // Usado pelo gráfico de barras
                y: {
                    ticks: {
                        color: corTexto, // Cor dos números no eixo Y
                        font: {
                            size: 12,
                            family: 'Roboto, Arial, sans-serif'
                        }
                    },
                    grid: {
                        color: corGrid // Cor das linhas de grade
                    }
                },
                x: {
                    ticks: {
                        color: corTexto, // Cor dos meses no eixo X
                        font: {
                            size: 12,
                            family: 'Roboto, Arial, sans-serif'
                        }
                    },
                    grid: {
                        color: 'transparent' // Linhas de grade do eixo X transparentes
                    }
                }
            }
        };
    }


    /**
     * Cria ou atualiza o gráfico de pizza
     */
    function renderizarGraficoPizza() {
        const ctx = document.getElementById('graficoPizzaCategorias').getContext('2d');
        const dadosPizza = prepararDadosPizza();
        const options = getChartOptions();

        // Se o gráfico já existe, atualiza os dados
        if (graficoPizza) {
            graficoPizza.data.labels = dadosPizza.labels;
            graficoPizza.data.datasets[0].data = dadosPizza.data;
            graficoPizza.options = options;
            graficoPizza.update();
            return;
        }

        // Se não existe, cria um novo
        graficoPizza = new Chart(ctx, {
            type: 'doughnut', // Tipo 'doughnut' (rosquinha) é mais moderno que 'pie' (pizza)
            data: {
                labels: dadosPizza.labels,
                datasets: [{
                    label: 'Gastos',
                    data: dadosPizza.data,
                    backgroundColor: [ // Adicione mais cores se tiver mais categorias
                        '#e45454',
                        '#5DD62C',
                        '#337418',
                        '#3498db',
                        '#9b59b6',
                        '#e67e22',
                        '#f1c40f',
                    ],
                    hoverOffset: 4
                }]
            },
            options: options
        });
    }

    /**
     * Cria ou atualiza o gráfico de barras
     */
    function renderizarGraficoBarras() {
        const ctx = document.getElementById('graficoBarrasMensal').getContext('2d');
        const dadosBarras = prepararDadosBarras();
        const options = getChartOptions();

        if (graficoBarras) {
            graficoBarras.data.labels = dadosBarras.labels;
            graficoBarras.data.datasets = dadosBarras.datasets;
            graficoBarras.options = options;
            graficoBarras.update();
            return;
        }

        graficoBarras = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dadosBarras.labels,
                datasets: dadosBarras.datasets
            },
            options: options
        });
    }

    // --- Execução Inicial ---
    
    // Renderiza os gráficos quando a página carrega
    renderizarGraficoPizza();
    renderizarGraficoBarras();

    // --- Integração com o Tema ---
    
    // Ouve o clique no botão de tema (que já está na página)
    const themeToggleButton = document.getElementById('trocar-tema');
    if(themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            // Espera um instante para o body.classList.toggle() do outro script rodar
            setTimeout(() => {
                // E então atualiza os gráficos com as novas cores
                renderizarGraficoPizza();
                renderizarGraficoBarras();
            }, 10); // 10ms é o suficiente
        });
    }
});