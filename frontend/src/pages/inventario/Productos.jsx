import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useProductos } from "../../context/ProductosContext";
import { formatearDinero } from "../../utils/formatearDinero";
import ModalCrearProducto from "../../components/productos/ModalCrearProducto";
import ModalEditarProducto from "../../components/productos/ModalEditarProducto";
import ModalEliminarProducto from "../../components/productos/ModalEliminarProducto";

const Productos = () => {
  const { productos, eliminarProducto } = useProductos();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [stockFiltro, setStockFiltro] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productoEditarId, setProductoEditarId] = useState(null);
  const [productoEliminar, setProductoEliminar] = useState(null);
  const [pagina, setPagina] = useState(1);
  const productosPorPagina = 10;

  // Obtener categorías únicas de los productos
  const categorias = [...new Set(productos?.map((p) => p.categoria))];

  // Efecto para filtrar productos
  useEffect(() => {
    filtrarProductos();
  }, [busqueda, categoriaFiltro, stockFiltro, productos]);

  const filtrarProductos = () => {
    let resultado = [...(productos || [])];

    // Filtro por búsqueda
    if (busqueda) {
      resultado = resultado.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          producto.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
          producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro por categoría
    if (categoriaFiltro) {
      resultado = resultado.filter(
        (producto) => producto.categoria === categoriaFiltro
      );
    }

    // Filtro por estado de stock
    if (stockFiltro) {
      switch (stockFiltro) {
        case "disponible":
          resultado = resultado.filter(
            (producto) => producto.stock_actual > producto.stock_minimo
          );
          break;
        case "bajo":
          resultado = resultado.filter(
            (producto) =>
              producto.stock_actual <= producto.stock_minimo &&
              producto.stock_actual > 0
          );
          break;
        case "agotado":
          resultado = resultado.filter(
            (producto) => producto.stock_actual === 0
          );
          break;
        default:
          break;
      }
    }

    setProductosFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaFiltro("");
    setStockFiltro("");
  };

  const abrirModal = () => {
    document.getElementById("modal_crear_producto").showModal();
  };

  const handleEditar = (id) => {
    setProductoEditarId(id);
    const modal = document.getElementById("modal_editar_producto");
    if (modal) {
      modal.showModal();
    } else {
      console.error("Modal no encontrado");
    }
  };

  const handleEliminar = (id) => {
    const producto = productos.find((p) => p._id === id);
    setProductoEliminar(producto);
    document.getElementById("modal_eliminar_producto").showModal();
  };

  const confirmarEliminar = async () => {
    if (productoEliminar) {
      await eliminarProducto(productoEliminar._id);
      document.getElementById("modal_eliminar_producto").close();
      setProductoEliminar(null);
    }
  };

  // Calcular productos para la página actual
  const indexOfLastProducto = pagina * productosPorPagina;
  const indexOfFirstProducto = indexOfLastProducto - productosPorPagina;
  const productosActuales = productosFiltrados.slice(
    indexOfFirstProducto,
    indexOfLastProducto
  );

  // Funciones para paginación
  const handleAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  const handleSiguiente = () => {
    if (indexOfLastProducto < productosFiltrados.length) {
      setPagina(pagina + 1);
    }
  };

  useEffect(() => {
    return () => {
      setProductoEditarId(null);
      setProductoEliminar(null);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con acciones principales */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Gestión de Productos
            </h1>
            <div className="flex gap-4">
              <button
                onClick={abrirModal}
                className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaPlus className="text-sm" />
                Nuevo Producto
              </button>
              <Link
                to="/inventario/categorias"
                className="px-4 py-2 border border-gray-600 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaPlus className="text-sm" />
                Crear Categoría
              </Link>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, código o categoría..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <select
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 capitalize outline-none"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option className="capitalize text-sm font-bold" value="">
                Todas las categorías
              </option>
              {categorias.map((cat) => (
                <option
                  className="capitalize text-sm font-semibold"
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 capitalize outline-none"
              value={stockFiltro}
              onChange={(e) => setStockFiltro(e.target.value)}
            >
              <option className="capitalize text-sm font-bold" value="">
                Estado de stock
              </option>
              <option
                className="capitalize text-sm font-semibold"
                value="disponible"
              >
                Stock disponible
              </option>
              <option className="capitalize text-sm font-semibold" value="bajo">
                Stock bajo
              </option>
              <option
                className="capitalize text-sm font-semibold"
                value="agotado"
              >
                Sin stock
              </option>
            </select>
          </div>

          {/* Filtros activos */}
          {(busqueda || categoriaFiltro || stockFiltro) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">Filtros activos:</span>
              {busqueda && (
                <span className="px-3 py-1 text-sm border border-blue-200 text-blue-600 rounded-lg bg-blue-50">
                  {busqueda}
                </span>
              )}
              {categoriaFiltro && (
                <span className="px-3 py-1 text-sm border border-gray-200 text-gray-600 rounded-lg bg-gray-50">
                  {categoriaFiltro}
                </span>
              )}
              {stockFiltro && (
                <span className="px-3 py-1 text-sm border border-gray-200 text-gray-600 rounded-lg bg-gray-50">
                  {stockFiltro}
                </span>
              )}
              <button
                onClick={limpiarFiltros}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg border overflow-x-auto">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No se encontraron productos con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                productosActuales.map((producto) => (
                  <tr key={producto._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {producto.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div
                        className="max-w-xs truncate"
                        title={producto.nombre}
                      >
                        {producto.nombre.length > 30
                          ? producto.nombre.substring(0, 30) + "..."
                          : producto.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          producto.stock_actual > producto.stock_minimo
                            ? "bg-green-100 text-green-800"
                            : producto.stock_actual > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {producto.stock_actual} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatearDinero(producto.precio_venta)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {producto.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/inventario/productos/${producto._id}`}
                        className="text-green-600 hover:text-green-800 mr-4"
                      >
                        Ver
                      </Link>
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-4"
                        onClick={() => handleEditar(producto._id)}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleEliminar(producto._id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="bg-white rounded-lg border mt-6 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Mostrando {indexOfFirstProducto + 1} a{" "}
            {Math.min(indexOfLastProducto, productosFiltrados.length)} de{" "}
            <span className="font-medium">{productosFiltrados.length}</span>{" "}
            resultados
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAnterior}
              disabled={pagina === 1}
              className={`px-4 py-2 border rounded-lg ${
                pagina === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleSiguiente}
              disabled={indexOfLastProducto >= productosFiltrados.length}
              className={`px-4 py-2 border rounded-lg ${
                indexOfLastProducto >= productosFiltrados.length
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <ModalCrearProducto />

      <ModalEditarProducto
        productoId={productoEditarId}
        onClose={() => setProductoEditarId(null)}
      />

      {productoEliminar && (
        <ModalEliminarProducto
          producto={productoEliminar}
          onConfirm={confirmarEliminar}
        />
      )}
    </div>
  );
};

export default Productos;
