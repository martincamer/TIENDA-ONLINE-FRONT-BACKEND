import express from "express";
import {
  obtenerOrdenes,
  obtenerOrden,
  crearOrden,
  actualizarEstadoOrden,
  eliminarOrden,
} from "../controllers/ordenCompraController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas están protegidas
router.route("/").get(protect, obtenerOrdenes).post(protect, crearOrden);

router
  .route("/:id")
  .get(protect, obtenerOrden)
  .put(protect, actualizarEstadoOrden)
  .delete(protect, eliminarOrden);

export default router;
