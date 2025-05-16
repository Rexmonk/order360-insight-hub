import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import msalInstance from "./services/authService";
import { queryClient } from "./hooks/useApi";

import Index from "./pages/Index";
import OrderOverview from "./pages/OrderOverview";
import OrderDetails from "./pages/OrderDetails";
import BpmnDiagram from "./pages/BpmnDiagram";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useLocalStorage } from "./hooks/use-localstorage";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useLocalStorage("token", "");
  return (
    <>
      {/* /Bypass MSAL login for local copy JWT token from dev or uat  also remove this and token check in apiclient.ts file after development is complate*/}

      {token ? (
        children
      ) : (
        <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
      )}

      {!token ? (
        <UnauthenticatedTemplate>
          <Navigate to="/login" replace />
        </UnauthenticatedTemplate>
      ) : (
        ""
      )}
    </>
  );
};

const App = () => (
  <MsalProvider instance={msalInstance}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-overview"
              element={
                <ProtectedRoute>
                  <OrderOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-details/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bpmn-diagram/:id"
              element={
                <ProtectedRoute>
                  <BpmnDiagram />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </MsalProvider>
);

export default App;
