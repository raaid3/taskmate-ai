import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TodosPage from "./pages/TodosPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/trpc";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TodosPage />
    </QueryClientProvider>
  </StrictMode>
);
