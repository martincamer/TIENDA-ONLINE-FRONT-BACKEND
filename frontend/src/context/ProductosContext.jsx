import { createContext, useState, useContext, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";
import getConfig from "../helpers/configHeader";

const ProductosContext = createContext();

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({});
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [categorias, setCategorias] = useState([]);

  // Obtener todos los productos
  const obtenerProductos = async () => {
    setLoading(true);
    try {
      const config = getConfig();
      if (!config) return;

      const { data } = await clienteAxios("/productos", config);
      setProductos(data);
    } catch (error) {
      console.log(error);
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener un producto
  const obtenerProducto = async (id) => {
    try {
      const config = getConfig();
      if (!config) return;

      const { data } = await clienteAxios.get(`/productos/${id}`, config);
      return data;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      setAlerta({
        msg: error.response?.data?.msg || "Error al obtener el producto",
        error: true,
      });
      return null;
    }
  };

  // Crear nuevo producto
  const crearProducto = async (producto) => {
    setLoading(true);
    try {
      const config = getConfig();
      if (!config) return;

      const { data } = await clienteAxios.post("/productos", producto, config);
      setProductos([...productos, data]);
      setAlerta({
        msg: "Producto creado correctamente",
        error: false,
      });
    } catch (error) {
      console.log(error);
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Actualizar producto
  const actualizarProducto = async (id, producto) => {
    setLoading(true);
    try {
      const config = getConfig();
      if (!config) return;

      const { data } = await clienteAxios.put(
        `/productos/${id}`,
        producto,
        config
      );

      // Actualizar el state
      const productosActualizados = productos.map((productoState) =>
        productoState._id === data._id ? data : productoState
      );
      setProductos(productosActualizados);

      setAlerta({
        msg: "Producto actualizado correctamente",
        error: false,
      });
    } catch (error) {
      console.log(error);
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      const config = getConfig();
      if (!config) return;

      await clienteAxios.delete(`/productos/${id}`, config);

      // Actualizar el state
      const productosActualizados = productos.filter(
        (producto) => producto._id !== id
      );
      setProductos(productosActualizados);

      setAlerta({
        msg: "Producto eliminado correctamente",
        error: false,
      });
    } catch (error) {
      console.log(error);
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const obtenerProductosPublicos = async () => {
    try {
      const { data } = await clienteAxios("/productos/publico");
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const obtenerCategoriasPublicas = async () => {
    try {
      const { data } = await clienteAxios.get("/categorias/publico");
      setCategorias(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategoriasPublicas();
  }, []);

  // Limpiar alerta
  const limpiarAlerta = () => {
    setAlerta({});
  };

  return (
    <ProductosContext.Provider
      value={{
        productos,
        producto,
        loading,
        alerta,
        obtenerProductos,
        obtenerProducto,
        crearProducto,
        actualizarProducto,
        eliminarProducto,
        limpiarAlerta,
        obtenerProductosPublicos,
        categorias,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
};

// Hook personalizado
export const useProductos = () => {
  return useContext(ProductosContext);
};

export default ProductosContext;
