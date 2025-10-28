// Espera o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {

  // Pega o botão pelo ID que você definiu no HTML
  const themeToggleButton = document.getElementById('trocar-tema');

  // Pega o tema salvo no localStorage (se existir)
  const currentTheme = localStorage.getItem('theme');

  // Se existir um tema salvo como 'light', aplica a classe light-mode no body
  if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  // Adiciona um evento de 'click' no botão
  themeToggleButton.addEventListener('click', () => {
    // Adiciona ou remove a classe 'light-mode' do body
    document.body.classList.toggle('light-mode');

    // Agora, salva a preferência no localStorage
    let theme = 'dark'; // Padrão
    if (document.body.classList.contains('light-mode')) {
      theme = 'light';
    }
    localStorage.setItem('theme', theme);
  });

});