import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { useFacturas } from "../../context/FacturacionProvider";
import { Toaster } from "react-hot-toast";
import { formatearDinero } from "../../utils/formatearDinero";

const VerFactura = () => {
  const { id } = useParams();
  const { obtenerFactura } = useFacturas();
  const [factura, setFactura] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const data = await obtenerFactura(id);
        setFactura(data);
      } catch (error) {
        console.error("Error al cargar factura:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarFactura();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!factura) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-gray-500">Factura no encontrada</div>
      </div>
    );
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEstadoClase = (estado) => {
    const clases = {
      pendiente: "bg-yellow-100 text-yellow-800",
      completado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return clases[estado] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                to="/facturacion"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-semibold text-gray-800">
                Orden #{factura.numeroOrden}
              </h1>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FaPrint className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>

        {/* Estado y Fecha */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Fecha de Orden</p>
              <p className="text-lg font-medium">
                {formatearFecha(factura.createdAt)}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoClase(
                factura.estado
              )}`}
            >
              {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
            </span>
          </div>
        </div>

        {/* Información del Cliente y Envío */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-medium mb-4">
              Información del Cliente
            </h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Nombre:</span>{" "}
                {factura.usuario.nombre}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span>{" "}
                {factura.usuario.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Teléfono:</span>{" "}
                {factura.usuario.telefono}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-medium mb-4">Dirección de Envío</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Dirección:</span>{" "}
                {factura.envio.direccion}
              </p>
              <p className="text-sm">
                <span className="font-medium">Ciudad:</span>{" "}
                {factura.envio.ciudad}
              </p>
              <p className="text-sm">
                <span className="font-medium">Provincia:</span>{" "}
                {factura.envio.provincia}
              </p>
              <p className="text-sm">
                <span className="font-medium">Código Postal:</span>{" "}
                {factura.envio.codigoPostal}
              </p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-lg border overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Precio
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {factura.productos.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.producto.nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.categoria}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {formatearDinero(item.precio_venta)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {item.cantidad}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {formatearDinero(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen de Pago */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-lg font-medium">Resumen de Pago</h2>
            <div className="text-sm">
              <p className="text-gray-500">Método de Pago</p>
              <p className="font-medium capitalize">{factura.pago.metodo}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">
                {formatearDinero(factura.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IGV (18%)</span>
              <span className="font-medium">
                {formatearDinero(factura.total - factura.subtotal)}
              </span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-medium">
                  {formatearDinero(factura.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerFactura;
