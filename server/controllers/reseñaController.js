import Reseña from "../models/reseña.js";

export const obtenerReseñas = async (req, res) => {
  const reseñas = await Reseña.find({ idJuego: req.params.idJuego });
  res.json(reseñas);
};

export const crearReseña = async (req, res) => {
  const nueva = new Reseña(req.body);
  await nueva.save();
  res.json(nueva);
};
 