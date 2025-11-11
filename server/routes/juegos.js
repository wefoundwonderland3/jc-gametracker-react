import express from "express";
import { obtenerJuegos, crearJuego, eliminarJuego } from "../controllers/juegoController.js";

const router = express.Router();

router.get("/", obtenerJuegos);
router.post("/", crearJuego);
router.delete("/:id", eliminarJuego);

export default router;
 