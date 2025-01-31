import { useEffect } from "react";

const useCheckAlexaOrder = ({
  onNavigateToDispensing,
}: {
  onNavigateToDispensing: () => void;
}) => {
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchAlexaOrder = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/order`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos de órdenes");
        }

        const orders = await response.json();

        // Filtrar pedidos originados por Alexa
        const alexaOrder = orders.find(
          (order: { origin: string; statusOrder: string }) =>
            order.origin === "Alexa"
        );

        if (alexaOrder) {
          onNavigateToDispensing();
        }
      } catch (error) {
        console.error("Error en la solicitud GET:", error);
      }
    };

    // Verificar orden de Alexa cada segundo
    intervalId = setInterval(fetchAlexaOrder, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [onNavigateToDispensing]);
};

export default useCheckAlexaOrder;
