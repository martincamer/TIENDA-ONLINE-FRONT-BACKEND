import { useState } from "react";
import { useCart } from "../../context/CartProvider";
import { formatearDinero } from "../../utils/formatearDinero";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaCreditCard,
  FaMapMarkerAlt,
  FaTruck,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import clienteAxios from "../../config/clienteAxios";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    // Dirección
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    // Tarjeta
    numeroTarjeta: "",
    nombreTarjeta: "",
    fechaExpiracion: "",
    cvv: "",
  });

  const formatCardNumber = (value) => {
    const val = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = val.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const val = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (val.length >= 2) {
      return val.slice(0, 2) + (val.length > 2 ? "/" + val.slice(2, 4) : "");
    }
    return val;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case "numeroTarjeta":
        formattedValue = formatCardNumber(value);
        if (formattedValue.length > 19) return; // 16 dígitos + 3 espacios
        break;
      case "fechaExpiracion":
        formattedValue = formatExpiryDate(value);
        if (formattedValue.length > 5) return; // MM/YY
        break;
      case "cvv":
        formattedValue = value.replace(/[^\d]/g, "");
        if (formattedValue.length > 3) return;
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validarPaso = () => {
    switch (paso) {
      case 1:
        if (
          !formData.nombre ||
          !formData.apellido ||
          !formData.email ||
          !formData.telefono
        ) {
          toast.error("Por favor completa todos los campos personales");
          return false;
        }
        break;
      case 2:
        if (
          !formData.direccion ||
          !formData.ciudad ||
          !formData.provincia ||
          !formData.codigoPostal
        ) {
          toast.error("Por favor completa todos los campos de envío");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const siguientePaso = () => {
    if (validarPaso()) {
      setPaso((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarPaso()) return;

    setLoading(true);
    try {
      // Preparar datos de la venta
      const ventaData = {
        usuario: {
          nombre: `${formData.nombre} ${formData.apellido}`,
          email: formData.email,
          telefono: formData.telefono,
        },
        productos: cart.map((item) => ({
          producto: item._id,
          cantidad: item.cantidad,
          precio_venta: item.precio_venta,
          categoria: item.categoria,
        })),
        envio: {
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          provincia: formData.provincia,
          codigoPostal: formData.codigoPostal,
        },
        pago: {
          metodo: "tarjeta",
          estado: "completado",
          detalles: {
            numeroTarjeta: formData.numeroTarjeta.slice(-4), // Solo últimos 4 dígitos
            nombreTarjeta: formData.nombreTarjeta,
          },
        },
        subtotal: total,
        total: total, // Aquí podrías agregar costos de envío si los hay
      };

      // Crear la venta
      const { data } = await clienteAxios.post("/ventas", ventaData);

      // Si la venta se creó exitosamente
      if (data) {
        toast.success("¡Compra realizada con éxito!");
        clearCart(); // Limpiar el carrito
        navigate("/pago-exitoso", {
          state: {
            ordenId: data.numeroOrden,
            total: data.total,
          },
        });
      }
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      toast.error(error.response?.data?.msg || "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-5">
      <div className="max-w-7xl mx-auto px-4">
        {/* Pasos */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <div
              className={`flex-1 flex items-center ${
                paso >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  paso >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <FaUser />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Paso 1</p>
                <p className="text-xs">Datos Personales</p>
              </div>
            </div>
            <div
              className={`flex-1 flex items-center ${
                paso >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  paso >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <FaTruck />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Paso 2</p>
                <p className="text-xs">Envío</p>
              </div>
            </div>
            <div
              className={`flex-1 flex items-center ${
                paso >= 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  paso >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <FaCreditCard />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Paso 3</p>
                <p className="text-xs">Pago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 shadow-sm border">
              <form onSubmit={handleSubmit}>
                {/* Paso 1: Datos Personales */}
                {paso === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaUser /> Datos Personales
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apellido
                        </label>
                        <input
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Paso 2: Dirección de Envío */}
                {paso === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaMapMarkerAlt /> Dirección de Envío
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Provincia
                        </label>
                        <input
                          type="text"
                          name="provincia"
                          value={formData.provincia}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Paso 3: Datos de Pago */}
                {paso === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaCreditCard /> Datos de Pago
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        name="numeroTarjeta"
                        value={formData.numeroTarjeta}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre en la Tarjeta
                      </label>
                      <input
                        type="text"
                        name="nombreTarjeta"
                        value={formData.nombreTarjeta}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Como aparece en la tarjeta"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Expiración
                        </label>
                        <input
                          type="text"
                          name="fechaExpiracion"
                          value={formData.fechaExpiracion}
                          onChange={handleChange}
                          placeholder="MM/AA"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones de navegación */}
                <div className="flex justify-between mt-8">
                  {paso > 1 && (
                    <button
                      type="button"
                      onClick={() => setPaso((prev) => prev - 1)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Anterior
                    </button>
                  )}
                  {paso < 3 ? (
                    <button
                      type="button"
                      onClick={siguientePaso}
                      className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin">⚪</span>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <FaLock />
                          Pagar {formatearDinero(total)}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Resumen de la compra */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 border shadow-sm sticky top-24">
              <h3 className="text-lg font-bold mb-4">Resumen de la Compra</h3>
              <div className="space-y-4 mb-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium">{item.nombre}</h4>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.cantidad}
                      </p>
                      <p className="text-gray-900">
                        {formatearDinero(item.precio_venta * item.cantidad)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatearDinero(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatearDinero(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
