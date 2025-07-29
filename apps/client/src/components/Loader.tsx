import { Bot } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 bg-purple-500 rounded-full animate-ping opacity-30"></div>
        <Bot className="w-16 h-16 text-white animate-pulse" />
      </div>
      <p className="mt-6 text-lg">Loading Taskmate AI...</p>
    </div>
  );
}
