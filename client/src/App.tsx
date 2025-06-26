import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import SuperAdminDashboard from "@/pages/dashboard/superadmin";
import CertificadorDashboard from "@/pages/dashboard/certificador";
import VecinoDashboard from "@/pages/dashboard/vecino";
import UsuarioDashboard from "@/pages/dashboard/usuario";
import SociosDashboard from "@/pages/dashboard/socios";
import RRHHDashboard from "@/pages/dashboard/rrhh";
import PosTerminal from "@/pages/pos-terminal";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/admin" component={AdminLogin} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard/superadmin" component={SuperAdminDashboard} />
          <Route path="/dashboard/certificador" component={CertificadorDashboard} />
          <Route path="/dashboard/vecino" component={VecinoDashboard} />
          <Route path="/dashboard/usuario" component={UsuarioDashboard} />
          <Route path="/dashboard/socios" component={SociosDashboard} />
          <Route path="/dashboard/rrhh" component={RRHHDashboard} />
          <Route path="/pos" component={PosTerminal} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
