// biome-ignore lint/style/useImportType: <explanation>
import React from "react";

const ScreenLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className="w-[1280px] h-[800px] flex items-center justify-center bg-black overflow-hidden"
      style={{ transform: "rotate(0deg)", transformOrigin: "center" }}
    >
      {children}
    </div>
  );
};

export default ScreenLayout;
