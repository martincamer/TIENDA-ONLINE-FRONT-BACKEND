// frontend/src/components/productos/ModalEditarProducto.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProductos } from "../../context/ProductosContext";
import Input from "../ui/Input";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";

const ModalEditarProducto = ({
  productoId,
  onClose,
  modalId = "modal_editar_producto",
}) => {
  const { actualizarProducto, obtenerProducto, alerta, categorias } =
    useProductos();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const cargarProducto = async () => {
      if (productoId) {
        try {
          const producto = await obtenerProducto(productoId);
          if (producto) {
            reset({
              codigo: producto.codigo,
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              precio_compra: producto.precio_compra,
              precio_venta: producto.precio_venta,
              stock_actual: producto.stock_actual,
              stock_minimo: producto.stock_minimo,
              categoria: producto.categoria,
              imagen: producto.imagen,
            });
          }
        } catch (error) {
          console.error("Error al cargar el producto:", error);
        }
      }
    };

    cargarProducto();
  }, [productoId, reset, obtenerProducto]);

  const onSubmit = async (data) => {
    try {
      // Crear un objeto plano en lugar de FormData
      const productoData = {
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio_compra: Number(data.precio_compra),
        precio_venta: Number(data.precio_venta),
        stock_actual: Number(data.stock_actual),
        stock_minimo: Number(data.stock_minimo),
        categoria: data.categoria,
      };

      // Si hay una nueva imagen, entonces usar FormData
      if (data.archivo_imagen?.[0]) {
        const formData = new FormData();

        // Agregar la imagen
        formData.append("imagen", data.archivo_imagen[0]);

        // Agregar el resto de datos
        Object.keys(productoData).forEach((key) => {
          formData.append(key, productoData[key]);
        });

        await actualizarProducto(productoId, formData);
      } else {
        // Si no hay nueva imagen, enviar el objeto plano
        await actualizarProducto(productoId, productoData);
      }

      if (!alerta.error) {
        document.getElementById(modalId).close();
        onClose();
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-3xl rounded-md p-0">
        <div className="flex items-center justify-between py-4 border-b px-4">
          <h3 className="font-bold text-lg">Editar Producto</h3>
          <form method="dialog">
            <button className="text-xl hover:text-blue-500">✕</button>
          </form>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Código</span>
              </label>
              <Input {...register("codigo")} required />
            </div>

            {/* Nombre */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <Input {...register("nombre")} required />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <TextArea
                label="Descripción"
                register={register}
                name="descripcion"
                className="h-16"
                placeholder="Describe el producto..."
                error={errors.descripcion?.message}
              />
            </div>

            {/* Precio Compra */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Precio de Compra</span>
              </label>
              <Input
                {...register("precio_compra")}
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Precio Venta */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Precio de Venta</span>
              </label>
              <Input
                {...register("precio_venta")}
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Stock Actual */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Stock Actual</span>
              </label>
              <Input {...register("stock_actual")} required min="0" />
            </div>

            {/* Stock Mínimo */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Stock Mínimo</span>
              </label>
              <Input {...register("stock_minimo")} required min="0" />
            </div>

            {/* Categoría */}
            <Select
              label="Categoría"
              options={categorias}
              register={register}
              name="categoria"
              required
            />

            {/* Imagen */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Imagen del Producto</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors duration-300">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-600 mb-2">
                    Arrastra una imagen o haz clic para seleccionar
                  </span>
                  <span className="text-sm text-gray-500">
                    PNG, JPG hasta 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("archivo_imagen")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="modal-action">
            <form method="dialog">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl outline-none flex items-center gap-2"
              >
                Cancelar
              </button>
            </form>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl outline-none flex items-center gap-2"
            >
              Actualizar Producto
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ModalEditarProducto;
