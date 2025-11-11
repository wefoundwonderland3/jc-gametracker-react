import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import juegosRoutes from "./routes/juegos.js";
import reseñasRoutes from "./routes/reseñas.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => res.send("API GameTracker funcionando 🚀"));
app.use("/api/juegos", juegosRoutes);
app.use("/api/reseñas", reseñasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
 