import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BaseURLProvider } from "./contexts/BaseURLProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BaseURLProvider>
      <QueryClientProvider client={queryClient}>
        <App />,
      </QueryClientProvider>
    </BaseURLProvider>
  </StrictMode>
);
