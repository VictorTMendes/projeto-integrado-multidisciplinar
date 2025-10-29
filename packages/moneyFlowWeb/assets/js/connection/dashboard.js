const apiBase = "https://moneyflowapi-1.onrender.com/api"
const apiBaseTeste = "https://localhost:7249/api"
const token = localStorage.getItem("token");
const nome = localStorage.getItem("usuarioNome");

// Redireciona se não estiver logado
if (!token) {
  window.location.href = "/login.html";
}

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../login/login.html";
});

// Função genérica para requisições autenticadas
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Carrega rendas e despesas reais
async function carregarDados() {
  try {
    const [despesas, rendas] = await Promise.all([
      apiFetch(`${apiBase}/despesas`),
      apiFetch(`${apiBase}/rendas`)
    ]);

    atualizarDashboard(rendas, despesas);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

// Atualiza cards e lista de transações
function atualizarDashboard(rendas, despesas) {
  const entradasEl = document.getElementById("entradas");
  const saidasEl = document.getElementById("saidas");
  const saldoEl = document.getElementById("saldo");
  const listaEl = document.getElementById("ultimas-transacoes");

  let totalRendas = rendas.reduce((s, r) => s + r.valor, 0);
  let totalDespesas = despesas.reduce((s, d) => s + d.valor, 0);
  let saldo = totalRendas - totalDespesas;

  entradasEl.textContent = `R$ ${totalRendas.toFixed(2)}`;
  saidasEl.textContent = `R$ ${totalDespesas.toFixed(2)}`;
  saldoEl.textContent = `R$ ${saldo.toFixed(2)}`;

  // Junta rendas e despesas pra exibir as últimas
  const todas = [
    ...rendas.map(r => ({ ...r, tipo: "entrada" })),
    ...despesas.map(d => ({ ...d, tipo: "saida" }))
  ].sort((a, b) => new Date(b.data) - new Date(a.data));

  listaEl.innerHTML = "";

  if (todas.length === 0) {
    listaEl.innerHTML = `<li><p>Você ainda não possui transações registradas.</p></li>`;
    return;
  }

  todas.slice(0, 5).forEach(t => {
    const li = document.createElement("li");

    const tipoClasse =
      t.tipo === "entrada" ? "tag-categoria-entrada" : "tag-categoria-saida";
    const valorClasse =
      t.tipo === "entrada"
        ? "transacao-valor-entrada"
        : "transacao-valor-saida";
    const sinal = t.tipo === "entrada" ? "+" : "-";

    li.innerHTML = `
      <div class="transacao-info">
        <span class="${tipoClasse}">${t.categoria}</span>
        <p>${t.titulo || t.descricao}</p>
      </div>

      <div class="${valorClasse}">
        <div class="transacao-valor">
          <span>${sinal} R$ ${t.valor.toFixed(2)}</span>
          <small>${new Date(t.data).toLocaleDateString("pt-BR")}</small>
        </div>
      </div>

      <div class="transacao-acoes">
        <button class="acoes-button">
          <i class="fas fa-ellipsis-v"></i>
        </button>

        <div class="dropdown-acoes">
          <a href="#" class="btn-editar" onclick="abrirModalEdicao(${t.id}, '${t.tipo}')">
            <i class="fas fa-pencil-alt"></i> Editar
          </a>
          <a href="#" class="btn-excluir" onclick="excluirTransacao(${t.id}, '${t.tipo}')">
            <i class="fas fa-trash"></i> Excluir
          </a>
        </div>
      </div>
    `;

    listaEl.appendChild(li);
  });
}

// Excluir transação
async function excluirTransacao(id, tipo) {
  const confirmacao = confirm("Deseja realmente excluir esta transação?");
  if (!confirmacao) return;

  const endpoint = tipo === "entrada" ? "rendas" : "despesas";
  await apiFetch(`${apiBase}/${endpoint}/${id}`, { method: "DELETE" });
  carregarDados();
}

// Adicionar nova transação
document
  .getElementById("form-nova-transacao")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const valorInput = document.getElementById("valor").value
      .replace("R$", "")
      .replace(".", "")
      .replace(",", ".")
      .trim();

    const usuarioId = parseInt(localStorage.getItem("usuarioId")) || 0;

    const novaTransacao = {
      valor: parseFloat(valorInput),
      descricao: document.getElementById("descricao").value,
      categoria: document.getElementById("categoria").value,
      data: new Date().toISOString(),
      usuarioId: parseInt(usuarioId)
    };

    const endpoint = tipo === "entrada" ? "rendas" : "despesas";

    console.log("🚀 Enviando transação:", novaTransacao);

    await apiFetch(`${apiBase}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(novaTransacao),
    });

    e.target.reset();
    carregarDados();
  });

// Modal de edição
function abrirModalEdicao(id, tipo) {
  const modal = document.getElementById("modal-edicao");
  modal.dataset.id = id;
  modal.dataset.tipo = tipo;
  modal.style.display = "block";
}

document.querySelector(".modal-close-btn").addEventListener("click", () => {
  document.getElementById("modal-edicao").style.display = "none";
});

document
  .getElementById("form-edicao")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const modal = document.getElementById("modal-edicao");
    const id = modal.dataset.id;
    const tipo = modal.dataset.tipo;

    const valorEditado = document
      .getElementById("valor-edicao")
      .value.replace("R$", "")
      .replace(".", "")
      .replace(",", ".")
      .trim();

    const transacaoEditada = {
      valor: parseFloat(valorEditado),
      descricao: document.getElementById("descricao-edicao").value,
      categoria: document.getElementById("categoria-edicao").value,
      data: new Date().toISOString(),
    };

    const endpoint = tipo === "entrada" ? "rendas" : "despesas";

    await apiFetch(`${apiBase}/${endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(transacaoEditada),
    });

    modal.style.display = "none";
    carregarDados();
  });

// Inicializa a dashboard
carregarDados();
