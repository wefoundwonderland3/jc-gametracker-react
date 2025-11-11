import { useJuegos } from "../context/JuegosContext";

const EstadisticasPersonales = () => {
  const { juegos, reseñas } = useJuegos();
  const promedio = (
    juegos.reduce((acc, j) => acc + (j.rating || 0), 0) / juegos.length || 0
  ).toFixed(1);

  return (
    <div className="estadisticas">
      <h2>📈 Mis estadísticas</h2>
      <p>Total de juegos: {juegos.length}</p>
      <p>Total de reseñas: {reseñas.length}</p>
      <p>Promedio de rating: ⭐ {promedio}</p>
    </div>
  );
};

export default EstadisticasPersonales;
 