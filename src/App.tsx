import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Generator from "./pages/Generator";
import History from "./pages/History";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <div className="pt-20">
            <Routes>
              <Route path="/" element={<Generator />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
