import { useForm } from "react-hook-form";
import { useCategorias } from "../../context/CategoriasContext";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";

const ModalCrearCategoria = ({ modalId = "modal_crear_categoria" }) => {
  const { crearCategoria, alerta } = useCategorias();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      color: "#3B82F6",
      icono: "tag",
    },
  });

  const colorValue = watch("color");
  const nombreValue = watch("nombre");

  const onSubmit = async (data) => {
    const success = await crearCategoria(data);
    if (success) {
      document.getElementById(modalId).close();
      reset();
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-2xl rounded-lg p-0">
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b px-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Crear Nueva Categoría
          </h3>
          <form method="dialog">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              ✕
            </button>
          </form>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Nombre */}
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

          {/* Descripción */}
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

          {/* Color e Icono */}
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
                    value={colorValue}
                    onChange={(e) => register("color").onChange(e)}
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

          {/* Vista previa */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista Previa
            </label>
            <div
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ backgroundColor: `${colorValue}15` }}
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colorValue }}
              ></span>
              <span className="text-gray-700">
                {nombreValue || "Nombre de la categoría"}
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <form method="dialog">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </form>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Categoría
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ModalCrearCategoria;
