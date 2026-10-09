import { Routes, Route } from "react-router";
import "./App.css";

import { Dashboard } from "./pages/Dashboard";
import { Overlay } from "./pages/Overlay";
import { Ajustes } from "./pages/Ajustes";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/overlay" element={<Overlay />} />
          <Route path="/ajustes" element={<Ajustes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
