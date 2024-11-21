import mongoose from "mongoose";

const ordenCompraSchema = mongoose.Schema(
  {
    numeroOrden: {
      type: String,
      required: true,
      unique: true,
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now,
    },
    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",
      required: true,
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },
        precioUnitario: {
          type: Number,
          required: true,
          min: 0,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    igv: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      required: true,
      enum: ["pendiente", "aprobada", "recibida", "cancelada"],
      default: "pendiente",
    },
    observaciones: {
      type: String,
      trim: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrdenCompra = mongoose.model("OrdenCompra", ordenCompraSchema);
export default OrdenCompra;
