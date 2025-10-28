// Funções de acesso à API de usuário
const API_BASE = 'http://localhost:4000/api/usuario';

async function request(url, options) {
  const resp = await fetch(url, options);
  let data = null;
  const text = await resp.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!resp.ok) {
    const msg = data && data.message ? data.message : text || `Erro HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function registerUser({ name, email, password }) {
  return request(`${API_BASE}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
}

export async function loginUser({ email, password }) {
  return request(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

// Exemplo opcional de verificação rápida
export async function testConnection() {
  try {
    await fetch(API_BASE, { method: 'HEAD' });
    console.log('API acessível.');
  } catch (e) {
    console.warn('Falha ao acessar API:', e.message);
  }
}