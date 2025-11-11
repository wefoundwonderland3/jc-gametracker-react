import { useState } from "react";
import { useJuegos } from "../context/JuegosContext";

const FormularioJuego = () => {
  const { agregarJuego } = useJuegos();
  const [nuevo, setNuevo] = useState({ titulo: "", genero: "", cover: "", descripcion: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevo.titulo) return;
    agregarJuego({ ...nuevo, id: Date.now(), rating: 0 });
    setNuevo({ titulo: "", genero: "", cover: "", descripcion: "" });
  };

  return (
    <form className="form-juego" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={nuevo.titulo}
        onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
      />
      <input
        type="text"
        placeholder="Género"
        value={nuevo.genero}
        onChange={(e) => setNuevo({ ...nuevo, genero: e.target.value })}
      />
      <input
        type="text"
        placeholder="URL de imagen"
        value={nuevo.cover}
        onChange={(e) => setNuevo({ ...nuevo, cover: e.target.value })}
      />
      <textarea
        placeholder="Descripción"
        value={nuevo.descripcion}
        onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
      ></textarea>
      <button type="submit">Agregar juego</button>
    </form>
  );
};

export default FormularioJuego;
 