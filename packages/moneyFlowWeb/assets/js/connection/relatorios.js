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

function gerarGraficos(rendas, despesas) {
  // Destroi os gráficos existentes antes de recriar
  destruirGrafico(graficoPizza);
  destruirGrafico(graficoBarras);

  // ---------- GRÁFICO DE PIZZA ----------
  const categoriasMap = {};
  despesas.forEach(d => {
    const cat = d.categoria?.nome || d.Categoria?.Nome || "Outros";
    const valor = parseFloat(d.valor || d.Valor || 0);
    categoriasMap[cat] = (categoriasMap[cat] || 0) + valor;
  });

  const ctxPizza = document.getElementById("graficoPizzaCategorias");

  // Força a limpeza do canvas (caso a instância antiga ainda ocupe memória)
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
        legend: { labels: { color: "#fff" } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // ---------- GRÁFICO DE BARRAS ----------
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
      plugins: { legend: { labels: { color: "#fff" } } },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff" } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// Inicializa
document.addEventListener("DOMContentLoaded", carregarDadosFinanceiros);
