import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TodoForm } from "./components/TodoForm";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodoForm />
  </StrictMode>
);
