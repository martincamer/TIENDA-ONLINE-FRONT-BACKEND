import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartProvider";
import { useState, useRef, useEffect } from "react";
import { formatearDinero } from "../utils/formatearDinero";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { cart, removeFromCart, total } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const cartRef = useRef();
  const mobileMenuRef = useRef();

  // Cerrar carrito y menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border border-gray-300 w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo y Botón Mobile */}
          <div className="flex items-center">
            <button
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 lg:hidden"
              onClick={() => setShowMobileMenu(true)}
            >
              <FaBars className="h-6 w-6" />
            </button>
            <Link to="/" className="text-xl font-bold text-gray-800 ml-2">
              MiTienda
            </Link>
          </div>

          {/* Enlaces de navegación desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Inicio
            </Link>
            <Link
              to="/productos-tienda"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Productos
            </Link>
            <Link
              to="/contacto"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Contacto
            </Link>
          </div>

          {/* Carrito (visible en ambas vistas) */}
          <div className="flex items-center">
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setShowCart(!showCart)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                <FaShoppingCart className="text-xl" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Dropdown del carrito */}
              <AnimatePresence>
                {showCart && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white  shadow-xl border"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Mi Carrito</h3>

                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          Tu carrito está vacío
                        </p>
                      ) : (
                        <>
                          <div className="space-y-3 max-h-60 overflow-auto">
                            {cart.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group"
                              >
                                <img
                                  src={item.imagen}
                                  alt={item.nombre}
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {item.nombre}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {item.cantidad} x{" "}
                                    {formatearDinero(item.precio_venta)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="border-t mt-4 pt-4">
                            <div className="flex justify-between font-semibold mb-4">
                              <span>Total:</span>
                              <span>{formatearDinero(total)}</span>
                            </div>

                            <div className="space-y-2">
                              <Link
                                to="/carrito"
                                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors"
                                onClick={() => setShowCart(false)}
                              >
                                Ver Carrito
                              </Link>
                              <Link
                                to="/checkout"
                                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                                onClick={() => setShowCart(false)}
                              >
                                Finalizar Compra
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Menú Mobile */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Drawer */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-8">
                  <Link
                    to="/"
                    className="text-xl font-bold text-gray-800"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    MiTienda
                  </Link>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/productos-tienda"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Productos
                  </Link>
                  <Link
                    to="/contacto"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Contacto
                  </Link>
                </div>

                {/* Información adicional */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                    <span>¿Necesitas ayuda?</span>
                  </div>
                  <a
                    href="tel:+1234567890"
                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600"
                  >
                    Llámanos: (123) 456-7890
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
