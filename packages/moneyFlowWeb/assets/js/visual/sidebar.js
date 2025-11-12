// Em sidebar.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS ---
    const openBtn = document.getElementById('open-sidebar-btn');
    const closeBtn = document.getElementById('close-sidebar-btn');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('sidebar'); 
    const body = document.body;

    // Botões dos Sub-menus
    const openSettingsBtn = document.getElementById('open-settings-panel');
    const closeSettingsBtn = document.getElementById('close-settings-panel');
    const openProfileBtn = document.getElementById('open-profile-panel'); 
    const closeProfileBtn = document.getElementById('close-profile-panel'); 

    // Elementos do Perfil (NOVO)
    const profilePanel = document.getElementById('sidebar-profile-menu');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn'); 
    const displayName = document.getElementById('profile-name');
    const displayEmail = document.getElementById('profile-email');
    const inputName = document.getElementById('edit-profile-name');
    const inputEmail = document.getElementById('edit-profile-email');
    const logoutBtn = document.getElementById('logout-btn');           

    // --- FUNÇÕES ---
    const openSidebar = () => {
        if (body) body.classList.add('sidebar-open');
    };

   
    const closeSidebar = () => {
        if (body) body.classList.remove('sidebar-open');
        if (sidebar) {
            sidebar.classList.remove('settings-open');
            sidebar.classList.remove('profile-open'); 
        }
        
        if (profilePanel) profilePanel.classList.remove('editing'); 
    };

    // Abre um Sub-menu específico
    const openSubmenu = (panelClass) => {
        if (sidebar) sidebar.classList.add(panelClass);
    };

    // Fecha o Sub-menu ATUAL
    const closeSubmenu = () => {
        if (sidebar) {
            sidebar.classList.remove('settings-open');
            sidebar.classList.remove('profile-open');
        }

        if (profilePanel) profilePanel.classList.remove('editing'); 
    };

    // Sidebar Principal
    if (openBtn) openBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Sub-menu Configurações
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', () => openSubmenu('settings-open'));
    }
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', closeSubmenu); 
    }

    // Sub-menu Perfil 
    if (openProfileBtn) {
        openProfileBtn.addEventListener('click', () => openSubmenu('profile-open'));
    }
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', closeSubmenu); 
    }

    if (editProfileBtn && profilePanel && inputName && inputEmail && displayName && displayEmail) {
        editProfileBtn.addEventListener('click', () => {
            // Copia valores atuais para os inputs
            inputName.value = displayName.textContent;
            inputEmail.value = displayEmail.textContent;
            // Ativa o modo de edição (via classe CSS)
            profilePanel.classList.add('editing');
        });
    }

    if (cancelEditBtn && profilePanel) {
        cancelEditBtn.addEventListener('click', () => {
           
            profilePanel.classList.remove('editing');
        });
    }

    if (saveProfileBtn && profilePanel && inputName && inputEmail && displayName && displayEmail) {
        saveProfileBtn.addEventListener('click', () => {
            const newName = inputName.value.trim();
            const newEmail = inputEmail.value.trim();

            if (!newName || !newEmail) {
                alert('Nome e Email não podem ficar em branco.');
                return;
            }

            
            console.log("Salvando - Nome:", newName, "Email:", newEmail);

            displayName.textContent = newName;
            displayEmail.textContent = newEmail;

            profilePanel.classList.remove('editing');
        });
    }
});