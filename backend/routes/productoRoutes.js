import express from "express";
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPublicos,
  actualizarImagenProducto,
  obtenerProductoPublico,
} from "../controllers/productoController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadConfig.js";

const router = express.Router();

// Ruta pública
router.get("/publico", obtenerProductosPublicos);
router.get("/publico/:id", obtenerProductoPublico);

// Rutas protegidas
router
  .route("/")
  .get(protect, obtenerProductos)
  .post(protect, upload.single("imagen"), crearProducto);

router
  .route("/:id")
  .get(protect, obtenerProducto)
  .put(protect, actualizarProducto)
  .delete(protect, eliminarProducto);

// Ruta para actualizar imagen
router.put(
  "/:id/imagen",
  protect,
  upload.single("imagen"),
  actualizarImagenProducto
);

export default router;
