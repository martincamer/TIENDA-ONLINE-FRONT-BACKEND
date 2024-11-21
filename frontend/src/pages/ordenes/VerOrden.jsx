import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrdenes } from "../../context/OrdenesProvider";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { formatearDinero } from "../../utils/formatearDinero";

const VerOrden = () => {
  const { id } = useParams();
  const { obtenerOrden } = useOrdenes();
  const [orden, setOrden] = useState(null);

  useEffect(() => {
    const cargarOrden = async () => {
      const data = await obtenerOrden(id);
      setOrden(data);
    };
    cargarOrden();
  }, [id]);

  if (!orden) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      aprobada: "bg-blue-100 text-blue-800",
      recibida: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800",
    };
    return clases[estado] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                to="/ordenes"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-semibold text-gray-800">
                Orden de Compra #{orden.numeroOrden}
              </h1>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FaPrint className="text-sm" />
              Imprimir
            </button>
          </div>
        </div>

        {/* Información General */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Información de la Orden
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fecha:</span>{" "}
                  {formatearFecha(orden.fecha)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Estado:</span>{" "}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getEstadoClase(
                      orden.estado
                    )}`}
                  >
                    {orden.estado.charAt(0).toUpperCase() +
                      orden.estado.slice(1)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Usuario:</span>{" "}
                  {orden.usuario.nombre}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Información del Proveedor
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Nombre:</span>{" "}
                  {orden.proveedor.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">RUC:</span>{" "}
                  {orden.proveedor.ruc}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Dirección:</span>{" "}
                  {orden.proveedor.direccion}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="bg-white rounded-lg border overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Precio Unit.
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orden.productos.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.producto.nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.producto.codigo}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {item.cantidad}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {formatearDinero(item.precioUnitario)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {formatearDinero(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="bg-white rounded-lg border p-6">
          <div className="w-full md:w-64 ml-auto">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">
                  {formatearDinero(orden.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IGV (18%):</span>
                <span className="text-gray-900">
                  {formatearDinero(orden.igv)}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    {formatearDinero(orden.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerOrden;
