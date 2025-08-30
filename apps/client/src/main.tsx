import "./utils/logger";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Auth0WithProvider from "./components/Auth0WithProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/trpc";
import { BrowserRouter } from "react-router";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0WithProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Auth0WithProvider>
    </BrowserRouter>
  </StrictMode>
);
