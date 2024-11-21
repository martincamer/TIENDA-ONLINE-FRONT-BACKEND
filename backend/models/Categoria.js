import mongoose from "mongoose";

const categoriaSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "#3B82F6", // Color por defecto (azul)
    },
    icono: {
      type: String,
      default: "tag", // Icono por defecto
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para asegurar que el nombre sea único sin importar mayúsculas/minúsculas
categoriaSchema.pre("save", async function (next) {
  if (this.isModified("nombre")) {
    const nombreLowerCase = this.nombre.toLowerCase();
    const categoriaExistente = await this.constructor.findOne({
      nombre: { $regex: new RegExp(`^${nombreLowerCase}$`, "i") },
    });

    if (categoriaExistente && !categoriaExistente._id.equals(this._id)) {
      throw new Error("Ya existe una categoría con este nombre");
    }
  }
  next();
});

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default Categoria;
