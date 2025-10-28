const BASE_URL = "https://localhost:4000/api";

/**
 * Faz uma requisição genérica para o backend.
 * @param {string} endpoint - ex: '/Usuario/login' ou '/Renda'
 * @param {string} method - ex: 'GET', 'POST', 'PUT', 'DELETE'
 * @param {Object} [body] - Dados a enviar no corpo da requisição (opcional)
 */
async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // adiciona token JWT, se existir
  const token = localStorage.getItem("token");
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const text = await response.text();

    // tenta converter o retorno pra JSON
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = text;
    }

    if (!response.ok) {
      throw new Error(data.message || text || "Erro na requisição");
    }

    return data;
  } catch (error) {
    console.error("❌ API Error:", error);
    alert(error.message);
    throw error;
  }
}
