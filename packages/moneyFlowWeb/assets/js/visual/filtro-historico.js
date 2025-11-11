// document.addEventListener('DOMContentLoaded', () => {

//     // --- CONFIGURAÇÃO ---
//     // Coloque aqui a classe que você encontrou no Passo 1
//     const CLASSE_DO_ITEM_LI = 'tag-categoria-entrada'; // <-- MUDE ISSO PARA SUA CLASSE REAL
//     // --------------------

//     const filtro = document.getElementById('filtro-categoria');
//     const listaHistorico = document.getElementById('lista-historico');

//     if (!filtro || !listaHistorico) {
//         console.error("Filtro ou Lista não encontrados. A filtragem não funcionará.");
//         return;
//     }

//     // Ouve o evento de "mudança" no dropdown
//     filtro.addEventListener('change', () => {
        
//         const categoriaSelecionada = filtro.value; // ex: "all", "1", "2"
        
//         // Usa a CLASSE_DO_ITEM_LI para encontrar os <li>
//         const transacoes = listaHistorico.querySelectorAll(`li.${CLASSE_DO_ITEM_LI}`); 
        
//         if (transacoes.length === 0) {
//             console.warn(`O filtro não encontrou nenhum item com a classe: ".${CLASSE_DO_ITEM_LI}"`);
//             return;
//         }

//         transacoes.forEach(item => {
//             const itemCategoria = item.dataset.category;

//             // Se a categoria do item não foi definida (erro do Passo 1)
//             if (!itemCategoria) {
//                 console.error("Este item está sem 'data-category'!", item);
//                 return;
//             }

//             // A lógica do filtro
//             if (categoriaSelecionada === 'all' || itemCategoria === categoriaSelecionada) {
//                 item.style.display = 'flex'; // Use 'flex' ou 'block'
//             } else {
//                 item.style.display = 'none';
//             }
//         });
//     });
// });