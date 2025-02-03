import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, DollarSign, Clipboard, LogOut } from "lucide-react";

interface Transaction {
  id: number;
  statusTrans: string;
  amount: number;
  drink: { name: string };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingTransaction, setPendingTransaction] =
    useState<Transaction | null>(null);
  const [totalGenerated, setTotalGenerated] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [mostSoldDrink, setMostSoldDrink] = useState("Calculando...");

  const fetchTransactions = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/transaction/date/${today}`
      );
      const data = await response.json();

      if (response.ok) {
        const completedTransactions = data.transactions.filter(
          (t: Transaction) => t.statusTrans === "Completado"
        );
        setTransactions(completedTransactions);

        const pending =
          data.transactions.find(
            (t: Transaction) => t.statusTrans === "Pendiente"
          ) || null;
        setPendingTransaction(pending);

        // Calcular resumen diario
        setTotalGenerated(
          data.transactions.reduce(
            (acc: number, t: Transaction) =>
              acc + Number.parseFloat(String(t.amount)),
            0
          )
        );
        setTotalOrders(data.transactions.length);

        const drinkCount: Record<string, number> = {};
        // biome-ignore lint/complexity/noForEach: <explanation>
        data.transactions.forEach((t: Transaction) => {
          // biome-ignore lint/complexity/useOptionalChain: <explanation>
          if (t.drink && t.drink.name) {
            drinkCount[t.drink.name] = (drinkCount[t.drink.name] || 0) + 1;
          }
        });

        const mostSold = Object.keys(drinkCount).reduce(
          (a, b) => (drinkCount[a] > drinkCount[b] ? a : b),
          "Calculando..."
        );
        setMostSoldDrink(mostSold);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
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
        setPendingTransaction(null);
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-12 text-center">
        Reporte del día
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
          <DollarSign className="text-blue-500 w-10 h-10" />
          <div className="ml-4">
            <h2 className="text-gray-600 text-sm font-medium">
              Total Generado
            </h2>
            <p className="text-lg font-bold">${totalGenerated.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
          <Clipboard className="text-green-500 w-10 h-10" />
          <div className="ml-4">
            <h2 className="text-gray-600 text-sm font-medium">
              Total de Órdenes
            </h2>
            <p className="text-lg font-bold">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
          <BarChart2 className="text-yellow-500 w-10 h-10" />
          <div className="ml-4">
            <h2 className="text-gray-600 text-sm font-medium">
              Bebida Más Vendida
            </h2>
            <p className="text-lg font-bold">{mostSoldDrink}</p>
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="bg-gray-500 text-white rounded-xl p-4 shadow-md"
          onClick={() => navigate("/admin/reports")}
        >
          Transacciones por fecha
        </button>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="bg-red-500 text-white rounded-xl p-4 shadow-md flex items-center gap-2"
          onClick={() => navigate("/admin")}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">
          Transacciones Completadas
        </h2>
        {transactions.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded-md shadow mb-2">
            <p>
              <strong>Bebida:</strong> {t.drink?.name ?? "Desconocida"}
            </p>
            <p>
              <strong>Monto:</strong> ${t.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      {pendingTransaction && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Transacción Pendiente
            </h2>
            <p>
              <strong>Bebida:</strong>{" "}
              {pendingTransaction.drink?.name ?? "Desconocida"}
            </p>
            <p>
              <strong>Monto:</strong> ${pendingTransaction.amount.toFixed(2)}
            </p>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md"
              onClick={() => completeTransaction(pendingTransaction.id)}
            >
              Completar Transacción
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
