import { JuegosProvider } from "./context/JuegosContext";
import BibliotecaJuegos from "./pages/BibliotecaJuegos";
import EstadisticasPersonales from "./components/EstadisticasPersonales";
import "./styles/globals.css";

function App() {
  return (
    <JuegosProvider>
      <div className="app">
        <BibliotecaJuegos />
        <EstadisticasPersonales />
      </div>
    </JuegosProvider>
  );
}

export default App;
 