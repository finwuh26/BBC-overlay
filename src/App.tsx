import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Overlay from "./pages/Overlay";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/overlay" element={<Overlay />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
