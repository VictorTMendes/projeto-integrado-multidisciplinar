document.addEventListener('DOMContentLoaded', () => {
  const themeToggleButton = document.getElementById('trocar-tema');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    let theme = 'dark';
    if (document.body.classList.contains('light-mode')) {
      theme = 'light';
    }
    localStorage.setItem('theme', theme);
    
  });
});