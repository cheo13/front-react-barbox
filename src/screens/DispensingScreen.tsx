import { useState, useEffect } from "react";
import ScreenLayout from "../components/ScreenLayout";
import LoadingIndicator from "../components/LoadingIndicator";

const DispensingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [isDispensing, setIsDispensing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDispensing(false);
      onFinish();
    }, 5000); // Dispensar por 5 segundos

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <ScreenLayout>
      <div className="text-center">
        {isDispensing ? (
          <>
            <p className="text-2xl font-bold mb-4 text-white">Dispensando tu bebida</p>
            <LoadingIndicator />
            <p className="text-lg text-gray-400">Por favor espera, cancela el valor en caja</p>
          </>
        ) : (
          <p className="text-2xl font-bold mb-4 text-green-400">¡Listo! Bebida servida.</p>
        )}
      </div>
    </ScreenLayout>
  );
};

export default DispensingScreen;
