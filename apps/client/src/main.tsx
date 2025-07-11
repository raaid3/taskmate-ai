import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Test } from "@repo/ui/test";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Test prop1="hi" prop2={3} />
  </StrictMode>
);
