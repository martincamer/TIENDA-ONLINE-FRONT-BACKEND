// backend/routes/proveedorRoutes.js
import express from "express";
import {
  obtenerProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
} from "../controllers/proveedorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, obtenerProveedores)
  .post(protect, crearProveedor);

router
  .route("/:id")
  .get(protect, obtenerProveedor)
  .put(protect, actualizarProveedor)
  .delete(protect, eliminarProveedor);

export default router;
