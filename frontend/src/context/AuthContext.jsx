import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import clienteAxios from "../config/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const savedAuth = localStorage.getItem("auth");

    if (token && savedAuth) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          clienteAxios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          return JSON.parse(savedAuth);
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        return {};
      }
    }
    return {};
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        clienteAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        const { data } = await clienteAxios.get("/users/profile");

        setAuth(data);
        localStorage.setItem("auth", JSON.stringify(data));
      } catch (error) {
        console.error("Error de verificación:", error);
        setAuth({});
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        delete clienteAxios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    verificarAuth();
  }, []);

  const login = async (datos) => {
    try {
      const { data } = await clienteAxios.post("/users/login", datos);

      setAuth(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("auth", JSON.stringify(data));

      clienteAxios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error de login:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const logout = () => {
    setAuth({});
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    delete clienteAxios.defaults.headers.common["Authorization"];
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
