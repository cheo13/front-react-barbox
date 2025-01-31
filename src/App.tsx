import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WelcomeScreen from "./screens/WelcomeScreen";
import CarouselScreen from "./screens/CarouselScreen";
import DispensingScreen from "./screens/DispensingScreen";
import AdminLogin from "./screens/admin/AdminLogin";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminReports from "./screens/admin/AdminReports";
import useCheckAlexaOrder from "./hooks/useCheckAlexaOrder";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas del cliente */}
        <Route path="/" element={<Navigate to="/barbox" />} />
        <Route path="/barbox" element={<ClientApp />} />
        {/* Rutas del administrador */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
};

// Pantallas del Cliente
const ClientApp = () => {
  const [screen, setScreen] = useState<"Welcome" | "Carousel" | "Dispensing">("Welcome");

  useCheckAlexaOrder({
    onNavigateToDispensing: () => setScreen("Dispensing"),
  });

  const handleServe = () => {
    setScreen("Dispensing");
  };

  const handleFinishDispensing = () => {
    setScreen("Welcome");
  };

  return (
    <>
      {screen === "Welcome" && <WelcomeScreen onClick={() => setScreen("Carousel")} />}
      {screen === "Carousel" && <CarouselScreen onSelectCocktail={handleServe} />}
      {screen === "Dispensing" && <DispensingScreen onFinish={handleFinishDispensing} />}
    </>
  );
};

// Pantallas del Administrador
const AdminApp = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} /> {/* Página de login por defecto */}
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="*" element={<Navigate to="/admin" />} /> {/* Redirección si no existe */}
    </Routes>
  );
};

export default App;
