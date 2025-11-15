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

function getChartTextColor() {
  const isLightMode = document.body.classList.contains('light-mode');
  return isLightMode ? '#333' : '#e0e0e0';
}

// Função para pegar a cor das linhas de grade baseada no tema
function getChartGridColor() {
  const isLightMode = document.body.classList.contains('light-mode');
  return isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
}

function gerarGraficos(rendas, despesas) {
  // Destroi os gráficos existentes antes de recriar
  destruirGrafico(graficoPizza);
  destruirGrafico(graficoBarras);

  const corTextoGrafico = getChartTextColor();
  const corGrade = getChartGridColor();

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
        legend: { 
          labels: { 
            color: corTextoGrafico,
            font: { size: 12 }
          } 
        }
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
      plugins: { 
        legend: { 
          labels: { 
            color: corTextoGrafico,
            font: { size: 12 }
          } 
        } 
      },
      scales: {
        x: { 
          ticks: { color: corTextoGrafico },
          grid: { color: corGrade }
        },
        y: { 
          ticks: { color: corTextoGrafico },
          grid: { color: corGrade }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// Função para atualizar as cores dos gráficos quando o tema mudar
function atualizarCoresGraficos() {
  const novaCor = getChartTextColor();
  const novaCorGrade = getChartGridColor();

  if (graficoPizza) {
    graficoPizza.options.plugins.legend.labels.color = novaCor;
    graficoPizza.update();
  }

  if (graficoBarras) {
    graficoBarras.options.plugins.legend.labels.color = novaCor;
    graficoBarras.options.scales.x.ticks.color = novaCor;
    graficoBarras.options.scales.y.ticks.color = novaCor;
    graficoBarras.options.scales.x.grid.color = novaCorGrade;
    graficoBarras.options.scales.y.grid.color = novaCorGrade;
    graficoBarras.update();
  }
}

// Carrega os dados ao iniciar a página
document.addEventListener("DOMContentLoaded", () => {
  carregarDadosFinanceiros();
  
  // Conecta o botão de tema aos gráficos
  const botaoTema = document.getElementById('trocar-tema');
  if (botaoTema) {
    botaoTema.addEventListener('click', () => {
      // Aguarda um pequeno delay para a classe do body ser atualizada
      setTimeout(atualizarCoresGraficos, 50);
    });
  }
});

// Observer automático como backup (observa mudança na classe light-mode)
const observadorTema = new MutationObserver(() => {
  atualizarCoresGraficos();
});

observadorTema.observe(document.body, {
  attributes: true,
  attributeFilter: ['class']
});