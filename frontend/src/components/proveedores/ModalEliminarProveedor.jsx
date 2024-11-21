import { FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";

const ModalEliminarProveedor = ({
  proveedor,
  modalId = "modal_eliminar_proveedor",
  onConfirm,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      document.getElementById(modalId).close();
      toast.success("Proveedor eliminado correctamente", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#10B981",
          color: "#fff",
          padding: "16px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#10B981",
        },
      });
    } catch (error) {
      toast.error("Error al eliminar el proveedor", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
          padding: "16px",
        },
      });
    }
  };

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
              ¿Estás seguro de que deseas eliminar el siguiente proveedor?
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    {proveedor?.nombre}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    RUC: {proveedor?.ruc}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Email: {proveedor?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tel: {proveedor?.telefono}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button
                onClick={() => document.getElementById(modalId).close()}
                type="button"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </form>
            <button
              onClick={handleConfirm}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Eliminar Proveedor
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ModalEliminarProveedor;
