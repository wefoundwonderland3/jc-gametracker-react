import mongoose from "mongoose";

const JuegoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  genero: String,
  descripcion: String,
  cover: String,
  rating: { type: Number, default: 0 },
});

export default mongoose.model("Juego", JuegoSchema);
 