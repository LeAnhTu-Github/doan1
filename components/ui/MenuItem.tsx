"use client";
interface MenuItemProps {
  onCLick: () => void;
  label: string;
}
import React from "react";

const MenuItem: React.FC<MenuItemProps> = ({ onCLick, label }) => {
  return (
    <div
      onClick={onCLick}
      className="px-4 py-3 hover:bg-neutral-100 transition font-semibold w-full z-50"
    >
      {label}
    </div>
  );
};

export default MenuItem;
