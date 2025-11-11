import express from "express";
import { obtenerReseñas, crearReseña } from "../controllers/reseñaController.js";

const router = express.Router();

router.get("/:idJuego", obtenerReseñas);
router.post("/", crearReseña);

export default router;

 