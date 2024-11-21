import { createContext, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import clienteAxios from "../config/clienteAxios";

const FacturacionContext = createContext();

export const FacturacionProvider = ({ children }) => {
  const [facturas, setFacturas] = useState([]);

  const obtenerFacturas = async () => {
    try {
      const { data } = await clienteAxios("/ventas");
      setFacturas(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener las facturas");
    }
  };

  const obtenerFactura = async (id) => {
    try {
      const { data } = await clienteAxios(`/ventas/${id}`);
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener la factura");
      throw error;
    }
  };

  const actualizarEstadoFactura = async (id, estado) => {
    try {
      const { data } = await clienteAxios.put(`/ventas/${id}/estado`, {
        estado,
      });
      setFacturas(facturas.map((f) => (f._id === id ? data : f)));
      toast.success("Estado actualizado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado");
    }
  };

  return (
    <FacturacionContext.Provider
      value={{
        facturas,
        obtenerFacturas,
        obtenerFactura,
        actualizarEstadoFactura,
      }}
    >
      {children}
    </FacturacionContext.Provider>
  );
};

export const useFacturas = () => {
  return useContext(FacturacionContext);
};

export default FacturacionProvider;
