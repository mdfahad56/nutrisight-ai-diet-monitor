import api, { TOKEN_KEY } from "./api";

function storeToken(payload) {
  const token = payload?.access_token;
  if (!token || typeof token !== "string") throw new Error("The server did not return an access token.");
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

export async function login(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  return storeToken(data);
}

export async function register(details) {
  const { data } = await api.post("/auth/register", details);
  return storeToken(data);
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
