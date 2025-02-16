const CocktailInfo = ({
  selected,
}: {
  selected: { name: string; ingredients: string } | null;
}) => {
  if (!selected) return null;

  return (
    <div className="mt-4 sm:mt-6 lg:mt-2 w-full flex justify-center z-20">
      <div
        className="bg-gray-600 text-white text-xs sm:text-sm px-4 py-2 rounded-lg shadow-md w-auto text-center transform hover:scale-105 transition-all duration-300 inline-block"
        style={{
          border: "2px solid rgb(58, 63, 89)",
          boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.3)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: "200px",
          maxWidth: "90vw",
        }}
      >
        {/* Título centrado */}
        <p className="font-semibold text-lg text-center border-b-2 border-gray-400 pb-1">
          INGREDIENTES
        </p>
        {/* Ingredientes en una sola línea */}
        <p className="text-base mt-2 font-normal">{selected.ingredients}</p>
      </div>
    </div>
  );
};

export default CocktailInfo;
