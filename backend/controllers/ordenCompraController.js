import OrdenCompra from "../models/OrdenCompra.js";
import Producto from "../models/Producto.js";
import Proveedor from "../models/Proveedor.js";

// Obtener todas las órdenes
const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await OrdenCompra.find()
      .populate("proveedor", "nombre ruc")
      .populate("productos.producto", "nombre codigo")
      .sort({ createdAt: -1 });

    res.json(ordenes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener las órdenes" });
  }
};

// Obtener una orden específica
const obtenerOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await OrdenCompra.findById(id)
      .populate("proveedor", "nombre ruc email telefono direccion")
      .populate("productos.producto", "nombre codigo precio stock");

    if (!orden) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    res.json(orden);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener la orden" });
  }
};

// Crear nueva orden
const crearOrden = async (req, res) => {
  try {
    const { proveedor, fecha, productos, subtotal, igv, total } = req.body;

    // Verificar que el proveedor existe
    const proveedorExiste = await Proveedor.findById(proveedor);
    if (!proveedorExiste) {
      return res.status(404).json({ msg: "El proveedor no existe" });
    }

    // Generar número de orden
    const ultimaOrden = await OrdenCompra.findOne().sort({ numeroOrden: -1 });
    const numeroOrden = ultimaOrden ? ultimaOrden.numeroOrden + 1 : 1;

    // Crear la orden
    const orden = new OrdenCompra({
      numeroOrden,
      proveedor,
      fecha,
      productos: productos.map((item) => ({
        producto: item.producto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal,
      })),
      subtotal,
      igv,
      total,
      usuario: req.user._id,
    });

    await orden.save();

    // Actualizar stock de productos
    for (const item of productos) {
      await Producto.findByIdAndUpdate(item.producto, {
        $inc: { stock_actual: item.cantidad },
      });
    }

    res.json(orden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al crear la orden" });
  }
};

// Actualizar estado de la orden
const actualizarEstadoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const orden = await OrdenCompra.findById(id);

    if (!orden) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    // Validar estado
    if (!["pendiente", "aprobada", "recibida", "cancelada"].includes(estado)) {
      return res.status(400).json({ msg: "Estado no válido" });
    }

    // Si la orden se marca como recibida, actualizar stock
    if (estado === "recibida" && orden.estado !== "recibida") {
      for (const item of orden.productos) {
        const producto = await Producto.findById(item.producto);
        if (producto) {
          producto.stock += item.cantidad;
          await producto.save();
        }
      }
    }

    orden.estado = estado;
    await orden.save();

    res.json(orden);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al actualizar el estado de la orden" });
  }
};

// Eliminar orden (solo si está pendiente)
const eliminarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await OrdenCompra.findById(id);

    if (!orden) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    if (orden.estado !== "pendiente") {
      return res.status(400).json({
        msg: "Solo se pueden eliminar órdenes pendientes",
      });
    }

    await orden.remove();
    res.json({ msg: "Orden eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar la orden" });
  }
};

export {
  obtenerOrdenes,
  obtenerOrden,
  crearOrden,
  actualizarEstadoOrden,
  eliminarOrden,
};
