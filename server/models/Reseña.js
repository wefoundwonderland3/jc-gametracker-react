import mongoose from "mongoose";

const ReseñaSchema = new mongoose.Schema({
  idJuego: { type: mongoose.Schema.Types.ObjectId, ref: "Juego", required: true },
  autor: { type: String, default: "Anónimo" },
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Reseña", ReseñaSchema);
 