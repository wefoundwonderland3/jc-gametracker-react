import Juego from "../models/Juego.js";

export const obtenerJuegos = async (req, res) => {
  const juegos = await Juego.find();
  res.json(juegos);
};

export const crearJuego = async (req, res) => {
  const nuevo = new Juego(req.body);
  await nuevo.save();
  res.json(nuevo);
};

export const eliminarJuego = async (req, res) => {
  await Juego.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Juego eliminado" });
};
 