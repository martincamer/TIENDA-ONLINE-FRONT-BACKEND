// frontend/src/components/ui/ModalConfirmacion.jsx
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ModalConfirmacion = ({ isOpen, onClose, onConfirm, mensaje }) => {
  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-lg rounded-lg p-0 overflow-hidden">
        {/* Header con icono de advertencia */}
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
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">{mensaje}</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="btn btn-ghost">
              Cancelar
            </button>
            <button onClick={onConfirm} className="btn btn-error text-white">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
