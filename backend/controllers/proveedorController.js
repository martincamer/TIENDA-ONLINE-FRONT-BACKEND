// backend/controllers/proveedorController.js
import Proveedor from "../models/Proveedor.js";

const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find({
      creador: req.user._id,
      estado: true,
    }).select("-creador -estado -createdAt -updatedAt -__v");
    res.json(proveedores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error al obtener los proveedores" });
  }
};

const obtenerProveedor = async (req, res) => {
  try {
    // Verificar autenticación
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const proveedor = await Proveedor.findById(id);

    if (!proveedor) {
      return res.status(404).json({ msg: "Proveedor no encontrado" });
    }

    res.json(proveedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el proveedor" });
  }
};

const crearProveedor = async (req, res) => {
  try {
    const { ruc, nombre, email, telefono, direccion } = req.body;

    // Verificar si ya existe un proveedor con el mismo RUC
    const existeProveedor = await Proveedor.findOne({ ruc });
    if (existeProveedor) {
      return res
        .status(400)
        .json({ msg: "Ya existe un proveedor con ese RUC" });
    }

    const proveedor = new Proveedor({
      ruc,
      nombre,
      email,
      telefono,
      direccion,
      creador: req.user._id,
    });

    await proveedor.save();
    res.json(proveedor);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hubo un error al crear el proveedor",
      error: error.message,
    });
  }
};

const actualizarProveedor = async (req, res) => {
  try {
    // Verificar autenticación
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const proveedor = await Proveedor.findById(id);

    if (!proveedor) {
      return res.status(404).json({ msg: "Proveedor no encontrado" });
    }

    // Actualizar usando findByIdAndUpdate con { new: true }
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    res.json(proveedorActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el proveedor" });
  }
};

const eliminarProveedor = async (req, res) => {
  const { id } = req.params;

  try {
    const proveedor = await Proveedor.findOne({
      _id: id,
    });

    if (!proveedor) {
      return res.status(404).json({ msg: "Proveedor no encontrado" });
    }

    // Eliminación lógica
    proveedor.estado = false;
    await proveedor.save();

    res.json({ msg: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error al eliminar el proveedor" });
  }
};

export {
  obtenerProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
};
