const modalEdicao = document.getElementById("modal-edicao");
const formEdicao = document.getElementById("form-edicao");

const valorEdicao = document.getElementById("valor-edicao");
const descricaoEdicao = document.getElementById("descricao-edicao");
const categoriaEdicao = document.getElementById("categoria-edicao");

let rendaAtual = null;

document.addEventListener("click", async (event) => {
  const btn = event.target.closest(".editar-btn");
  if (!btn) return;

  const id = btn.dataset.id;

  const token = localStorage.getItem("token");

  const resposta = await fetch(`https://moneyflowapi-1.onrender.com/api/Rendas`, {
    headers: { 
      "Authorization": `Bearer ${token}`
    }
  });

  const rendas = await resposta.json();
  const renda = rendas.find(r => r.id == id);

  if (!renda) {
    alert("Erro: renda não encontrada!");
    return;
  }

  rendaAtual = renda;

  valorEdicao.value = renda.valor;
  descricaoEdicao.value = renda.descricao;
  categoriaEdicao.value = renda.categoriaId;

  modalEdicao.classList.add("show");
});


document.querySelector(".modal-close-btn")
    .addEventListener("click", () => {
      modalEdicao.classList.remove("show");
});


formEdicao.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");

  const dadosAtualizados = {
    valor: Number(valorEdicao.value),
    descricao: descricaoEdicao.value,
    categoriaId: Number(categoriaEdicao.value),
    data: rendaAtual.data  // ← mantém a mesma data existente
  };
  const resposta = await fetch(`https://moneyflowapi-1.onrender.com/api/Rendas/${rendaAtual.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(dadosAtualizados)
  });

  if (resposta.ok) {
    alert("Renda atualizada!");

    modalEdicao.classList.remove("show");

    window.location.reload(); 
  } else {
    const erro = await resposta.text();
    alert("Erro ao atualizar: " + erro);
  }
});

document.addEventListener("click", async (event) => {
  const btn = event.target.closest(".excluir-btn");
  if (!btn) return;

  const id = btn.dataset.id;

  if (!confirm("Tem certeza que deseja excluir esta renda?")) {
      return;
  }

  const token = localStorage.getItem("token");

  const resposta = await fetch(`https://moneyflowapi-1.onrender.com/api/Rendas/${id}`, {
      method: "DELETE",
      headers: {
          "Authorization": `Bearer ${token}`
      }
  });

  if (resposta.ok) {
      alert("Renda excluída com sucesso!");
      window.location.reload();
  } else {
      const erro = await resposta.text();
      alert("Erro ao excluir: " + erro);
  }
});
