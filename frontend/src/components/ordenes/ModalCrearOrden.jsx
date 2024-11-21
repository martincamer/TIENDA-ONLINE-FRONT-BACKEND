import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useOrdenes } from "../../context/OrdenesProvider";
import { useProveedores } from "../../context/ProveedoresContext";
import { useProductos } from "../../context/ProductosContext";
import { toast } from "react-hot-toast";
import ModalSeleccionarProducto from "./ModalSeleccionarProducto";
import { formatearDinero } from "../../utils/formatearDinero";

const ModalCrearOrden = ({ modalId = "modal_crear_orden" }) => {
  const { crearOrden } = useOrdenes();
  const { proveedores } = useProveedores();
  const { productos } = useProductos();

  const [items, setItems] = useState([]);
  const [totales, setTotales] = useState({
    subtotal: 0,
    igv: 0,
    total: 0,
  });

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0],
    },
  });

  // Calcular totales cuando cambian los items
  useEffect(() => {
    const subtotal = items.reduce((acc, item) => {
      const itemSubtotal = parseFloat(item.subtotal) || 0;
      return acc + itemSubtotal;
    }, 0);

    const igv = subtotal * 0.18;
    setTotales({
      subtotal,
      igv,
      total: subtotal + igv,
    });
  }, [items]);

  const handleAgregarProducto = () => {
    document.getElementById("modal_seleccionar_producto").showModal();
  };

  const handleSeleccionarProducto = (productoSeleccionado) => {
    if (!productoSeleccionado?._id) return;

    const precio = parseFloat(productoSeleccionado.precio) || 0;
    setItems([
      ...items,
      {
        producto: productoSeleccionado._id,
        nombreProducto: productoSeleccionado.nombre || "Sin nombre",
        cantidad: 1,
        precioUnitario: precio,
        subtotal: precio,
      },
    ]);
  };

  const actualizarItem = (index, campo, valor) => {
    const nuevosItems = [...items];
    const item = nuevosItems[index];

    // Convertir valores a números
    const cantidad =
      campo === "cantidad"
        ? parseInt(valor) || 0
        : parseInt(item.cantidad) || 0;
    const precioUnitario =
      campo === "precioUnitario"
        ? parseFloat(valor) || 0
        : parseFloat(item.precioUnitario) || 0;

    // Actualizar el campo específico
    item[campo] = valor;

    // Recalcular subtotal
    item.subtotal = cantidad * precioUnitario;

    setItems(nuevosItems);
  };

  const eliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }

    const orden = {
      proveedor: data.proveedor_id,
      fecha: data.fecha,
      productos: items.map((item) => ({
        producto: item.producto,
        cantidad: parseInt(item.cantidad) || 0,
        precioUnitario: parseFloat(item.precioUnitario) || 0,
        subtotal: parseFloat(item.subtotal) || 0,
      })),
      observaciones: data.observaciones,
      subtotal: totales.subtotal,
      igv: totales.igv,
      total: totales.total,
    };

    console.log(orden);

    const resultado = await crearOrden(orden);
    if (resultado) {
      document.getElementById(modalId).close();
      reset();
      setItems([]);
    }
  };

  // Función auxiliar para formatear números
  const formatearNumero = (numero) => {
    const num = parseFloat(numero);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <>
      <dialog id={modalId} className="modal">
        <div className="modal-box w-11/12 max-w-6xl rounded-lg p-0">
          {/* Header */}
          <div className="flex items-center justify-between py-4 px-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">
              Nueva Orden de Compra
            </h3>
            <form method="dialog">
              <button className="text-gray-400 hover:text-gray-600">✕</button>
            </form>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Proveedor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <select
                  {...register("proveedor_id", { required: true })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 capitalize outline-none"
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option
                      className="font-semibold capitalize"
                      key={proveedor._id}
                      value={proveedor._id}
                    >
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  {...register("fecha", { required: true })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Productos */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-800">Productos</h4>
                <button
                  type="button"
                  onClick={handleAgregarProducto}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Agregar Producto
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {items.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No hay productos agregados. Haga clic en "Agregar Producto"
                    para comenzar.
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Cantidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Precio Unit.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Subtotal
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{item.nombreProducto}</td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="1"
                              value={item.cantidad}
                              onChange={(e) =>
                                actualizarItem(
                                  index,
                                  "cantidad",
                                  e.target.value
                                )
                              }
                              className="w-20 border rounded px-2 py-1 outline-none"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.precioUnitario}
                              onChange={(e) =>
                                actualizarItem(
                                  index,
                                  "precioUnitario",
                                  e.target.value
                                )
                              }
                              className="w-24 border rounded px-2 py-1 outline-none"
                            />
                          </td>
                          <td className="px-6 py-4">
                            {formatearDinero(Number(item.subtotal))}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => eliminarItem(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Subtotal:</span>
                  <span>{formatearDinero(totales.subtotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">IGV (18%):</span>
                  <span>{formatearDinero(totales.igv)}</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatearDinero(totales.total)}</span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <form method="dialog">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
              </form>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Orden
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Modal de selección de producto mejorado */}
      <ModalSeleccionarProducto
        productos={productos}
        onSeleccionar={handleSeleccionarProducto}
        onClose={() => {}}
      />
    </>
  );
};

export default ModalCrearOrden;
