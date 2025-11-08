// Espera o HTML ser totalmente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Elementos do Painel de Perfil ---
    const profilePanel = document.getElementById('sidebar-profile-menu');
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');

    // Elementos de visualização (spans)
    const profileNameSpan = document.getElementById('profile-name');
    const profileEmailSpan = document.getElementById('profile-email');

    // Elementos de edição (inputs)
    const profileNameInput = document.getElementById('edit-profile-name');
    const profileEmailInput = document.getElementById('edit-profile-email');

    // Seleciona TODOS os elementos que devem aparecer no modo "Visualização"
    const displayElements = profilePanel.querySelectorAll('.profile-display');
    
    // Seleciona TODOS os elementos que devem aparecer no modo "Edição"
    const editElements = profilePanel.querySelectorAll('.profile-edit');

    // --- NOVO: Função para validar o formato do e-mail ---
    function isEmailValido(email) {
      // Expressão Regular simples para checar o formato do e-mail
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regexEmail.test(email);
    }
    // --------------------------------------------------------

    // --- 2. Função principal para alternar os modos ---
    function toggleEditMode(isEditing) {
        if (isEditing) {
            // -- MODO DE EDIÇÃO --
            
            // 1. Copia os valores atuais dos 'spans' para os 'inputs'
            profileNameInput.value = profileNameSpan.textContent;
            profileEmailInput.value = profileEmailSpan.textContent;

            // 2. Esconde os elementos de visualização
            displayElements.forEach(el => el.style.display = 'none');
            
            // 3. Mostra os elementos de edição
            editElements.forEach(el => el.style.display = 'block'); 

            // NOVO: Limpa a borda vermelha (caso tenha dado erro antes)
            profileEmailInput.style.borderColor = ''; 

        } else {
            // -- MODO DE VISUALIZAÇÃO --
            
            // 1. Esconde os elementos de edição
            editElements.forEach(el => el.style.display = 'none');
            
            // 2. Mostra os elementos de visualização
            displayElements.forEach(el => el.style.display = 'block');
        }
    }

    // --- 3. Adiciona os "Ouvintes de Clique" (Event Listeners) ---

    // Quando o usuário clicar em "Editar Perfil"
    editBtn.addEventListener('click', () => {
        toggleEditMode(true); // Ativa o modo de edição
    });

    // --- NOVO: Lógica de "Salvar" ATUALIZADA com Validação ---
    saveBtn.addEventListener('click', () => {
        
        const emailDigitado = profileEmailInput.value;

        // 1. ETAPA DE VALIDAÇÃO
        if (!isEmailValido(emailDigitado)) {
            // Se for INVÁLIDO:
            alert('Formato de e-mail inválido. Por favor, corrija.');
            profileEmailInput.style.borderColor = 'red'; // Destaca o campo
            profileEmailInput.focus(); // Foca no campo
            
            // IMPORTANTE: Para a execução e NÃO salva
            return; 
        }

        // 2. Se for VÁLIDO (continua o código original):
        // Limpa qualquer estilo de erro
        profileEmailInput.style.borderColor = ''; 

        // 3. Salva os novos valores (copia dos 'inputs' para os 'spans')
        profileNameSpan.textContent = profileNameInput.value;
        profileEmailSpan.textContent = emailDigitado; // Usa a variável já criada

        // 4. Volta para o modo de visualização
        toggleEditMode(false);
    });

    // Quando o usuário clicar em "Cancelar"
    cancelBtn.addEventListener('click', () => {
        // Apenas descarta as alterações e volta ao modo de visualização
        toggleEditMode(false); 
    });


    // --- BÔNUS: Lógica para abrir e fechar os painéis ---
    
    const openProfileBtn = document.getElementById('open-profile-panel');
    const closeProfileBtn = document.getElementById('close-profile-panel');
    const mainMenu = document.getElementById('sidebar-main-menu');
    // 'profilePanel' já foi selecionado lá em cima

    if (openProfileBtn) {
        openProfileBtn.addEventListener('click', () => {
            mainMenu.style.display = 'none';
            profilePanel.style.display = 'block';
        });
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => {
            profilePanel.style.display = 'none';
            mainMenu.style.display = 'block';
        });
    }
});