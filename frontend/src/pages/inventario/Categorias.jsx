import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { useCategorias } from "../../context/CategoriasContext";
import ModalCrearCategoria from "../../components/categorias/ModalCrearCategoria";
import ModalEditarCategoria from "../../components/categorias/ModalEditarCategoria";
import ModalConfirmacion from "../../components/categorias/ModalConfirmacion";
import { obtenerId } from "../../helpers/obtenerId";
import {
  MdModeEdit,
  MdEditNote,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { BiEditAlt, BiSolidEditAlt } from "react-icons/bi";
import { RiEditLine, RiEditFill } from "react-icons/ri";
import { LuPencil } from "react-icons/lu";

const Categorias = () => {
  const { categorias, eliminarCategoria } = useCategorias();
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const categoriasFiltradas = categorias.filter(
    (categoria) =>
      categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      categoria.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalCrear = () => {
    document.getElementById("modal_crear_categoria").showModal();
  };

  const abrirModalEditar = (categoria) => {
    setCategoriaEditar(categoria);
    document.getElementById("modal_editar_categoria").showModal();
  };

  const cerrarModalEditar = () => {
    setCategoriaEditar(null);
  };

  const handleEliminar = async () => {
    if (categoriaEliminar) {
      await eliminarCategoria(obtenerId(categoriaEliminar));
      setCategoriaEliminar(null);
      setIsModalOpen(false);
    }
  };

  const confirmarEliminar = (categoria) => {
    setCategoriaEliminar(categoria);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Gestión de Categorías
            </h1>
            <button
              onClick={abrirModalCrear}
              className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 outline-none"
            >
              <FaPlus className="text-sm" />
              Nueva Categoría
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full md:w-96 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Grid de Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriasFiltradas.map((categoria) => (
            <div
              key={obtenerId(categoria)}
              className="bg-white rounded-lg border hover:shadow-md transition-colors duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {categoria.nombre}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: categoria.color }}
                      ></span>
                      <span>{categoria.icono}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirModalEditar(categoria)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border"
                      title="Editar categoría"
                    >
                      <LuPencil size={18} />
                    </button>
                    <button
                      onClick={() => confirmarEliminar(categoria)}
                      className="p-2 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Eliminar categoría"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {categoria.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalCrearCategoria />
      {categoriaEditar && (
        <ModalEditarCategoria
          categoria={categoriaEditar}
          onClose={cerrarModalEditar}
        />
      )}
      <ModalConfirmacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleEliminar}
        mensaje="¿Estás seguro de eliminar esta categoría?"
      />
    </div>
  );
};

export default Categorias;
