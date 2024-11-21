import Venta from "../models/Venta.js";
import Producto from "../models/Producto.js";

// Crear nueva venta
const crearVenta = async (req, res) => {
  try {
    const { usuario, productos, envio, pago, subtotal, total } = req.body;

    // Verificar stock y actualizar productos
    for (const item of productos) {
      const producto = await Producto.findById(item.producto);

      if (!producto) {
        return res.status(404).json({
          msg: `Producto ${item.producto} no encontrado`,
        });
      }

      if (producto.stock_actual < item.cantidad) {
        return res.status(400).json({
          msg: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock_actual}`,
        });
      }

      // Actualizar stock
      producto.stock_actual -= item.cantidad;
      await producto.save();
    }

    // Crear la venta
    const venta = new Venta({
      usuario,
      productos: productos.map((item) => ({
        producto: item.producto,
        cantidad: item.cantidad,
        categoria: item.categoria,
        precio_venta: item.precio_venta,
        subtotal: item.cantidad * item.precio_venta,
      })),
      envio,
      pago,
      subtotal,
      total,
    });

    await venta.save();

    // Retornar datos necesarios para la confirmación
    res.json({
      numeroOrden: venta.numeroOrden,
      total: venta.total,
      estado: venta.estado,
      createdAt: venta.createdAt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al procesar la venta" });
  }
};

// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ createdAt: -1 });
    res.json(ventas);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener las ventas" });
  }
};

// Obtener una venta específica
const obtenerVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const venta = await Venta.findById(id).populate(
      "productos.producto",
      "nombre imagen"
    );

    if (!venta) {
      return res.status(404).json({ msg: "Venta no encontrada" });
    }

    res.json(venta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener la venta" });
  }
};

// Actualizar estado de la venta
const actualizarEstadoVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar que el estado sea válido
    const estadosValidos = ["pendiente", "completado", "cancelado"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        msg: "Estado no válido. Los estados permitidos son: pendiente, completado, cancelado",
      });
    }

    // Buscar y actualizar en un solo paso
    const venta = await Venta.findByIdAndUpdate(
      id,
      { estado },
      { new: true } // Retorna el documento actualizado
    )
      .populate("usuario", "nombre email telefono")
      .populate("productos.producto");

    if (!venta) {
      return res.status(404).json({ msg: "Venta no encontrada" });
    }

    // Log para depuración
    console.log("Venta actualizada:", venta);

    res.json(venta);
  } catch (error) {
    console.error("Error al actualizar estado de venta:", error);
    res.status(500).json({
      msg: "Error al actualizar el estado de la venta",
      error: error.message,
    });
  }
};

// Obtener estadísticas de ventas
const obtenerEstadisticas = async (req, res) => {
  try {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    // Ventas totales
    const ventasTotales = await Venta.countDocuments();

    // Ventas del mes
    const ventasMes = await Venta.find({
      createdAt: {
        $gte: inicioMes,
        $lte: finMes,
      },
    });

    // Ingresos totales del mes
    const ingresosMes = ventasMes.reduce(
      (total, venta) => total + venta.total,
      0
    );

    // Productos más vendidos
    const productosMasVendidos = await Venta.aggregate([
      { $unwind: "$productos" },
      {
        $group: {
          _id: "$productos.producto",
          totalVendidos: { $sum: "$productos.cantidad" },
          ingresos: { $sum: "$productos.subtotal" },
        },
      },
      { $sort: { totalVendidos: -1 } },
      { $limit: 5 },
    ]);

    // Poblar información de productos
    await Producto.populate(productosMasVendidos, {
      path: "_id",
      select: "nombre imagen",
    });

    res.json({
      ventasTotales,
      ventasMes: ventasMes.length,
      ingresosMes,
      productosMasVendidos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener estadísticas" });
  }
};

// Cancelar venta
const cancelarVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const venta = await Venta.findById(id);

    if (!venta) {
      return res.status(404).json({ msg: "Venta no encontrada" });
    }

    if (venta.estado === "cancelado") {
      return res.status(400).json({ msg: "Esta venta ya está cancelada" });
    }

    // Restaurar stock de productos
    for (const item of venta.productos) {
      const producto = await Producto.findById(item.producto);
      if (producto) {
        producto.stock_actual += item.cantidad;
        await producto.save();
      }
    }

    venta.estado = "cancelado";
    await venta.save();

    res.json({ msg: "Venta cancelada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al cancelar la venta" });
  }
};

export {
  crearVenta,
  obtenerVentas,
  obtenerVenta,
  actualizarEstadoVenta,
  obtenerEstadisticas,
  cancelarVenta,
};
