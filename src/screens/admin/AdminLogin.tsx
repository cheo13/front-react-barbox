// biome-ignore lint/style/useImportType: <explanation>
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Usuario provisional
  const provisionalUser = {
    username: "Guido",
    password: "barzaruma",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Verifica el usuario provisional
      if (username === provisionalUser.username && password === provisionalUser.password) {
        navigate("/admin/dashboard");
        return;
      }

      // Verifica con la base de datos (simulación de una API call)
      const response = await fetch("/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      // Si la validación es exitosa, redirige al dashboard
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      // Valida que el error es una instancia de Error antes de acceder a sus propiedades
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Logo de la empresa */}
        <div className="flex justify-center mb-6">
          <img src="/assets/barbox.png" alt="Logo de la empresa" className="w-32 h-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Inicio de Sesión</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Usuario
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaUser className="text-gray-500 mr-2" />
              <input
                id="username"
                type="text"
                placeholder="Nombre de usuario"
                className="w-full outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaLock className="text-gray-500 mr-2" />
              <input
                id="password"
                type="password"
                placeholder="Contraseña"
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
