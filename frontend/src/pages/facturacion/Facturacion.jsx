import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import { useFacturas } from "../../context/FacturacionProvider";
import { formatearDinero } from "../../utils/formatearDinero";
import { Link } from "react-router-dom";

const Facturacion = () => {
  const { facturas, obtenerFacturas, actualizarEstadoFactura } = useFacturas();
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const facturasPorPagina = 10;

  console.log(facturas);

  // Obtener facturas al montar el componente
  useEffect(() => {
    obtenerFacturas();
  }, []);

  // Filtrar facturas
  useEffect(() => {
    let resultado = [...facturas];

    // Filtro de búsqueda
    if (busqueda) {
      resultado = resultado.filter(
        (factura) =>
          factura.numeroOrden.toLowerCase().includes(busqueda.toLowerCase()) ||
          factura.usuario?.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro de estado
    if (estadoFiltro) {
      resultado = resultado.filter(
        (factura) => factura.estado === estadoFiltro
      );
    }

    // Filtro de fecha
    if (fechaFiltro) {
      resultado = resultado.filter(
        (factura) => factura.createdAt.split("T")[0] === fechaFiltro
      );
    }

    setFacturasFiltradas(resultado);
  }, [busqueda, estadoFiltro, fechaFiltro, facturas]);

  // Calcular paginación
  const indexOfLastFactura = pagina * facturasPorPagina;
  const indexOfFirstFactura = indexOfLastFactura - facturasPorPagina;
  const facturasActuales = facturasFiltradas.slice(
    indexOfFirstFactura,
    indexOfLastFactura
  );

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Obtener clase CSS según estado
  const getEstadoClase = (estado) => {
    const clases = {
      pendiente: "bg-yellow-100 text-yellow-800",
      pagada: "bg-green-100 text-green-800",
      anulada: "bg-red-100 text-red-800",
    };
    return clases[estado] || "bg-gray-100 text-gray-800";
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoFactura(id, nuevoEstado);
      // La lista se actualizará automáticamente por el estado en el contexto
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Facturación
            </h1>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por número, cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
              <option value="anulada">Anulada</option>
            </select>

            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Nº Orden
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Método de Pago
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facturasActuales.map((factura) => (
                  <tr key={factura._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {factura.numeroOrden}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatearFecha(factura.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {factura.usuario?.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {factura.usuario?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {factura.pago?.metodo}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {factura.pago?.estado}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatearDinero(factura.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClase(
                          factura.estado
                        )}`}
                      >
                        {factura.estado.charAt(0).toUpperCase() +
                          factura.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/facturas/${factura._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver
                        </Link>
                        {factura.estado === "pendiente" && (
                          <>
                            <button
                              onClick={() =>
                                handleEstadoChange(factura._id, "completado")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Completar
                            </button>
                            <button
                              onClick={() =>
                                handleEstadoChange(factura._id, "cancelado")
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">{indexOfFirstFactura + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastFactura, facturasFiltradas.length)}
                </span>{" "}
                de{" "}
                <span className="font-medium">{facturasFiltradas.length}</span>{" "}
                resultados
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagina(Math.max(1, pagina - 1))}
                  disabled={pagina === 1}
                  className="px-4 py-2 border text-sm font-medium rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPagina(pagina + 1)}
                  disabled={indexOfLastFactura >= facturasFiltradas.length}
                  className="px-4 py-2 border text-sm font-medium rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facturacion;
