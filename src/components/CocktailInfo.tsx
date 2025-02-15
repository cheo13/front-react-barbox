const CocktailInfo = ({
  selected,
}: {
  selected: { name: string; ingredients: string } | null;
}) => {
  if (!selected) return null;

  return (
    <div className="mt-6 sm:mt-8 lg:mt-4 w-full flex justify-center z-20">
      <div
        className="bg-gray-600 text-white text-xs sm:text-sm px-4 py-2 rounded-lg shadow-md max-w-sm text-center transform hover:scale-105 transition-all duration-300"
        style={{
          border: "2px solid rgb(58, 63, 89)",
          boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <p className="font-semibold text-lg mt-1">{"Ingredientes:"}</p>
        <p className="text-base mt-2 font-normal">{selected.ingredients}</p>
      </div>
    </div>
  );
};

export default CocktailInfo;
