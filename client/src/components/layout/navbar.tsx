import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { IdCard, Bell, User, Home, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Navbar() {
  const { user } = useAuth();

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  const getRoleName = (role: string) => {
    switch (role) {
      case "superadmin":
        return "Superadministrador";
      case "certificador":
        return "Certificador";
      case "vecino":
        return "Vecino/Almacén";
      case "usuario_final":
        return "Usuario Final";
      case "socios":
        return "Socio/Partner";
      case "rrhh":
        return "Recursos Humanos";
      default:
        return "Usuario";
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-chile-red rounded-lg flex items-center justify-center">
                <IdCard className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-trust-gray">NotaryPro</h1>
                <p className="text-xs text-gray-500">+ VecinoXpress</p>
              </div>
            </Link>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* User Role Badge */}
            {user?.role && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {getRoleName(user.role)}
              </Badge>
            )}

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-chile-red text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/">
                    <Home size={16} className="mr-1" />
                    <span className="hidden sm:inline">Inicio</span>
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <LogOut size={16} className="mr-1" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
