const API_URL = "http://localhost:4000/api"

async function obterPerfil(id) {
  try {
    const resposta = await fetch(`${API_URL}/usuario/perfil?id=${id}`);
    
    if (!resposta.ok) {
      throw new Error(`HTTP error! status: ${resposta.status}`);
    }
    
    const dados = await resposta.json();
    console.log("Dados recebidos da API:", dados);
    return dados;
  } catch (erro) {
    console.error("Erro na função obterPerfil:", erro);
    throw erro;
  }
}

async function cadastroUsuario(){
    
}

// Exportar a função para ser usada em outros arquivos
export { obterPerfil, cadastroUsuario };