import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const ModalSeleccionarProducto = ({
  modalId = "modal_seleccionar_producto",
  productos,
  onSeleccionar,
  onClose,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    const productosValidos = productos.filter(
      (p) =>
        p &&
        p.nombre &&
        p.codigo &&
        (typeof p.precio === "number" || typeof p.precio === "string") &&
        (typeof p.stock === "number" || typeof p.stock === "string")
    );
    setProductosFiltrados(productosValidos);
  }, [productos]);

  const handleBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(e.target.value);

    if (valor === "") {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter(
        (producto) =>
          producto?.nombre?.toLowerCase().includes(valor) ||
          producto?.codigo?.toLowerCase().includes(valor)
      );
      setProductosFiltrados(filtrados);
    }
  };

  const handleModalOpen = () => {
    setBusqueda("");
    setProductosFiltrados(productos);
  };

  useEffect(() => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.addEventListener("show", handleModalOpen);
      return () => modal.removeEventListener("show", handleModalOpen);
    }
  }, [modalId, productos]);

  const formatearPrecio = (precio) => {
    return typeof precio === "number" ? precio.toFixed(2) : "0.00";
  };

  const handleSeleccion = (producto) => {
    onSeleccionar(producto);
    document.getElementById(modalId).close();
    setBusqueda("");
  };

  // Función para cerrar el modal
  const handleClose = () => {
    document.getElementById(modalId).close();
    setBusqueda(""); // Limpiar búsqueda al cerrar
    setProductosFiltrados(productos); // Resetear productos filtrados
  };

  // Agregar esta función auxiliar al inicio del componente
  const acortarTexto = (texto, longitud = 25) => {
    if (!texto) return "Sin nombre";
    return texto.length > longitud
      ? texto.substring(0, longitud) + "..."
      : texto;
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-4xl p-0">
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-6 border-b bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800">
            Seleccionar Producto
          </h3>
          <button
            onClick={handleClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Buscador */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={handleBusqueda}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Tabla */}
          <div className="border rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th> */}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No se encontraron productos
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((producto) => (
                    <tr key={producto._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {producto.codigo || "Sin código"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm font-medium text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]"
                          title={producto.nombre}
                        >
                          {acortarTexto(producto.nombre)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {producto.categoria || "Sin categoría"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            (producto.stock_actual || 0) > 10
                              ? "bg-green-100 text-green-800"
                              : (producto.stock_actual || 0) > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {producto.stock_actual || 0} unidades
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${formatearPrecio(producto.precio)}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleSeleccion(producto)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Seleccionar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ModalSeleccionarProducto;
