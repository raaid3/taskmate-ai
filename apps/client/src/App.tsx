import TodosPage from "./pages/TodosPage";
import LoginPage from "./pages/LoginPage";
import { useAuth0 } from "@auth0/auth0-react";
import { useTokenProvider } from "./hooks/useTokenProvider";
import AuthenticationGuard from "./components/AuthenticationGuard";
import { Route, Routes, useLocation } from "react-router";
import Callback from "./pages/Callback";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

export default function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const location = useLocation();
  useTokenProvider();

  if (isLoading) {
    return <Loader />;
  }

  const showNavbar = isAuthenticated && location.pathname !== "/";

  return (
    <div className="bg-gray-900 min-h-screen">
      {showNavbar && (
        <header className="sticky top-0 z-50 p-4">
          <div className="w-[95%] max-w-4xl mx-auto">
            <Navbar />
          </div>
        </header>
      )}
      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/todos"
            element={<AuthenticationGuard component={TodosPage} />}
          />
          <Route path="/callback" element={<Callback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
