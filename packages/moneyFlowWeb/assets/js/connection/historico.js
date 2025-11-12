const apiBase = "https://moneyflowapi-1.onrender.com/api";
const token = localStorage.getItem("token");

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
    throw new Error(errorText);
  }
  return res.json();
}

// Carrega todas as rendas e despesas
async function carregarHistorico() {
  try {
    const [despesas, rendas] = await Promise.all([
      apiFetch(`${apiBase}/despesas`),
      apiFetch(`${apiBase}/rendas`)
    ]);

    const todas = [
      ...rendas.map(r => ({
        ...r,
        tipo: "entrada",
        dataTransacao: new Date(
          r.data || r.dataRenda || r.Data || r.DataRenda
        )
      })),
      ...despesas.map(d => ({
        ...d,
        tipo: "saida",
        dataTransacao: new Date(
          d.data || d.dataDespesa || d.Data || d.DataDespesa
        )
      }))
    ];

    // Ordena do mais recente para o mais antigo
    todas.sort((a, b) => b.dataTransacao - a.dataTransacao);

    renderizarLista(todas);

  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    alert("Erro ao carregar histórico. Verifique a API.");
  }
}

function renderizarLista(transacoes) {
  const ul = document.querySelector(".transacoes ul");
  ul.innerHTML = "";

  transacoes.forEach(t => {
    const li = document.createElement("li");
    const tipoClasse = t.tipo === "entrada" ? "tag-categoria-entrada" : "tag-categoria-saida";
    const valorClasse = t.tipo === "entrada" ? "entrada" : "saida";
    const sinal = t.tipo === "entrada" ? "+" : "-";
    const valor = parseFloat(t.valor || t.Valor || 0).toFixed(2);
    const data = new Date(t.dataTransacao).toLocaleDateString("pt-BR");
    const descricao = t.descricao || t.Descricao || t.titulo || t.Titulo;
    const categoriaNome = t.categoria?.nome || t.Categoria?.Nome || "Sem categoria";

    li.innerHTML = `
      <div class="transacao-info">
        <span class="${tipoClasse}">${categoriaNome}</span>
        <p>${descricao}</p>
      </div>
      <div class="transacao-valor">
        <span class="${valorClasse}">${sinal} R$ ${valor}</span>
        <small>${data}</small>
      </div>
    `;

    ul.appendChild(li);
  });
}

// Inicializa ao carregar a página
carregarHistorico();
