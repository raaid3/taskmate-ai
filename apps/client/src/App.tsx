import TodosPage from "./pages/TodosPage";
import LoginPage from "./pages/LoginPage";
import { useAuth0 } from "@auth0/auth0-react";
import { useTokenProvider } from "./hooks/useTokenProvider";
import AuthenticationGuard from "./components/AuthenticationGuard";
import { Route, Routes } from "react-router";
import Callback from "./pages/Callback";
import NotFound from "./pages/NotFound";
export default function App() {
  const { isLoading } = useAuth0();
  useTokenProvider();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/todos"
        element={<AuthenticationGuard component={TodosPage} />}
      />
      <Route path="/callback" element={<Callback />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
