const apiBase = "https://moneyflowapi-1.onrender.com/api";
const token = localStorage.getItem("token");

// Armazena instâncias globais de gráficos
let graficoPizza;
let graficoBarras;

// Verifica login
if (!token) {
  window.location.href = "/login.html";
}

async function apiFetch(url, options = {}) {
 const res = await fetch(url, {
   ...options,
    headers: {
    "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
       ...options.headers
     }
   });

   if (!res.ok) {
     const errorText = await res.text();
     console.error("Erro API:", errorText);
    throw new Error(errorText);
   }

  return res.json();
}

async function carregarDadosFinanceiros() {
  try {
     const [despesas, rendas] = await Promise.all([
       apiFetch(`${apiBase}/despesas`),
       apiFetch(`${apiBase}/rendas`)
     ]);

     gerarGraficos(rendas, despesas);
   } catch (error) {
     console.error("Erro ao carregar dados:", error);
     alert("Erro ao carregar relatórios. Verifique se a API está disponível.");
   }
}

function destruirGrafico(chart) {
  if (chart && typeof chart.destroy === "function") {
     try {
       chart.destroy();
     } catch (e) {
       console.warn("Falha ao destruir gráfico:", e);
     }
   }
}

// NOVO: Função auxiliar para pegar a cor do texto correta baseada no tema
function getChartTextColor() {
  // Verifica se o body tem a classe 'dark-theme' (do seu script de tema)
  const isDarkMode = document.body.classList.contains('dark-theme');
  // Retorna branco para modo escuro, e um cinza escuro para modo claro
  return isDarkMode ? '#fff' : '#333';
}

function gerarGraficos(rendas, despesas) {
   // Destroi os gráficos existentes antes de recriar
   destruirGrafico(graficoPizza);
   destruirGrafico(graficoBarras);

  // NOVO: Pega a cor do texto dinamicamente
  const corTextoGrafico = getChartTextColor();

  // ---------- GRÁFICO DE PIZZA ----------
   const categoriasMap = {};
   despesas.forEach(d => {
    const cat = d.categoria?.nome || d.Categoria?.Nome || "Outros";
    const valor = parseFloat(d.valor || d.Valor || 0);
    categoriasMap[cat] = (categoriasMap[cat] || 0) + valor;
   });

   const ctxPizza = document.getElementById("graficoPizzaCategorias");
   if (ctxPizza && ctxPizza.getContext) {
     const c = ctxPizza.getContext("2d");
     c.clearRect(0, 0, ctxPizza.width, ctxPizza.height);
   }

   graficoPizza = new Chart(ctxPizza, {
     type: "doughnut",
    data: {
      labels: Object.keys(categoriasMap),
      datasets: [{
        data: Object.values(categoriasMap),
        backgroundColor: ["#ff6384", "#36a2eb", "#9966ff", "#ff9f40", "#ffcd56", "#4bc0c0"],
        borderWidth: 0
      }]
    },
     options: {
      plugins: {
        // MODIFICADO: Usa a variável de cor
         legend: { labels: { color: corTextoGrafico } }
    },
       responsive: true,
      maintainAspectRatio: false
    }
 });


  const meses = Array.from({ length: 6 }, (_, i) => {
    const data = new Date();
    data.setMonth(data.getMonth() - (5 - i));
    return data.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
});

   const somaPorMes = (dados) => {
     const soma = {};
     dados.forEach(t => {
      const data = new Date(t.data || t.dataRenda || t.dataDespesa || t.Data);
      const mes = data.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      const valor = parseFloat(t.valor || t.Valor || 0);
      soma[mes] = (soma[mes] || 0) + valor;
     });
     return soma;
  };

  const rendasPorMes = somaPorMes(rendas);
  const despesasPorMes = somaPorMes(despesas);

   const valoresRenda = meses.map(m => rendasPorMes[m] || 0);
   const valoresDespesa = meses.map(m => despesasPorMes[m] || 0);

   const ctxBarras = document.getElementById("graficoBarrasMensal");
    if (ctxBarras && ctxBarras.getContext) {
    const c2 = ctxBarras.getContext("2d");
     c2.clearRect(0, 0, ctxBarras.width, ctxBarras.height);
   }

   graficoBarras = new Chart(ctxBarras, {
     type: "bar",
     data: {
       labels: meses,
      datasets: [
         { label: "Receitas", data: valoresRenda, backgroundColor: "#00FF7F" },
         { label: "Despesas", data: valoresDespesa, backgroundColor: "#FF4D4D" }
       ]
     },
     options: {
      // MODIFICADO: Usa a variável de cor
       plugins: { legend: { labels: { color: corTextoGrafico } } },
      scales: {
        // MODIFICADO: Usa a variável de cor
         x: { ticks: { color: corTextoGrafico } },
         y: { ticks: { color: corTextoGrafico } }
       },
       responsive: true,
       maintainAspectRatio: false
     }
   });
}

// NOVO: Função para ATUALIZAR as cores dos gráficos quando o tema mudar
function atualizarCoresGraficos() {
  const novaCor = getChartTextColor();

  if (graficoPizza) {
    graficoPizza.options.plugins.legend.labels.color = novaCor;
    graficoPizza.update(); // Atualiza o gráfico de pizza
  }

  if (graficoBarras) {
    graficoBarras.options.plugins.legend.labels.color = novaCor;
    graficoBarras.options.scales.x.ticks.color = novaCor;
    graficoBarras.options.scales.y.ticks.color = novaCor;
    graficoBarras.update(); // Atualiza o gráfico de barras
  }
}

// MODIFICADO: Evento de inicialização
document.addEventListener("DOMContentLoaded", () => {
  // 1. Carrega os dados e gera os gráficos (com a cor certa da 1ª vez)
  carregarDadosFinanceiros();

  // 2. Encontra o botão de tema (que está em outro script)
  //    Assumindo que o ID dele é 'theme-toggle' (do exemplo anterior)
  const themeToggle = document.getElementById('theme-toggle');

  if (themeToggle) {
    // 3. Adiciona um ouvinte de clique a ele
    themeToggle.addEventListener('click', () => {
      // O seu outro script (script.js) vai trocar a classe do body.
      // Nós esperamos um instante muito curto (50ms) para garantir
      // que a classe já foi trocada ANTES de lermos a nova cor.
      setTimeout(atualizarCoresGraficos, 50);
    });
  }
});