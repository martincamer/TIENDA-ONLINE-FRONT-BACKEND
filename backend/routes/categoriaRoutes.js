import express from "express";
import {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoriasPublicas,
} from "../controllers/categoriaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta pública
router.get("/publico", obtenerCategoriasPublicas);

// Rutas protegidas
router.route("/").get(protect, obtenerCategorias).post(protect, crearCategoria);

router
  .route("/:id")
  .get(protect, obtenerCategoria)
  .put(protect, actualizarCategoria)
  .delete(protect, eliminarCategoria);

export default router;
