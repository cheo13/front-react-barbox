import { useState } from "react";

const ServeButton = ({
  onSelectCocktail,
  selected,
}: {
  onSelectCocktail: (
    image: { id: number; name: string; image: string } | null
  ) => void;
  selected: { id: number; name: string; image: string } | null;
}) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleServe = async () => {
    if (!selected || isDisabled) return;

    setIsDisabled(true); // Deshabilitar el botón

    const payload = { drinkId: selected.id };

    console.log("drinkId:", JSON.stringify(payload));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del backend:", data);
        onSelectCocktail(null); // Reinicia la selección.
      } else {
        console.error("Error al enviar el pedido:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
    }

    setTimeout(() => setIsDisabled(false), 3000); // Habilitar después de 3 segundos
  };

  return (
    <div className="mt-4 sm:mt-6 lg:mt-8 flex justify-center mb-2 sm:mb-4 lg:mb-6">
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={handleServe}
        disabled={!selected || isDisabled}
        className="bg-gray-400 text-black text-lg py-4 px-10 rounded-full disabled:opacity-50 hover:bg-gray-300"
      >
        SERVIR
      </button>
    </div>
  );
};

export default ServeButton;
