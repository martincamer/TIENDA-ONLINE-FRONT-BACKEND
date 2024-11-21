import axios from "axios";

const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://localhost:4000/api",
});

// Interceptor para requests
clienteAxios.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Si es FormData, configurar el Content-Type apropiado
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    // Log de la petición
    console.log("Request:", {
      url: config.url,
      method: config.method,
      data: config.data instanceof FormData ? "[FormData]" : config.data,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
clienteAxios.interceptors.response.use(
  (response) => {
    // Log de la respuesta exitosa
    console.log("Response:", {
      status: response.status,
      data: response.data,
      config: {
        url: response.config.url,
        method: response.config.method,
      },
    });
    return response;
  },
  (error) => {
    // Log detallado del error
    console.error("Response Error:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config && {
        url: error.config.url,
        method: error.config.method,
      },
    });
    return Promise.reject(error);
  }
);

// Log de configuración inicial
if (process.env.NODE_ENV !== "production") {
  console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
  console.log("Base URL:", clienteAxios.defaults.baseURL);
}

export default clienteAxios;
