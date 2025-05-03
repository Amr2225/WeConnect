import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./contexts/AuthProvider";
import { Toaster } from "sonner";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster richColors position='top-right' />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
