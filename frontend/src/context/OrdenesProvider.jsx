import { createContext, useContext, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import { toast } from "react-hot-toast";

const OrdenesContext = createContext();

export const OrdenesProvider = ({ children }) => {
  const [ordenes, setOrdenes] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [ordenActual, setOrdenActual] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Obtener config con token
  const getConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Obtener todas las órdenes
  const obtenerOrdenes = async () => {
    try {
      const config = getConfig();
      if (!config) return;

      setCargando(true);
      const { data } = await clienteAxios.get("/ordenes", config);
      setOrdenes(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener las órdenes");
    } finally {
      setCargando(false);
    }
  };

  // Crear nueva orden
  const crearOrden = async (orden) => {
    try {
      const config = getConfig();
      if (!config) return;

      const { data } = await clienteAxios.post("/ordenes", orden, config);

      setOrdenes([...ordenes, data]);
      toast.success("Orden creada correctamente");
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al crear la orden");
      return false;
    }
  };

  // Actualizar estado de orden
  const actualizarEstadoOrden = async (id, estado) => {
    try {
      const config = getConfig();
      if (!config) return;

      const { data } = await clienteAxios.put(
        `/ordenes/${id}`,
        { estado },
        config
      );

      setOrdenes(ordenes.map((orden) => (orden._id === id ? data : orden)));

      toast.success(`Orden ${estado} correctamente`);
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al actualizar la orden");
      return false;
    }
  };

  // Eliminar orden
  const eliminarOrden = async (id) => {
    try {
      const config = getConfig();
      if (!config) return;

      await clienteAxios.delete(`/ordenes/${id}`, config);

      setOrdenes(ordenes.filter((orden) => orden._id !== id));
      toast.success("Orden eliminada correctamente");
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al eliminar la orden");
      return false;
    }
  };

  // Obtener una orden específica
  const obtenerOrden = async (id) => {
    try {
      const { data } = await clienteAxios.get(`/ordenes/${id}`);
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener la orden");
    }
  };

  return (
    <OrdenesContext.Provider
      value={{
        ordenes,
        alerta,
        ordenActual,
        cargando,
        obtenerOrdenes,
        crearOrden,
        actualizarEstadoOrden,
        eliminarOrden,
        obtenerOrden,
      }}
    >
      {children}
    </OrdenesContext.Provider>
  );
};

export const useOrdenes = () => {
  const context = useContext(OrdenesContext);
  if (!context) {
    throw new Error("useOrdenes debe ser usado dentro de un OrdenesProvider");
  }
  return context;
};

export default OrdenesContext;
