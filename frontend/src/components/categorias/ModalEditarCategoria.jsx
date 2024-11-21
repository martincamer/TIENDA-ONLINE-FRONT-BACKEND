import { useForm } from "react-hook-form";
import { useCategorias } from "../../context/CategoriasContext";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";

const ModalEditarCategoria = ({
  categoria,
  onClose,
  modalId = "modal_editar_categoria",
}) => {
  const { actualizarCategoria, alerta } = useCategorias();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: categoria?.nombre || "",
      descripcion: categoria?.descripcion || "",
      color: categoria?.color || "#3B82F6",
      icono: categoria?.icono || "tag",
    },
  });

  const onSubmit = async (data) => {
    const success = await actualizarCategoria(categoria._id, data);
    if (success) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.close();
        onClose();
      }
    }
  };

  const handleClose = () => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.close();
      onClose();
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-2xl rounded-lg p-0">
        <div className="flex items-center justify-between py-4 border-b px-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Editar Categoría
          </h3>
          <form method="dialog">
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </form>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="form-control">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Categoría
            </label>
            <Input
              {...register("nombre", {
                required: "El nombre es requerido",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
              })}
              placeholder="Ej: Electrónicos"
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <TextArea
              label="Descripción"
              register={register}
              name="descripcion"
              className="h-24"
              placeholder="Describe la categoría..."
              error={errors.descripcion?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex gap-4 items-center">
                <Input
                  type="color"
                  {...register("color")}
                  className="w-14 h-14 p-1 rounded-lg cursor-pointer"
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    {...register("color")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icono
              </label>
              <Input
                {...register("icono")}
                placeholder="Nombre del icono"
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista previa
            </label>
            <div
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ backgroundColor: `${register("color").value}15` }}
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: register("color").value }}
              ></span>
              <span className="text-gray-700">{register("color").value}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <form method="dialog">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </form>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl outline-none flex items-center gap-2"
            >
              Actualizar la categoria
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ModalEditarCategoria;
