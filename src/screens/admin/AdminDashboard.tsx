import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Clipboard, LogOut, CheckCircle } from "lucide-react";

interface Transaction {
  id: number;
  amount: number;
  createdAt: string;
}

interface Order {
  id: number;
  statusOrder: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orderInProcess, setOrderInProcess] = useState<Order | null>(null);

  const today = new Date().toISOString().split("T")[0]; // Fecha actual YYYY-MM-DD

  // Obtener transacciones del día
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transaction/date/${today}`);
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error al obtener las transacciones:", error);
    }
  };

  // Verificar si hay órdenes en proceso
  const checkOrderInProcess = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/in-process`);
      const data = await response.json();
      setOrderInProcess(data.order || null);
    } catch (error) {
      console.error("Error al verificar órdenes en proceso:", error);
    }
  };

  const completeOrder = async () => {
    if (!orderInProcess) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/${orderInProcess.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusOrder: "Completado" }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la orden");
      }

      const updatedOrder = await response.json();
      if (updatedOrder.statusOrder === "Completado") {
        setOrderInProcess(null);
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error al completar la orden:", error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchTransactions();
    checkOrderInProcess();
    const interval = setInterval(checkOrderInProcess, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalAmount = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalOrders = transactions.length;

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-12 text-center">Reporte del día</h1>

      {/* Resumen General */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
          <DollarSign className="text-blue-500 w-10 h-10" />
          <div className="ml-4">
            <h2 className="text-gray-600 text-sm font-medium">Total Generado</h2>
            <p className="text-lg font-bold">${totalAmount.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
          <Clipboard className="text-green-500 w-10 h-10" />
          <div className="ml-4">
            <h2 className="text-gray-600 text-sm font-medium">Total de Órdenes</h2>
            <p className="text-lg font-bold">{totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Orden en proceso */}
      {orderInProcess && (
        <div className="mt-8 bg-yellow-100 rounded-xl shadow-md p-6 text-center">
          <h2 className="text-lg font-bold text-yellow-800 mb-2">Orden en Proceso</h2>
          <p className="text-yellow-700">Orden #{orderInProcess.id}</p>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={completeOrder}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow-md hover:bg-green-600"
          >
            <CheckCircle className="w-5 h-5" />
            Marcar como Completado
          </button>
        </div>
      )}

      {/* Transacciones del día */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6 w-full max-w-2xl">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Transacciones del Día</h2>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((t) => (
              <li key={t.id} className="border-b last:border-none py-2 flex justify-between">
                <span>Orden #{t.id}</span>
                <span>${t.amount.toFixed(2)}</span>
                <span>{new Date(t.createdAt).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No hay transacciones registradas hoy.</p>
        )}
      </div>

      {/* Botones */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="bg-gray-500 text-white rounded-xl p-4 w-full sm:w-auto text-center shadow-md"
          onClick={() => navigate("/admin/reports")}
        >
          Transacciones por fecha
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

export default AdminDashboard;
