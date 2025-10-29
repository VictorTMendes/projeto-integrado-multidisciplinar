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
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Erro na requisição:", errorText);
    throw new Error(errorText);
  }
  
  return res.json();
}

// Carrega categorias da API
async function carregarCategorias() {
  try {
    const categorias = await apiFetch(`${apiBaseTeste}/categorias`);
    
    const selectCategorias = document.getElementById("categoria");
    const selectCategoriasEdicao = document.getElementById("categoria-edicao");
    
    if (!selectCategorias || !selectCategoriasEdicao) {
      console.error("❌ Elementos select não encontrados no DOM");
      return;
    }
    
    // Limpa opções existentes
    selectCategorias.innerHTML = '<option value="" disabled selected>Selecione uma categoria</option>';
    selectCategoriasEdicao.innerHTML = '<option value="" disabled>Selecione uma categoria</option>';

    categorias.forEach(cat => {
      const id = cat.id;
      const nome = cat.nome;
      
      
      const option1 = document.createElement("option");
      option1.value = id;
      option1.textContent = nome;
      selectCategorias.appendChild(option1);
      
      const option2 = document.createElement("option");
      option2.value = id;
      option2.textContent = nome;
      selectCategoriasEdicao.appendChild(option2);
    });
    
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    alert("Erro ao carregar categorias. Verifique se a API está rodando.");
  }
}

// Carrega rendas e despesas reais
async function carregarDados() {
  try {
    const [despesas, rendas] = await Promise.all([
      apiFetch(`${apiBaseTeste}/despesas`),
      apiFetch(`${apiBaseTeste}/rendas`)
    ]);

    atualizarDashboard(rendas, despesas);
  } catch (error) {
    console.error("❌ Erro ao carregar dados:", error);
  }
}

// Atualiza cards e lista de transações
function atualizarDashboard(rendas, despesas) {
  const entradasEl = document.getElementById("entradas");
  const saidasEl = document.getElementById("saidas");
  const saldoEl = document.getElementById("saldo");
  const listaEl = document.getElementById("ultimas-transacoes");

  // Usa maiúscula por causa do PropertyNamingPolicy = null
  let totalRendas = rendas.reduce((s, r) => s + parseFloat(r.valor || r.Valor || 0), 0);
  let totalDespesas = despesas.reduce((s, d) => s + parseFloat(d.valor || d.Valor || 0), 0);
  let saldo = totalRendas - totalDespesas;

  console.log("💰 Total Rendas:", totalRendas);
  console.log("💸 Total Despesas:", totalDespesas);
  console.log("💵 Saldo:", saldo);

  entradasEl.textContent = `R$ ${totalRendas.toFixed(2)}`;
  saidasEl.textContent = `R$ ${totalDespesas.toFixed(2)}`;
  saldoEl.textContent = `R$ ${saldo.toFixed(2)}`;

  // Junta rendas e despesas pra exibir as últimas
  const todas = [
    ...rendas.map(r => ({ ...r, tipo: "entrada" })),
    ...despesas.map(d => ({ ...d, tipo: "saida" }))
  ].sort((a, b) => new Date(b.data || b.Data) - new Date(a.data || a.Data));

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

    // Suporta tanto camelCase quanto PascalCase
    const valor = t.valor || t.Valor || 0;
    const data = t.data || t.Data;
    const descricao = t.descricao || t.Descricao || t.titulo || t.Titulo;
    const id = t.id || t.Id;
    const categoriaNome = t.categoria?.nome || t.Categoria?.Nome || 'Sem categoria';

    li.innerHTML = `
      <div class="transacao-info">
        <span class="${tipoClasse}">${categoriaNome}</span>
        <p>${descricao}</p>
      </div>

      <div class="${valorClasse}">
        <div class="transacao-valor">
          <span>${sinal} R$ ${parseFloat(valor).toFixed(2)}</span>
          <small>${new Date(data).toLocaleDateString("pt-BR")}</small>
        </div>
      </div>

      <div class="transacao-acoes">
        <button class="acoes-button">
          <i class="fas fa-ellipsis-v"></i>
        </button>

        <div class="dropdown-acoes">
          <a href="#" class="btn-editar" onclick="abrirModalEdicao(${id}, '${t.tipo}')">
            <i class="fas fa-pencil-alt"></i> Editar
          </a>
          <a href="#" class="btn-excluir" onclick="excluirTransacao(${id}, '${t.tipo}')">
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

  try {
    const endpoint = tipo === "entrada" ? "rendas" : "despesas";
    await apiFetch(`${apiBaseTeste}/${endpoint}/${id}`, { method: "DELETE" });
    alert("Transação excluída com sucesso!");
    carregarDados();
  } catch (error) {
    console.error("❌ Erro ao excluir transação:", error);
    alert("Erro ao excluir transação.");
  }
}

// Adicionar nova transação
document
  .getElementById("form-nova-transacao")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const valorInput = document.getElementById("valor").value
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();

    const descricao = document.getElementById("descricao").value.trim();
    const categoriaId = parseInt(document.getElementById("categoria").value);
    
    // Validações
    if (!descricao) {
      alert("Por favor, preencha a descrição!");
      return;
    }
    
    if (!categoriaId || isNaN(categoriaId)) {
      alert("Por favor, selecione uma categoria!");
      return;
    }

    if (!valorInput || parseFloat(valorInput) <= 0) {
      alert("Por favor, insira um valor válido!");
      return;
    }

    const usuarioId = parseInt(localStorage.getItem("usuarioId")) || 0;

    const novaTransacao = {
      descricao: descricao,
      valor: parseFloat(valorInput),
      data: new Date().toISOString(),
      categoriaId: categoriaId,
      usuarioId: usuarioId
    };

    const endpoint = tipo === "entrada" ? "rendas" : "despesas";

    console.log("🚀 Tipo:", tipo);
    console.log("🚀 Endpoint:", `${apiBaseTeste}/${endpoint}`);
    console.log("🚀 Enviando transação:", novaTransacao);

    try {
      const response = await apiFetch(`${apiBaseTeste}/${endpoint}`, {
        method: "POST",
        body: JSON.stringify(novaTransacao),
      });

      console.log("✅ Resposta:", response);
      alert("Transação adicionada com sucesso!");
      e.target.reset();
      carregarDados();
    } catch (error) {
      console.error("❌ Erro ao adicionar transação:", error);
      alert("Erro ao adicionar transação: " + error.message);
    }
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
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();

    const categoriaId = parseInt(document.getElementById("categoria-edicao").value);

    const transacaoEditada = {
      descricao: document.getElementById("descricao-edicao").value,
      valor: parseFloat(valorEditado),
      categoriaId: categoriaId,
      data: new Date().toISOString(),
    };

    const endpoint = tipo === "entrada" ? "rendas" : "despesas";

    try {
      await apiFetch(`${apiBaseTeste}/${endpoint}/${id}`, {
        method: "PUT",
        body: JSON.stringify(transacaoEditada),
      });

      alert("Transação atualizada com sucesso!");
      modal.style.display = "none";
      carregarDados();
    } catch (error) {
      console.error("❌ Erro ao editar transação:", error);
      alert("Erro ao editar transação.");
    }
  });

(async function inicializar() {
  await carregarCategorias();
  await carregarDados();
})();