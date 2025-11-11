import { useJuegos } from "../context/JuegosContext";
import ListaReseñas from "./ListaReseñas";

const TarjetaJuego = ({ juego }) => {
  const { eliminarJuego } = useJuegos();

  return (
    <div className="tarjeta-juego">
      <img src={juego.cover} alt={juego.titulo} />
      <div className="info">
        <h2>{juego.titulo}</h2>
        <p>{juego.genero} | ⭐ {juego.rating}</p>
        <p>{juego.descripcion}</p>
        <button onClick={() => eliminarJuego(juego.id)}>Eliminar</button>
      </div>
      <ListaReseñas idJuego={juego.id} />
    </div>
  );
};

export default TarjetaJuego;
 