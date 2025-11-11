import { useJuegos } from "../context/JuegosContext";
import FormularioReseña from "./FormularioReseña";

const ListaReseñas = ({ idJuego }) => {
  const { reseñasPorJuego } = useJuegos();
  const reseñas = reseñasPorJuego(idJuego);

  return (
    <div className="reseñas">
      <h4>Reseñas</h4>
      {reseñas.length === 0 ? (
        <p>No hay reseñas todavía.</p>
      ) : (
        reseñas.map((r) => (
          <div key={r.id} className="reseña-item">
            <strong>{r.autor}</strong>: {r.texto}
          </div>
        ))
      )}
      <FormularioReseña idJuego={idJuego} />
    </div>
  );
};

export default ListaReseñas;
 