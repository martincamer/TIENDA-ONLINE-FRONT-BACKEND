import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import { useOrdenes } from "../../context/OrdenesProvider";
import ModalCrearOrden from "../../components/ordenes/ModalCrearOrden";
import { Link } from "react-router-dom";

const OrdenesCompra = () => {
  const { ordenes, obtenerOrdenes, actualizarEstadoOrden } = useOrdenes();
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const ordenesPorPagina = 10;

  // Obtener órdenes al montar el componente
  useEffect(() => {
    obtenerOrdenes();
  }, []);

  // Filtrar órdenes
  useEffect(() => {
    let resultado = [...ordenes];

    // Filtro de búsqueda
    if (busqueda) {
      resultado = resultado.filter(
        (orden) =>
          orden.numeroOrden.toLowerCase().includes(busqueda.toLowerCase()) ||
          orden.proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro de estado
    if (estadoFiltro) {
      resultado = resultado.filter((orden) => orden.estado === estadoFiltro);
    }

    // Filtro de fecha
    if (fechaFiltro) {
      resultado = resultado.filter(
        (orden) => orden.fecha.split("T")[0] === fechaFiltro
      );
    }

    setOrdenesFiltradas(resultado);
  }, [busqueda, estadoFiltro, fechaFiltro, ordenes]);

  // Calcular paginación
  const indexOfLastOrden = pagina * ordenesPorPagina;
  const indexOfFirstOrden = indexOfLastOrden - ordenesPorPagina;
  const ordenesActuales = ordenesFiltradas.slice(
    indexOfFirstOrden,
    indexOfLastOrden
  );

  // Manejar cambio de estado
  const handleEstadoChange = async (id, nuevoEstado) => {
    await actualizarEstadoOrden(id, nuevoEstado);
  };

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
      aprobada: "bg-blue-100 text-blue-800",
      recibida: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800",
    };
    return clases[estado] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Órdenes de Compra
            </h1>
            <button
              onClick={() =>
                document.getElementById("modal_crear_orden").showModal()
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Nueva Orden
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por número, proveedor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobada">Aprobada</option>
              <option value="recibida">Recibida</option>
              <option value="cancelada">Cancelada</option>
            </select>

            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                    Proveedor
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
                {ordenesActuales.map((orden) => (
                  <tr key={orden._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {orden.numeroOrden}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatearFecha(orden.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {orden.proveedor.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        RUC: {orden.proveedor.ruc}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${orden.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClase(
                          orden.estado
                        )}`}
                      >
                        {orden.estado.charAt(0).toUpperCase() +
                          orden.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/ordenes/${orden._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver
                        </Link>
                        {orden.estado === "pendiente" && (
                          <>
                            <button
                              onClick={() =>
                                handleEstadoChange(orden._id, "aprobada")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() =>
                                handleEstadoChange(orden._id, "cancelada")
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {orden.estado === "aprobada" && (
                          <button
                            onClick={() =>
                              handleEstadoChange(orden._id, "recibida")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Recibir
                          </button>
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
                <span className="font-medium">{indexOfFirstOrden + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastOrden, ordenesFiltradas.length)}
                </span>{" "}
                de{" "}
                <span className="font-medium">{ordenesFiltradas.length}</span>{" "}
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
                  disabled={indexOfLastOrden >= ordenesFiltradas.length}
                  className="px-4 py-2 border text-sm font-medium rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalCrearOrden />
    </div>
  );
};

export default OrdenesCompra;
