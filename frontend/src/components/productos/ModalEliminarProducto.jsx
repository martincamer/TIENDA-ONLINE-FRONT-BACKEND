// frontend/src/components/productos/ModalEliminarProducto.jsx
import { FaExclamationTriangle } from "react-icons/fa";

const ModalEliminarProducto = ({
  producto,
  modalId = "modal_eliminar_producto",
  onConfirm,
}) => {
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-lg rounded-lg p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 p-6 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <FaExclamationTriangle className="text-red-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">
              Confirmar Eliminación
            </h3>
            <p className="text-sm text-red-600 mt-1">
              Esta acción no se puede deshacer
            </p>
          </div>
          <form method="dialog" className="ml-auto">
            <button className="text-gray-400 text-xl hover:text-gray-600 transition-colors">
              ✕
            </button>
          </form>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar el siguiente producto?
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800">{producto?.nombre}</h4>
              <p className="text-sm text-gray-500 mt-1">
                Código: {producto?.codigo}
              </p>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button
                onClick={() =>
                  document.getElementById("modal_eliminar_producto").close()
                }
                type="button"
                className="btn btn-ghost mr-2"
              >
                Cancelar
              </button>
            </form>
            <button onClick={onConfirm} className="btn btn-error text-white">
              Eliminar Producto
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ModalEliminarProducto;
