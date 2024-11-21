import mongoose from "mongoose";

const ventaSchema = mongoose.Schema(
  {
    usuario: {
      nombre: String,
      email: String,
      telefono: String,
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
        },
        nombre: String,
        precio_venta: Number,
        cantidad: Number,
        subtotal: Number,
        categoria: String,
      },
    ],
    envio: {
      direccion: String,
      ciudad: String,
      provincia: String,
      codigoPostal: String,
    },
    pago: {
      metodo: {
        type: String,
        enum: ["tarjeta", "efectivo", "transferencia"],
        default: "tarjeta",
      },
      estado: {
        type: String,
        enum: ["pendiente", "completado", "fallido"],
        default: "pendiente",
      },
    },
    estado: {
      type: String,
      enum: ["pendiente", "procesando", "enviado", "entregado", "cancelado"],
      default: "pendiente",
    },
    subtotal: Number,
    total: Number,
    numeroOrden: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generar número de orden único antes de guardar
ventaSchema.pre("save", async function (next) {
  if (!this.numeroOrden) {
    const count = await mongoose.models.Venta.countDocuments();
    this.numeroOrden = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

const Venta = mongoose.model("Venta", ventaSchema);
export default Venta;
