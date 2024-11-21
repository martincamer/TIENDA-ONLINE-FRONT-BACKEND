import { useCart } from "../../context/CartProvider";
import { formatearDinero } from "../../utils/formatearDinero";
import { Link } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

const Carrito = () => {
  const { cart, total, removeFromCart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen py-5 flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Lista de Productos */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex gap-4 bg-white p-4 border">
              <img
                src={item.imagen}
                alt={item.nombre}
                className="w-24 h-24 object-cover rounded-md"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.nombre}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Precio: {formatearDinero(item.precio_venta)}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, Math.max(1, item.cantidad - 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FaMinus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.cantidad}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        Math.min(item.stock_actual, item.cantidad + 1)
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-auto text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="bg-white p-6 border h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen de compra</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatearDinero(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="border-t pt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>{formatearDinero(total)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Proceder al pago
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
