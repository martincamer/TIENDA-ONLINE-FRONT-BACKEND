// frontend/src/components/proveedores/ModalCrearProveedor.jsx
import { useForm } from "react-hook-form";
import { useProveedores } from "../../context/ProveedoresContext";
import Input from "../ui/Input";

const ModalCrearProveedor = ({ modalId = "modal_crear_proveedor" }) => {
  const { crearProveedor, alerta, setAlerta } = useProveedores();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const proveedorData = {
        ...data,
        ruc: data.ruc.trim(),
        telefono: data.telefono.trim(),
        email: data.email.toLowerCase().trim(),
      };

      await crearProveedor(proveedorData);

      document.getElementById(modalId).close();
      reset();

      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } catch (error) {
      console.error("Error al crear proveedor:", error);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-3xl rounded-lg p-0">
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            Crear Nuevo Proveedor
          </h3>
          <form method="dialog">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              ✕
            </button>
          </form>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RUC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUC
              </label>
              <Input
                {...register("ruc", {
                  required: "El RUC es requerido",
                  minLength: {
                    value: 11,
                    message: "El RUC debe tener 11 dígitos",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "El RUC solo debe contener números",
                  },
                })}
                placeholder="Ingrese el RUC"
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.ruc && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ruc.message}
                </p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <Input
                {...register("nombre", { required: "El nombre es requerido" })}
                placeholder="Nombre del proveedor"
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                {...register("email", { required: "El email es requerido" })}
                placeholder="Ingrese el email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <Input
                {...register("telefono", {
                  required: "El teléfono es requerido",
                })}
                placeholder="Ingrese el teléfono"
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <Input
                {...register("direccion", {
                  required: "La dirección es requerida",
                })}
                placeholder="Ingrese la dirección"
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.direccion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.direccion.message}
                </p>
              )}
            </div>
          </div>

          {/* Alerta */}
          {alerta.msg && (
            <div
              className={`alert ${
                alerta.error ? "alert-error" : "alert-success"
              }`}
            >
              <span>{alerta.msg}</span>
            </div>
          )}

          {/* Botones */}
          <div className="modal-action">
            <form method="dialog">
              <button
                type="button"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl outline-none flex items-center gap-2"
              >
                Cancelar
              </button>
            </form>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl outline-none flex items-center gap-2"
            >
              Crear Proveedor
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ModalCrearProveedor;
