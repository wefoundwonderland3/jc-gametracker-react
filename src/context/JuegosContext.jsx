import { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import mockGames from "../data/mockGames";

const JuegosContext = createContext();

export const useJuegos = () => useContext(JuegosContext);

export const JuegosProvider = ({ children }) => {
  const [juegos, setJuegos] = useLocalStorage("juegos", mockGames);
  const [reseñas, setReseñas] = useLocalStorage("reseñas", []);

  const agregarJuego = (nuevoJuego) => setJuegos([...juegos, nuevoJuego]);
  const eliminarJuego = (id) => setJuegos(juegos.filter((j) => j.id !== id));
  const editarJuego = (juegoEditado) =>
    setJuegos(juegos.map((j) => (j.id === juegoEditado.id ? juegoEditado : j)));

  const agregarReseña = (nueva) => setReseñas([...reseñas, nueva]);
  const reseñasPorJuego = (idJuego) =>
    reseñas.filter((r) => r.idJuego === idJuego);

  return (
    <JuegosContext.Provider
      value={{
        juegos,
        reseñas,
        agregarJuego,
        eliminarJuego,
        editarJuego,
        agregarReseña,
        reseñasPorJuego,
      }}
    >
      {children}
    </JuegosContext.Provider>
  );
};
 