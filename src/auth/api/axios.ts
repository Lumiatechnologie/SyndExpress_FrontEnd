// src/auth/api/axios.ts
import axios from "axios";

// --- Création de l'instance Axios ---
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Intercepteur de requêtes : injecte le token à chaque appel ---
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const accessToken = localStorage.getItem("auth");
      if (accessToken) {
        const auth = JSON.parse(accessToken);
        if (auth?.accessToken) {
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
      }
    } catch (err) {
      console.warn("Erreur lors de la récupération du token :", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Intercepteur de réponses : gestion simple des erreurs ---
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token invalide ou expiré — Authentification requise");
      
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
