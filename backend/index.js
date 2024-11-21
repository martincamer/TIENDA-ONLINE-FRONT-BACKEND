import { connectDB } from "./config/db.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import ordenCompraRoutes from "./routes/ordenCompraRoutes.js";
import fs from "fs";

// Configuraciones
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorio uploads si no existe
const uploadsDir = path.join(__dirname, "./uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar carpeta pública para imágenes
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Algo salió mal!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "¡API funcionando!" });
});

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/ordenes", ordenCompraRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
