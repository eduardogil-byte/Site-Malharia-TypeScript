import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./app/router";
import { AuthProvider } from "./features/auth/contexts/AuthContext";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("O elemento root não foi encontrado.");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
