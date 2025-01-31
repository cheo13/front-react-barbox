import ScreenLayout from "../components/ScreenLayout";

const WelcomeScreen = ({ onClick }: { onClick: () => void }) => {
  return (
    <ScreenLayout>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div 
        onClick={onClick} 
        className="w-full h-full flex items-center justify-center cursor-pointer"
      >
        <img
          src="/assets/barbox.png"
          alt="Bienvenido"
          className="w-81 h-80 object-cover rounded-lg shadow-lg"
        />
      </div>
    </ScreenLayout>
  );
};

export default WelcomeScreen;
