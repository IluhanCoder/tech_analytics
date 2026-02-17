import React from "react";

const UnifiedLoadingScreen = ({ label = "Завантаження..." }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[180px] w-full animate-pulse">
    <span className="text-xl text-gray-400 font-medium tracking-wide">{label}</span>
  </div>
);

export default UnifiedLoadingScreen;
