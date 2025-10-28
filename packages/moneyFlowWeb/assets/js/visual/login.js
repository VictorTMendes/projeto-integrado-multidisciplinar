import { registerUser, loginUser } from '../../script/api.js';

const formRegister = document.getElementById('form-register');
const formLogin = document.getElementById('form-login');
const msgRegister = document.getElementById('msg-register');
const msgLogin = document.getElementById('msg-login');

function setMsg(el, text, ok=false){
  if(!el) return;
  el.textContent = text;
  el.style.color = ok ? 'green' : 'red';
}

formRegister?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();
  const password = document.getElementById('reg-password')?.value;
  setMsg(msgRegister, 'Enviando...', true);
  try {
    const data = await registerUser({ name, email, password });
    setMsg(msgRegister, `Registrado: id=${data.id} email=${data.email}`, true);
    console.log('Registro OK', data);
  } catch (err) {
    setMsg(msgRegister, err.message);
    console.error('Erro registro', err);
  }
});

formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  setMsg(msgLogin, 'Autenticando...', true);
  try {
    const data = await loginUser({ email, password });
    setMsg(msgLogin, `Token: ${data.token?.substring(0,12)}...`, true);
    console.log('Login OK', data);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userEmail', data.user?.email || email);
  } catch (err) {
    setMsg(msgLogin, err.message);
    console.error('Erro login', err);
  }
});
