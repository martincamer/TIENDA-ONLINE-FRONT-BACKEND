import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  // Acepta solo imágenes
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("No es una imagen! Por favor sube solo imágenes."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB max
  },
});

export default upload;
