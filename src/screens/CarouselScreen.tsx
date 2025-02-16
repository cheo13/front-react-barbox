import { useState, useEffect } from "react";
import Carousel from "../components/Carousel";
import CocktailInfo from "../components/CocktailInfo";
import Logo from "../components/Logo";
import ServeButton from "../components/ServeButton";

export const images = [
  {
    id: 1,
    name: "Cuba Libre",
    ingredients: "Ron 2,5 oz - Cola 2 oz - Jugo de limón 2 oz",
    image: "/assets/cubalibre.webp",
  },
  {
    id: 2,
    name: "Skill Driver",
    ingredients: "Vodka 3,5 oz - Jugo de naranja 3,5 oz - Granadina 0,5 oz",
    image: "/assets/screwdriver.webp",
  },
  {
    id: 3,
    name: "Mojito",
    ingredients: "Ron2,5 oz - Soda 2,5 oz - Jugo de limón 2,5 oz",
    image: "/assets/mojito.webp",
  },
  {
    id: 4,
    name: "Caipirinha",
    ingredients: "Aguardiente 2,5 oz - Soda 2,5 oz - Jugo de limón 2,5 oz",
    image: "/assets/caipirinha.webp",
  },
  {
    id: 5,
    name: "Caipiroska",
    ingredients: "Vodka 2,5 oz - Soda 2,5 oz - Jugo de limón 2,5 oz",
    image: "/assets/caipiroska.webp",
  },
  {
    id: 6,
    name: "Tequila Molta",
    ingredients: "Tequila 3,5 oz - Jugo de Naranja 3,5 oz - Granadina 0,5 oz",
    image: "/assets/tequilamolta.jpeg",
  },
  {
    id: 7,
    name: "Tequila Sunrise",
    ingredients: "Tequila 3,5 oz - Jugo de Limón 3,5 oz - Granadina 0,5 oz",
    image: "/assets/tequilasunrise.webp",
  },
];

const CarouselScreen = ({
  onSelectCocktail,
}: {
  onSelectCocktail: (
    image: { id: number; name: string; image: string } | null
  ) => void;
}) => {
  const [selected, setSelected] = useState<(typeof images)[0] | null>(null);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000); // Mostrar el mensaje por 3 segundos

    return () => clearTimeout(timer); // Limpiar el temporizador
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-between bg-black">
      <div className="flex flex-col items-center w-full">
        <Logo />
      </div>
      <div
        className="flex flex-col items-center w-full flex-grow"
        style={{ maxHeight: "40vh" }}
      >
        <Carousel
          selected={selected}
          setSelected={setSelected}
          images={images}
        />
      </div>
      <div className="flex flex-col items-center w-full mb-6">
        <CocktailInfo selected={selected} />
      </div>
      <div className="flex flex-col items-center w-full mt-0 mb-9">
        <ServeButton onSelectCocktail={onSelectCocktail} selected={selected} />
      </div>

      {showMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="text-center text-white">
            <p className="text-3xl md:text-5xl font-bold mb-4">
              Por favor, coloca el vaso en el lugar indicado
            </p>
            <p className="text-lg md:text-2xl">Cargando el Dispensador.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselScreen;
