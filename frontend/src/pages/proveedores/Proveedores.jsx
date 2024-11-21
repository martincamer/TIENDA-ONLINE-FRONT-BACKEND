// frontend/src/pages/inventario/Proveedores.jsx
import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useProveedores } from "../../context/ProveedoresContext";
import ModalCrearProveedor from "../../components/proveedores/ModalCrearProveedor";
import ModalEditarProveedor from "../../components/proveedores/ModalEditarProveedor";
import ModalEliminarProveedor from "../../components/proveedores/ModalEliminarProveedor";

const Proveedores = () => {
  const { proveedores, eliminarProveedor } = useProveedores();
  const [busqueda, setBusqueda] = useState("");
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [proveedorEditarId, setProveedorEditarId] = useState(null);
  const [proveedorEliminar, setProveedorEliminar] = useState(null);
  const [pagina, setPagina] = useState(1);
  const proveedoresPorPagina = 10;

  useEffect(() => {
    filtrarProveedores();
  }, [busqueda, proveedores]);

  const filtrarProveedores = () => {
    let resultado = [...(proveedores || [])];
    if (busqueda) {
      resultado = resultado.filter(
        (proveedor) =>
          proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          proveedor.ruc.toLowerCase().includes(busqueda.toLowerCase()) ||
          proveedor.email.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    setProveedoresFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
  };

  const abrirModal = () => {
    document.getElementById("modal_crear_proveedor").showModal();
  };

  const handleEditar = (id) => {
    setProveedorEditarId(id);
    const modal = document.getElementById("modal_editar_proveedor");
    if (modal) {
      modal.showModal();
    }
  };

  const handleEliminar = (id) => {
    const proveedor = proveedores.find((p) => p._id === id);
    setProveedorEliminar(proveedor);
    document.getElementById("modal_eliminar_proveedor").showModal();
  };

  const confirmarEliminar = async () => {
    if (proveedorEliminar) {
      await eliminarProveedor(proveedorEliminar._id);
      document.getElementById("modal_eliminar_proveedor").close();
      setProveedorEliminar(null);
    }
  };

  // Calcular proveedores para la página actual
  const indexOfLastProveedor = pagina * proveedoresPorPagina;
  const indexOfFirstProveedor = indexOfLastProveedor - proveedoresPorPagina;
  const proveedoresActuales = proveedoresFiltrados.slice(
    indexOfFirstProveedor,
    indexOfLastProveedor
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Gestión de Proveedores
            </h1>
            <button
              onClick={abrirModal}
              className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 outline-none"
            >
              <FaPlus className="text-sm" />
              Nuevo Proveedor
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, RUC o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full md:w-96 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RUC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proveedoresActuales.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No se encontraron proveedores
                    </td>
                  </tr>
                ) : (
                  proveedoresActuales.map((proveedor) => (
                    <tr key={proveedor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {proveedor.ruc}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {proveedor.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proveedor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proveedor.telefono}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {proveedor.direccion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditar(proveedor._id)}
                            className="px-3 py-1.5 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200"
                            title="Editar proveedor"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(proveedor._id)}
                            className="px-3 py-1.5 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200"
                            title="Eliminar proveedor"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">{indexOfFirstProveedor + 1}</span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastProveedor, proveedoresFiltrados.length)}
                </span>{" "}
                de{" "}
                <span className="font-medium">
                  {proveedoresFiltrados.length}
                </span>{" "}
                resultados
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagina(Math.max(1, pagina - 1))}
                  disabled={pagina === 1}
                  className={`px-4 py-2 border text-sm font-medium rounded-lg
                    ${
                      pagina === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Anterior
                </button>
                <button
                  onClick={() =>
                    setPagina(
                      Math.min(
                        Math.ceil(
                          proveedoresFiltrados.length / proveedoresPorPagina
                        ),
                        pagina + 1
                      )
                    )
                  }
                  disabled={indexOfLastProveedor >= proveedoresFiltrados.length}
                  className={`px-4 py-2 border text-sm font-medium rounded-lg
                    ${
                      indexOfLastProveedor >= proveedoresFiltrados.length
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalCrearProveedor />
      {proveedorEditarId && (
        <ModalEditarProveedor
          proveedor={proveedores.find((p) => p._id === proveedorEditarId)}
          onClose={() => setProveedorEditarId(null)}
        />
      )}
      {proveedorEliminar && (
        <ModalEliminarProveedor
          proveedor={proveedorEliminar}
          onConfirm={confirmarEliminar}
        />
      )}
    </div>
  );
};

export default Proveedores;
