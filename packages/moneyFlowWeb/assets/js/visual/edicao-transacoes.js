document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Elementos do Painel de Perfil (Edit/Save/Cancel) ---
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

    // --- Função helper para validar e-mail ---
    function isEmailValido(email) {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regexEmail.test(email);
    }

    // --- 2. Função principal para alternar os modos (Edit/Save/Cancel) ---
    function toggleEditMode(isEditing) {
        if (isEditing) {
            // -- MODO DE EDIÇÃO --
            profileNameInput.value = profileNameSpan.textContent;
            profileEmailInput.value = profileEmailSpan.textContent;
            displayElements.forEach(el => el.style.display = 'none');
            editElements.forEach(el => el.style.display = 'block'); 
            profileEmailInput.style.borderColor = ''; 
        } else {
            // -- MODO DE VISUALIZAÇÃO --
            editElements.forEach(el => el.style.display = 'none');
            displayElements.forEach(el => el.style.display = 'block');
        }
    }

    // --- 3. Listeners dos botões (Edit/Save/Cancel) ---

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            toggleEditMode(true); // Ativa o modo de edição
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const emailDigitado = profileEmailInput.value;
    
            // Validação de E-mail
            if (!isEmailValido(emailDigitado)) {
                alert('Formato de e-mail inválido. Por favor, corrija.');
                profileEmailInput.style.borderColor = 'red';
                profileEmailInput.focus();
                return; // Para a execução
            }
    
            profileEmailInput.style.borderColor = ''; 
            profileNameSpan.textContent = profileNameInput.value;
            profileEmailSpan.textContent = emailDigitado; 
    
            // TODO: Adicionar aqui a lógica para salvar no banco de dados (API)
            
            toggleEditMode(false); // Volta ao modo de visualização
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            toggleEditMode(false); // Apenas cancela
        });
    }

    // --- 4. NOVO: Lógica para APAGAR CONTA ---
    const deleteAccountBtn = document.getElementById('delete-account-btn');

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', async () => {
            
            // 1. PRIMEIRA CONFIRMAÇÃO
            const confirm1 = confirm(
                'VOCÊ TEM CERTEZA?\n\nEsta ação é IRREVERSÍVEL e vai apagar permanentemente sua conta e TODOS os seus dados financeiros.'
            );
            
            if (!confirm1) return; // Usuário cancelou

            // 2. SEGUNDA CONFIRMAÇÃO (com digitação)
            const confirm2 = prompt(
                'Para confirmar, digite "APAGAR" em letras maiúsculas:'
            );

            if (confirm2 !== 'APAGAR') {
                alert('Ação cancelada. O texto não corresponde.');
                return;
            }

            // 3. PEGAR O TOKEN
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Erro: Você não está logado.');
                return;
            }

            // 4. FAZER A CHAMADA 'DELETE' PARA A API
            try {
                // !!! IMPORTANTE: Substitua pela URL CORRETA da sua API !!!
                const response = await fetch('/api/usuario/apagar-minha-conta', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.ok) {
                    alert('Sua conta foi apagada com sucesso.');
                    localStorage.clear(); // Limpa tudo (token, email, etc.)
                    // Envia o usuário para a página de login
                    window.location.href = '/index.html'; 
                } else {
                    const erroData = await response.json();
                    alert(`Erro ao apagar a conta: ${erroData.message || response.statusText}`);
                }

            } catch (error) {
                console.error('Erro ao apagar conta:', error);
                alert('Não foi possível conectar ao servidor.');
            }
        });
    }
});