const Logo = () => (
  <header className="w-full bg-black flex items-center justify-center py-4 sm:py-6 lg:py-8">
    <img
      src="/assets/barbox.png"
      alt="Logo"
      className="max-w-full h-16 sm:h-20 lg:h-24"
      style={{
        objectFit: "contain",
      }}
    />
  </header>
);

export default Logo;