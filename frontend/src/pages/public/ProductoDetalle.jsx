import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaBox,
} from "react-icons/fa";
import { formatearDinero } from "../../utils/formatearDinero";
import clienteAxios from "../../config/clienteAxios";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartProvider";
import { toast } from "react-hot-toast";

const ProductoDetalle = () => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const { id } = useParams();
  const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] =
    useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const { data } = await clienteAxios(`/productos/publico/${id}`);
        console.log("data", data);
        setProducto(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    obtenerProducto();
  }, [id]);

  // Función para acortar texto
  const acortarTexto = (texto, longitud = 150) => {
    if (texto?.length <= longitud) return texto;
    return texto?.slice(0, longitud) + "...";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        <Link to="/" className="text-blue-500 hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="bg-white overflow-hidden border">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Columna Izquierda - Imagen */}
          <div className="flex flex-col items-center">
            <TransformWrapper>
              <TransformComponent>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-[500px] object-contain cursor-zoom-in"
                />
              </TransformComponent>
            </TransformWrapper>
            <p className="text-center text-sm text-gray-500">
              * Pasa el mouse o toca para hacer zoom
            </p>
          </div>

          {/* Columna Derecha - Información */}
          <div className="space-y-6">
            {/* Encabezado */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {producto.nombre}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar className="text-gray-300" />
                  <span className="ml-2 text-gray-600">(4.0)</span>
                </div>
                <span
                  className={`${
                    producto.stock_actual > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {producto.stock_actual > 0
                    ? `${producto.stock_actual} unidades disponibles`
                    : "Producto agotado"}
                </span>
              </div>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatearDinero(producto.precio_venta)}
                </span>
                {producto.precio_compra > producto.precio_venta && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm font-medium">
                    10% OFF
                  </span>
                )}
              </div>
              <p className="text-green-600">
                6 cuotas sin interés de{" "}
                {formatearDinero(producto.precio_venta / 6)}
              </p>
            </div>

            {/* Selector de Cantidad */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="px-3 py-1 border rounded-md hover:bg-gray-100"
                  disabled={producto.stock_actual === 0}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={producto.stock_actual}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="w-20 text-center border rounded-md py-1"
                  disabled={producto.stock_actual === 0}
                />
                <button
                  onClick={() =>
                    setCantidad(Math.min(producto.stock_actual, cantidad + 1))
                  }
                  className="px-3 py-1 border rounded-md hover:bg-gray-100"
                  disabled={producto.stock_actual === 0}
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-3">
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                disabled={producto.stock_actual === 0}
                onClick={() => {
                  addToCart(producto, cantidad);
                  toast.success("Producto agregado al carrito");
                }}
              >
                <FaShoppingCart /> Agregar al carrito
              </button>
              <button
                className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={producto.stock_actual === 0}
              >
                Comprar ahora
              </button>
            </div>

            {/* Descripción con animación */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span>Descripción</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </h3>

              <div className="relative">
                <AnimatePresence initial={false}>
                  <motion.div
                    initial={{ height: "80px" }}
                    animate={{
                      height: mostrarDescripcionCompleta ? "auto" : "80px",
                    }}
                    exit={{ height: "80px" }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {mostrarDescripcionCompleta
                        ? producto.descripcion
                        : acortarTexto(producto.descripcion)}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {producto.descripcion?.length > 150 && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 text-center 
                    ${
                      mostrarDescripcionCompleta
                        ? "pt-4"
                        : "pt-8 bg-gradient-to-t from-white to-transparent"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setMostrarDescripcionCompleta(
                          !mostrarDescripcionCompleta
                        )
                      }
                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full 
                      text-sm font-medium transition-colors duration-200 border hover:shadow-sm"
                    >
                      {mostrarDescripcionCompleta ? (
                        <>
                          Ver menos
                          <motion.span
                            initial={{ rotate: 180 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.2 }}
                            className="inline-block ml-1"
                          >
                            ▼
                          </motion.span>
                        </>
                      ) : (
                        <>
                          Ver más
                          <motion.span
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 180 }}
                            transition={{ duration: 0.2 }}
                            className="inline-block ml-1"
                          >
                            ▼
                          </motion.span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-3 gap-4 border-t pt-6">
              <div className="text-center">
                <FaTruck className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                <p className="text-sm text-gray-600">Envío gratis</p>
              </div>
              <div className="text-center">
                <FaShieldAlt className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                <p className="text-sm text-gray-600">Garantía de 12 meses</p>
              </div>
              <div className="text-center">
                <FaBox className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                <p className="text-sm text-gray-600">Stock disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
