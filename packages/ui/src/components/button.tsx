import type { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="px-6 py-2 rounded-full text-white font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-[0_0_20px_#8A2BE2] transition-shadow duration-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
