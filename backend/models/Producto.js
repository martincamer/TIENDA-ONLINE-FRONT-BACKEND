import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precio_compra: {
      type: Number,
      required: true,
    },
    precio_venta: {
      type: Number,
      required: true,
    },
    stock_actual: {
      type: Number,
      default: 0,
    },
    stock_minimo: {
      type: Number,
      default: 0,
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
    },
    imagen: {
      type: String,
      default: null,
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

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
