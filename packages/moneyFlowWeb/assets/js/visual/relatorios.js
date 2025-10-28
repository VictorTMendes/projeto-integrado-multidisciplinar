document.addEventListener('DOMContentLoaded', () => {
    
    // LINHA ORIGINAL (comentada para guardá-la):
    // const transacoes = JSON.parse(localStorage.getItem('transactions')) || [];

    // ====== INÍCIO DOS DADOS FICTÍCIOS PARA TESTE ======
    console.log("!!! USANDO DADOS FICTÍCIOS PARA TESTE !!!");
    const transacoes = [
        // Mês atual (Outubro/2025) - Estou assumindo que hoje é Outubro/2025 para os testes
        { valor: 500, tipo: "saida", categoria: "Alimentacao", data: "2025-10-20" },
        { valor: 150, tipo: "saida", categoria: "Transporte", data: "2025-10-15" },
        { valor: 3000, tipo: "entrada", categoria: "Salario", data: "2025-10-05" },

        // Mês passado (Setembro/2025)
        { valor: 450, tipo: "saida", categoria: "Alimentacao", data: "2025-09-20" },
        { valor: 80, tipo: "saida", categoria: "Lazer", data: "2025-09-15" },
        { valor: 150, tipo: "saida", categoria: "Transporte", data: "2025-09-12" },
        { valor: 3000, tipo: "entrada", categoria: "Salario", data: "2025-09-05" },

        // Mês retrasado (Agosto/2025)
        { valor: 600, tipo: "saida", categoria: "Alimentacao", data: "2025-08-20" },
        { valor: 200, tipo: "saida", categoria: "Lazer", data: "2025-08-18" },
        { valor: 1200, tipo: "saida", categoria: "Moradia", data: "2025-08-10" },
        { valor: 3000, tipo: "entrada", categoria: "Salario", data: "2025-08-05" },
        { valor: 500, tipo: "entrada", categoria: "Outros", data: "2025-08-02" },
        
        // Outros meses (para preencher o gráfico de barras)
        { valor: 2500, tipo: "entrada", categoria: "Salario", data: "2025-07-05" },
        { valor: 800, tipo: "saida", categoria: "Moradia", data: "2025-07-10" },
        { valor: 2500, tipo: "entrada", categoria: "Salario", data: "2025-06-05" },
        { valor: 1000, tipo: "saida", categoria: "Saude", data: "2025-06-20" },
        { valor: 2500, tipo: "entrada", categoria: "Salario", data: "2025-05-05" },
        { valor: 400, tipo: "saida", categoria: "Alimentacao", data: "2025-05-15" },
    ];
    // ====== FIM DOS DADOS FICTÍCIOS ======


    // ==========================================================
    // ESTE É O "RESTO DO CÓDIGO" QUE ESTAVA FALTANDO
    // ==========================================================

    let graficoPizza = null;
    let graficoBarras = null;

    // --- Funções de Processamento de Dados ---

    function prepararDadosPizza() {
        const gastosPorCategoria = {}; 

        transacoes
            .filter(t => t.tipo === 'saida')
            .forEach(t => {
                const categoria = t.categoria || 'Sem Categoria'; // Garante uma categoria
                if (gastosPorCategoria[categoria]) {
                    gastosPorCategoria[categoria] += parseFloat(t.valor) || 0;
                } else {
                    gastosPorCategoria[categoria] = parseFloat(t.valor) || 0;
                }
            });

        const labels = Object.keys(gastosPorCategoria);
        const data = Object.values(gastosPorCategoria);

        return { labels, data };
    }

    function prepararDadosBarras() {
        const labels = [];
        const dataReceitas = [];
        const dataDespesas = [];

        // Fixamos a data de "hoje" para 21/10/2025 para que o teste seja consistente
        const hoje = new Date(2025, 9, 21); // Mês 9 é Outubro (0-11)
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        for (let i = 5; i >= 0; i--) { 
            const dataAlvo = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            
            const nomeMes = meses[dataAlvo.getMonth()];
            const ano = dataAlvo.getFullYear().toString().substr(-2); // Pega só os 2 últimos dígitos
            labels.push(`${nomeMes}/${ano}`); 

            let receitaMes = 0;
            let despesaMes = 0;

            transacoes.forEach(t => {
                if (!t.data) return; 
                const dataTransacao = new Date(t.data + "T00:00:00"); 
                
                if (dataTransacao.getMonth() === dataAlvo.getMonth() && dataTransacao.getFullYear() === dataAlvo.getFullYear()) {
                    const valor = parseFloat(t.valor) || 0;
                    if (t.tipo === 'entrada') {
                        receitaMes += valor;
                    } else if (t.tipo === 'saida') {
                        despesaMes += valor;
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
                        color: corTexto,
                        font: { size: 14, family: 'Roboto, Arial, sans-serif' }
                    }
                }
            },
            scales: { 
                y: {
                    ticks: { color: corTexto, font: { size: 12, family: 'Roboto, Arial, sans-serif' }},
                    grid: { color: corGrid }
                },
                x: {
                    ticks: { color: corTexto, font: { size: 12, family: 'Roboto, Arial, sans-serif' }},
                    grid: { color: 'transparent' }
                }
            }
        };
    }

    function renderizarGraficoPizza() {
        const ctxPizza = document.getElementById('graficoPizzaCategorias');
        if (!ctxPizza) return; 

        const dadosPizza = prepararDadosPizza();
        const options = getChartOptions();

        if (graficoPizza) {
            graficoPizza.data.labels = dadosPizza.labels;
            graficoPizza.data.datasets[0].data = dadosPizza.data;
            graficoPizza.options = options;
            graficoPizza.update();
            return;
        }

        graficoPizza = new Chart(ctxPizza.getContext('2d'), {
            type: 'doughnut', 
            data: {
                labels: dadosPizza.labels,
                datasets: [{
                    label: 'Gastos',
                    data: dadosPizza.data,
                    backgroundColor: [ 
                        '#e45454', '#3498db', '#9b59b6', '#e67e22', 
                        '#f1c40f', '#1abc9c', '#2ecc71'
                    ],
                    hoverOffset: 4
                }]
            },
            options: options
        });
    }

    function renderizarGraficoBarras() {
        const ctxBarras = document.getElementById('graficoBarrasMensal');
        if (!ctxBarras) return; 

        const dadosBarras = prepararDadosBarras();
        const options = getChartOptions();

        if (graficoBarras) {
            graficoBarras.data.labels = dadosBarras.labels;
            graficoBarras.data.datasets = dadosBarras.datasets;
            graficoBarras.options = options;
            graficoBarras.update();
            return;
        }

        graficoBarras = new Chart(ctxBarras.getContext('2d'), {
            type: 'bar',
            data: {
                labels: dadosBarras.labels,
                datasets: dadosBarras.datasets
            },
            options: options
        });
    }

    // --- Execução Inicial e Integração com Tema ---
    
    renderizarGraficoPizza();
    renderizarGraficoBarras();

    const themeToggleButton = document.getElementById('trocar-tema');
    if(themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            setTimeout(() => {
                renderizarGraficoPizza();
                renderizarGraficoBarras();
            }, 10); 
        });
    }

    // Em relatorios.js

    function renderizarGraficoPizza() {
        const ctxPizza = document.getElementById('graficoPizzaCategorias');

        if (!ctxPizza) return; 

        const dadosPizza = prepararDadosPizza();
        const options = getChartOptions(); // Pega as opções gerais

    // Correção 1: Remove os eixos (números laterais)
    delete options.scales;

    // Atualiza o gráfico (ex: troca de tema)
    if (graficoPizza) {
        graficoPizza.data.labels = dadosPizza.labels;
        graficoPizza.data.datasets[0].data = dadosPizza.data;
        // Correção 2: Adiciona o 'borderWidth' ao dataset existente
        graficoPizza.data.datasets[0].borderWidth = 0; 
        graficoPizza.options = options; 
        graficoPizza.update();
        return;
    }

    // Cria o gráfico pela primeira vez
    graficoPizza = new Chart(ctxPizza.getContext('2d'), {
        type: 'doughnut', 
        data: {
            labels: dadosPizza.labels,
            datasets: [{
                label: 'Gastos',
                data: dadosPizza.data,
                backgroundColor: [ 
                    '#e45454', '#3498db', '#9b59b6', '#e67e22', 
                    '#f1c40f', '#1abc9c', '#2ecc71'
                ],
                hoverOffset: 4,
                
                // === ESTA É A CORREÇÃO 2 ===
                // Remove as bordas brancas entre as fatias
                borderWidth: 0 
                // ==========================
            }]
        },
        options: options // Usa as opções modificadas (sem eixos)
    });
    
}
    

}); 