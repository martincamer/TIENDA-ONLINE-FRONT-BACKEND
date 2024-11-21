// backend/models/Proveedor.js
import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema(
  {
    ruc: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    direccion: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: Boolean,
      default: true,
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

// Middleware para convertir RUC y email a minúsculas antes de guardar
proveedorSchema.pre("save", function (next) {
  this.ruc = this.ruc.toLowerCase();
  this.email = this.email.toLowerCase();
  next();
});

// Índices para búsqueda eficiente
proveedorSchema.index({ ruc: 1 });
proveedorSchema.index({ email: 1 });
proveedorSchema.index({ nombre: "text" });

const Proveedor = mongoose.model("Proveedor", proveedorSchema);

export default Proveedor;
