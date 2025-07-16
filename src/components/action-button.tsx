import React from "react";
import type { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  text: string | React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon: Icon,
  text,
  variant = "primary",
  disabled = false,
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
    >
      <Icon className="w-4 h-4" />
      {text}
    </button>
  );
};
