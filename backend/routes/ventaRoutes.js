import express from "express";
import {
  crearVenta,
  obtenerVentas,
  obtenerVenta,
  actualizarEstadoVenta,
  obtenerEstadisticas,
  cancelarVenta,
} from "../controllers/ventaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.post("/", crearVenta); // Para crear ventas desde el checkout

// Rutas protegidas (admin)
router.get("/", protect, obtenerVentas);
router.get("/estadisticas", protect, obtenerEstadisticas);
router.get("/:id", protect, obtenerVenta);
router.put("/:id/estado", protect, actualizarEstadoVenta);
router.put("/:id/cancelar", protect, cancelarVenta);

export default router;
