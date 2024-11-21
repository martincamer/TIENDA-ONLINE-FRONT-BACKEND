import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaBox,
  FaTag,
  FaDollarSign,
  FaWarehouse,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useProductos } from "../../context/ProductosContext";
import { formatearDinero } from "../../utils/formatearDinero";
import ModalEditarProducto from "../../components/productos/ModalEditarProducto";

const VerProducto = () => {
  const { id } = useParams();
  const { obtenerProducto } = useProductos();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [imagenAmpliada, setImagenAmpliada] = useState(false);
  const [descripcionExpandida, setDescripcionExpandida] = useState(false);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await obtenerProducto(id);
        setProducto(data);
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarProducto();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-gray-500">Producto no encontrado</div>
      </div>
    );
  }

  const getEstadoStock = () => {
    if (producto.stock_actual > producto.stock_minimo) {
      return {
        clase: "bg-green-100 text-green-800",
        texto: "Stock Disponible",
      };
    } else if (producto.stock_actual > 0) {
      return {
        clase: "bg-yellow-100 text-yellow-800",
        texto: "Stock Bajo",
      };
    } else {
      return {
        clase: "bg-red-100 text-red-800",
        texto: "Sin Stock",
      };
    }
  };

  const estadoStock = getEstadoStock();

  const toggleDescripcion = () => {
    setDescripcionExpandida(!descripcionExpandida);
  };

  const truncarDescripcion = (texto, longitud = 150) => {
    if (!texto) return "Sin descripción disponible";
    if (texto.length <= longitud) return texto;
    return texto.slice(0, longitud) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                to="/productos"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-semibold text-gray-800">
                Detalle del Producto
              </h1>
            </div>
            {/* <button
              onClick={() => setMostrarModalEditar(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaEdit className="w-4 h-4" />
              Editar Producto
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Imagen del Producto */}
          <div className="bg-white rounded-lg border p-6">
            <div className="relative">
              {/* Contenedor de imagen con tamaño fijo */}
              <div className="w-96 h-96 mx-auto relative group">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-contain rounded-lg cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setImagenAmpliada(true)}
                />
                <button
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setImagenAmpliada(true)}
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                Click en la imagen para ampliar
              </p>
            </div>
          </div>

          {/* Información del Producto */}
          <div className="space-y-6">
            {/* Detalles Básicos */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {producto.nombre}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FaBox className="text-gray-400" />
                  <span className="text-gray-600">Código:</span>
                  <span className="font-medium">{producto.codigo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTag className="text-gray-400" />
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium capitalize">
                    {producto.categoria}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-gray-400" />
                  <span className="text-gray-600">Precio de Venta:</span>
                  <span className="font-medium">
                    {formatearDinero(producto.precio_venta)}
                  </span>
                </div>
              </div>
            </div>

            {/* Estado del Stock */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Estado del Inventario
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaWarehouse className="text-gray-400" />
                    <span className="text-gray-600">Stock Actual:</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${estadoStock.clase}`}
                  >
                    {producto.stock_actual} unidades - {estadoStock.texto}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stock Mínimo:</span>
                  <span className="font-medium">
                    {producto.stock_minimo} unidades
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción con animación */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Descripción
              </h3>
              <div className="relative">
                <p
                  className={`text-gray-600 transition-all duration-300 ease-in-out overflow-hidden ${
                    descripcionExpandida ? "max-h-[1000px]" : "max-h-[100px]"
                  }`}
                >
                  {descripcionExpandida
                    ? producto.descripcion
                    : truncarDescripcion(producto.descripcion)}
                </p>

                {producto.descripcion?.length > 150 && (
                  <button
                    onClick={toggleDescripcion}
                    className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {descripcionExpandida ? (
                      <>
                        <span>Ver menos</span>
                        <FaChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Ver más</span>
                        <FaChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}

                {!descripcionExpandida &&
                  producto.descripcion?.length > 150 && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de imagen ampliada */}
      {imagenAmpliada && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            {/* <button
              className="absolute top-0 right-0 text-white p-2 hover:text-gray-300 transition-colors"
              onClick={() => setImagenAmpliada(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button> */}
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setImagenAmpliada(false)}
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
      )}

      {mostrarModalEditar && (
        <ModalEditarProducto
          productoId={id}
          onClose={() => setMostrarModalEditar(false)}
        />
      )}
    </div>
  );
};

export default VerProducto;
