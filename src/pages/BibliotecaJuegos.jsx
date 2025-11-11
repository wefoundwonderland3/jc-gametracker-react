import TarjetaJuego from "../components/TarjetaJuego";
import FormularioJuego from "../components/FormularioJuego";
import { useJuegos } from "../context/JuegosContext";
import "../styles/layout.css";

const BibliotecaJuegos = () => {
  const { juegos } = useJuegos();

  return (
    <div className="biblioteca-container">
      <h1>🎮 Mi Biblioteca de Juegos</h1>
      <FormularioJuego />
      <div className="grid-juegos">
        {juegos.map((juego) => (
          <TarjetaJuego key={juego.id} juego={juego} />
        ))}
      </div>
    </div>
  );
};

export default BibliotecaJuegos;
