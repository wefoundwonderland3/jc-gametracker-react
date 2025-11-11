const API_URL = "http://localhost:5000/api"; // luego cambiar a tu dominio al desplegar

export const obtenerJuegos = async () => {
  const res = await fetch(`${API_URL}/juegos`);
  return await res.json();
};

export const crearJuego = async (juego) => {
  const res = await fetch(`${API_URL}/juegos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(juego),
  });
  return await res.json();
};

export const eliminarJuego = async (id) => {
  await fetch(`${API_URL}/juegos/${id}`, { method: "DELETE" });
};
 
