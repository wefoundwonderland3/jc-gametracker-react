import { useState } from "react";
import { useJuegos } from "../context/JuegosContext";

const FormularioReseña = ({ idJuego }) => {
  const { agregarReseña } = useJuegos();
  const [autor, setAutor] = useState("");
  const [texto, setTexto] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto) return;
    agregarReseña({ id: Date.now(), idJuego, autor: autor || "Anónimo", texto });
    setTexto("");
    setAutor("");
  };

  return (
    <form className="form-reseña" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tu nombre"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
      />
      <textarea
        placeholder="Escribe una reseña..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      ></textarea>
      <button type="submit">Publicar</button>
    </form>
  );
};

export default FormularioReseña;
 