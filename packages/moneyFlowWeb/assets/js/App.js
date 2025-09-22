import { cadastroUsuario } from "./api.js";

// async function carregarPerfil() {
//   try {
//     const userId = 1; 
//     const perfil = await obterPerfil(userId); 

//     console.log("Perfil carregado:", perfil);

//     document.getElementById("nome").textContent = perfil.name;
//     document.getElementById("email").textContent = perfil.email;
//     document.getElementById("id").textContent = perfil.id;
//   } catch (erro) {
//     console.error("Erro ao carregar perfil:", erro);
//   }
// }

// // Chama a função quando a página carrega
// document.addEventListener('DOMContentLoaded', carregarPerfil);