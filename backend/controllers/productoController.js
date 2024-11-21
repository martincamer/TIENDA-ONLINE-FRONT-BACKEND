import Producto from "../models/Producto.js";

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find({
      estado: true,
    }).sort({ nombre: 1 });

    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error al obtener los productos" });
  }
};

const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

const crearProducto = async (req, res) => {
  try {
    const productoData = {
      ...req.body,
      creador: req.user._id,
    };

    if (req.file) {
      productoData.imagen = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    }

    const producto = new Producto(productoData);
    await producto.save();

    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true, // Retorna el documento actualizado
        runValidators: true, // Ejecuta las validaciones del esquema
      }
    );

    if (!productoActualizado) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.json(productoActualizado);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({
      msg: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

// const actualizarProducto = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const producto = await Producto.findById(id);

//     if (!producto) {
//       return res.status(404).json({ msg: "Producto no encontrado" });
//     }

//     producto.codigo = req.body.codigo || producto.codigo;
//     producto.nombre = req.body.nombre || producto.nombre;
//     producto.descripcion = req.body.descripcion || producto.descripcion;
//     producto.precio_compra = req.body.precio_compra || producto.precio_compra;
//     producto.precio_venta = req.body.precio_venta || producto.precio_venta;
//     producto.stock_actual = req.body.stock_actual || producto.stock_actual;
//     producto.stock_minimo = req.body.stock_minimo || producto.stock_minimo;
//     producto.categoria = req.body.categoria || producto.categoria;
//     producto.imagen = req.body.imagen || producto.imagen;

//     const productoActualizado = await producto.save();
//     res.json(productoActualizado);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Hubo un error");
//   }
// };

const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    // Eliminación suave
    producto.estado = false;
    await producto.save();

    res.json({ msg: "Producto eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

const obtenerProductosPublicos = async (req, res) => {
  try {
    const productos = await Producto.find({ estado: true });

    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error al obtener los productos" });
  }
};

const actualizarImagenProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ msg: "No se subió ninguna imagen" });
    }

    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    producto.imagen = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    await producto.save();

    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al actualizar la imagen");
  }
};

const obtenerProductoPublico = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findOne({ _id: id, estado: true })
      .populate("categoria", "nombre")
      .lean();

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.log("Error detallado:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "ID de producto no válido" });
    }
    res.status(500).json({ msg: "Error al obtener el producto" });
  }
};

export {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPublicos,
  actualizarImagenProducto,
  obtenerProductoPublico,
};
