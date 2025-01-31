import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";

interface Transaction {
  id: number;
  orderId: number;
  drinkId: number;
  amount: number;
  statusTrans: string;
  createdAt: string;
}

const AdminReports = () => {
  const navigate = useNavigate();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);

  const handleFilter = async () => {
    if (!selectedDate) {
      setError("Selecciona una fecha.");
      return;
    }

    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/transaction/date/${selectedDate}`
      );
      const data = await response.json();
      setFilteredTransactions(data.transaction); // Ajustado a `transaction` según el backend
      setShowTransactions(true);
    } catch (error) {
      console.error("Error al obtener transacciones:", error);
    }
  };

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reporte de Transacciones</h1>

      {/* Filtrar Transacciones */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-gray-600 text-lg font-bold mb-4">Seleccionar Fecha</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-600 mb-2">
              Fecha
            </label>
            <input
              type="date"
              id="selectedDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="bg-gray-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-gray-600"
          onClick={handleFilter}
        >
          Consultar
        </button>
      </div>

      {/* Lista de Transacciones */}
      {showTransactions && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-600 text-lg font-bold mb-4">Transacciones del {selectedDate}</h2>
          {filteredTransactions.length > 0 ? (
            <ul>
              {filteredTransactions.map((t) => (
                <li key={t.id} className="border-b last:border-none py-2 flex justify-between">
                  <span>Orden #{t.orderId}</span>
                  <span>${t.amount.toFixed(2)}</span>
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No se encontraron transacciones.</p>
          )}
        </div>
      )}

      {/* Botones */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="bg-gray-500 text-white rounded-xl p-4 w-full sm:w-auto text-center shadow-md flex items-center justify-center gap-2"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" /> Regresar al Dashboard
        </button>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="bg-red-500 text-white rounded-xl p-4 w-full sm:w-auto text-center shadow-md flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AdminReports;
