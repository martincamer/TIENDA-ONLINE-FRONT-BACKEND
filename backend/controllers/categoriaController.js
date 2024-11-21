import Categoria from "../models/Categoria.js";

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error al obtener las categorías" });
  }
};

// Obtener una categoría
const obtenerCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    if (categoria.creador.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Acción no válida" });
    }

    res.json(categoria);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Crear categoría
const crearCategoria = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Usuario no autorizado" });
    }

    const nuevaCategoria = new Categoria({
      ...req.body,
      creador: req.user._id,
    });

    const categoriaGuardada = await nuevaCategoria.save();
    res.json(categoriaGuardada);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Actualizar categoría
const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  try {
    let categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    if (categoria.creador.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Acción no válida" });
    }

    // Verificar si el nuevo nombre ya existe en otra categoría
    if (nombre && nombre !== categoria.nombre) {
      const categoriaExistente = await Categoria.findOne({
        nombre: { $regex: new RegExp(`^${nombre}$`, "i") },
        creador: req.user._id,
        _id: { $ne: id },
      });

      if (categoriaExistente) {
        return res
          .status(400)
          .json({ msg: "Ya existe una categoría con ese nombre" });
      }
    }

    categoria = await Categoria.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.json(categoria);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Eliminar categoría (soft delete)
const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    // Verificar que el usuario autenticado es el creador de la categoría
    if (categoria.creador.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Acción no válida" });
    }

    // Soft delete: cambiar el estado a false
    categoria.estado = false;
    await categoria.save();

    res.json({ msg: "Categoría eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Si necesitas una función específica para obtener categorías activas
const obtenerCategoriasActivas = async (req, res) => {
  try {
    const categorias = await Categoria.find({
      estado: true,
    })
      .select("nombre descripcion estado color icono creador")
      .sort({ nombre: 1 });

    res.json(categorias);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Hubo un error al obtener las categorías activas" });
  }
};

const obtenerCategoriasPublicas = async (req, res) => {
  try {
    const categorias = await Categoria.find({ estado: true })
      .select("nombre descripcion color icono")
      .sort({ nombre: 1 });

    res.json(categorias);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error al obtener las categorías" });
  }
};

export {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoriasActivas,
  obtenerCategoriasPublicas,
};
