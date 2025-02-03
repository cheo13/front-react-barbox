import { useEffect, useRef } from "react";

const useCheckAlexaOrder = ({
  onNavigateToDispensing,
}: {
  onNavigateToDispensing: () => void;
}) => {
  const isPaused = useRef(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchAlexaOrder = async () => {
      if (isPaused.current) return; // No hacer la petición si está pausado

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/order`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos de órdenes");
        }

        const orders = await response.json();

        const alexaOrder = orders.find(
          (order: { origin: string; statusOrder: string }) =>
            order.origin === "Alexa"
        );

        if (alexaOrder) {
          onNavigateToDispensing();
          isPaused.current = true;

          // Parar las peticiones por 20 segundos
          if (intervalId) clearInterval(intervalId);
          setTimeout(() => {
            isPaused.current = false;
            intervalId = setInterval(fetchAlexaOrder, 1000);
          }, 20000);
        }
      } catch (error) {
        console.error("Error en la solicitud GET:", error);
      }
    };

    intervalId = setInterval(fetchAlexaOrder, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [onNavigateToDispensing]);

  return null;
};

export default useCheckAlexaOrder;
