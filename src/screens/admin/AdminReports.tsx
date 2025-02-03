import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";

interface Transaction {
  id: number;
  drink: { name: string };
  amount: number;
  statusTrans: string;
  createdAt: string;
}

const AdminReports = () => {
  const navigate = useNavigate();
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleFilter = async () => {
    if (!selectedDate) {
      setError("Selecciona una fecha.");
      return;
    }

    setError("");
    try {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/transaction/date/${formattedDate}`
      );
      const data = await response.json();
      setFilteredTransactions(data.transactions || []);
      setShowTransactions(true);

      // Sumar amount
      const total = data.transactions.reduce(
        (acc: number, t: Transaction) => acc + t.amount,
        0
      );
      setTotalAmount(total);
    } catch (error) {
      console.error("Error al obtener transacciones:", error);
      setError("Hubo un problema al obtener los datos.");
    }
  };

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Reporte de Transacciones
      </h1>

      {/* Selección de Fecha */}
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
        <h2 className="text-gray-600 text-lg font-bold mb-4">
          Seleccionar Fecha
        </h2>
        <label
          htmlFor="selectedDate"
          className="block text-sm font-medium text-gray-600 mb-2"
        >
          Fecha
        </label>
        <input
          type="date"
          id="selectedDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="mt-4 bg-gray-500 text-white rounded-md px-4 py-2 w-full shadow-md hover:bg-gray-600"
          onClick={handleFilter}
        >
          Consultar
        </button>
      </div>

      {/* Suma total */}
      {showTransactions && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 w-full max-w-md">
          <h2 className="text-gray-600 text-lg font-bold mb-4">
            Transacciones del {selectedDate}
          </h2>
          <div className="mb-4">
            <p>
              <strong>Total Generado:</strong> ${totalAmount.toFixed(2)}
            </p>
          </div>
          {filteredTransactions.length > 0 ? (
            <ul>
              {filteredTransactions.map((t) => (
                <li
                  key={t.id}
                  className="border-b last:border-none py-2 flex justify-between"
                >
                  <span>
                    <strong>Bebida:</strong> {t.drink?.name ?? "Desconocida"}
                  </span>
                  <span>
                    <strong>Monto:</strong> ${t.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No se encontraron transacciones.</p>
          )}
        </div>
      )}

      {/* Botones */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
