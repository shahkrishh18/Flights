const API_URL = "http://192.168.29.168:4000"; 
// ⬆️ Use 10.0.2.2 for Android emulator, http://localhost:4000 for iOS simulator, or your LAN IP for real device.

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include", // needed for refresh token cookie
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const register = ({ name, email, password }) =>
  request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const login = ({ email, password }) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// export const getMe = (accessToken) =>
//   request("/api/auth/me", {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });

export const refreshAccessToken = () =>
  request("/api/auth/refresh", { method: "POST" });