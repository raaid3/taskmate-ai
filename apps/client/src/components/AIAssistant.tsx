import { Bot } from "lucide-react";

export default function AIAssistant() {
  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
      <p className="text-gray-300 mb-6">
        Ask Taskmate AI to manage your schedule using natural language.
      </p>
      <div className="relative">
        <input
          type="text"
          placeholder='e.g., "Schedule a meeting for tomorrow at 2pm"'
          className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full">
          <Bot className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
