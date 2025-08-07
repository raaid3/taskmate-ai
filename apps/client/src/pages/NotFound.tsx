import { Home } from "lucide-react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-transparent">
      <div className="w-full max-w-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-12 shadow-lg flex flex-col items-center">
        <h1 className="text-7xl font-extrabold mb-4">404</h1>
        <p className="text-2xl mb-8">
          Whoops! Looks like you've wandered off the map.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white text-purple-600 font-bold px-6 py-3 rounded-full transition hover:bg-gray-200"
        >
          <Home className="w-6 h-6" />
          Go Home
        </button>
      </div>
    </div>
  );
}
