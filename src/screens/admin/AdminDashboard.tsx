import { useState, useEffect } from "react";
import { images } from "../CarouselScreen";
import { format } from "date-fns";
import { Calendar, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: number;
  orderId: number;
  drinkId: number;
  amount: string;
  statusTrans: string;
  createdAt: string;
  createdAtFormatted: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const fetchTransactions = async (date?: string) => {
    try {
      const url = date
        ? `${import.meta.env.VITE_API_BASE_URL}/transaction/date/${date}`
        : `${import.meta.env.VITE_API_BASE_URL}/transaction`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      if (response.ok && Array.isArray(data.transactions || data)) {
        const transactionsData = data.transactions || data;
        setTransactions(transactionsData);
        setTotalAmount(data.totalAmount || 0);
      } else {
        setTransactions([]);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setTotalAmount(0);
    }
  };

  const completeTransaction = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/transaction/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statusTrans: "Completado" }),
        }
      );

      if (response.ok) {
        fetchTransactions(selectedDate);
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(() => fetchTransactions(selectedDate), 5000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleFilter = () => {
    if (!selectedDate) {
      setError("Selecciona una fecha.");
      return;
    }

    setError("");
    const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
    fetchTransactions(formattedDate);
  };

  const handleReset = () => {
    setSelectedDate("");
    fetchTransactions();
  };

  const getCocktailName = (drinkId: number) => {
    const drink = images.find((img) => img.id === drinkId);
    return drink ? drink.name : "Desconocido";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    return format(date, "hh:mm:ss a");
  };

  const pendingTransactions = transactions.filter(
    (t) => t.statusTrans === "Pendiente"
  );
  const completedTransactions = transactions.filter(
    (t) => t.statusTrans === "Completado"
  );
  return (
    <div className="flex-1 p-4 bg-gray-50 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-10 w-full">
      <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-6 text-center">
        Transacciones
      </h1>
      <div
        className="flex flex-col lg:flex-row w-full max-w-6xl"
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pendientes</h2>
          <table className="min-w-full bg-white mb-8 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Hora Orden</th>
                <th className="py-2 px-4 border-b">Cóctel</th>
                <th className="py-2 px-4 border-b">Monto</th>
                <th className="py-2 px-4 border-b">Estado</th>
                <th className="py-2 px-4 border-b">Fecha</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingTransactions.length > 0 ? (
                pendingTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-2 px-4 border-b">{t.id}</td>
                    <td className="py-2 px-4 border-b">
                      {formatTime(t.createdAtFormatted)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {getCocktailName(t.drinkId)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      ${parseFloat(t.amount).toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">{t.statusTrans}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                        onClick={() => completeTransaction(t.id)}
                      >
                        Completar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-2 px-4 border-b text-center text-gray-500"
                  >
                    No hay transacciones pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="lg:ml-8 lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-gray-600 text-lg font-bold mb-4">
              Seleccionar Fecha
            </h2>
            <label
              htmlFor="selectedDate"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Fecha
            </label>
            <div className="flex items-center">
              <input
                type="date"
                id="selectedDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <Calendar className="ml-2 text-gray-600" />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              className="mt-4 bg-gray-500 text-white rounded-md px-4 py-2 w-full shadow-md hover:bg-gray-600"
              onClick={handleFilter}
            >
              Consultar
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Completadas</h2>
      <table className="min-w-full bg-white mb-8 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Hora Orden</th>
            <th className="py-2 px-4 border-b">Cóctel</th>
            <th className="py-2 px-4 border-b">Monto</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {completedTransactions.length > 0 ? (
            completedTransactions.map((t) => (
              <tr
                key={t.id}
                className="text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <td className="py-2 px-4 border-b">{t.id}</td>
                <td className="py-2 px-4 border-b">
                  {formatTime(t.createdAtFormatted)}
                </td>
                <td className="py-2 px-4 border-b">
                  {getCocktailName(t.drinkId)}
                </td>
                <td className="py-2 px-4 border-b">
                  ${parseFloat(t.amount).toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b">{t.statusTrans}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="py-2 px-4 border-b text-center text-gray-500"
              >
                No hay transacciones completadas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="text-xl font-bold mb-4 text-gray-800">
        Total del día: ${totalAmount.toFixed(2)}
      </div>

      {/* Botones */}
      <div className="mt-0 flex flex-col sm:flex-row gap-4">
        <button
          className="bg-gray-500 text-white rounded-xl p-4 w-full sm:w-auto text-center shadow-md flex items-center justify-center gap-2"
          onClick={handleReset}
        >
          <ArrowLeft className="w-5 h-5" /> Ver Todo
        </button>
        <button
          className="bg-red-500 text-white rounded-xl p-4 w-full sm:w-auto text-center shadow-md flex items-center justify-center gap-2"
          onClick={() => navigate("/admin")}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
