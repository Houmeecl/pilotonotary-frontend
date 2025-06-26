import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  Crown, 
  Stamp, 
  Store, 
  User, 
  Handshake, 
  UserCog, 
  Home,
  FileText,
  BarChart3,
  Settings,
  Bell,
  DollarSign
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "superadmin":
        return Crown;
      case "certificador":
        return Stamp;
      case "vecino":
        return Store;
      case "usuario_final":
        return User;
      case "socios":
        return Handshake;
      case "rrhh":
        return UserCog;
      default:
        return User;
    }
  };

  const getRoleNavigation = (role: string) => {
    const baseItems = [
      { href: "/", icon: Home, label: "Inicio" },
    ];

    switch (role) {
      case "superadmin":
        return [
          ...baseItems,
          { href: "/dashboard/superadmin", icon: Crown, label: "Dashboard Admin" },
          { href: "/dashboard/superadmin#analytics", icon: BarChart3, label: "Analíticas" },
          { href: "/dashboard/superadmin#users", icon: UserCog, label: "Usuarios" },
          { href: "/dashboard/superadmin#finance", icon: DollarSign, label: "Finanzas" },
          { href: "/dashboard/superadmin#settings", icon: Settings, label: "Configuración" },
        ];
      
      case "certificador":
        return [
          ...baseItems,
          { href: "/dashboard/certificador", icon: Stamp, label: "Panel Certificador" },
          { href: "/dashboard/certificador#pending", icon: FileText, label: "Documentos Pendientes" },
          { href: "/dashboard/certificador#history", icon: BarChart3, label: "Historial" },
        ];
      
      case "vecino":
        return [
          ...baseItems,
          { href: "/dashboard/vecino", icon: Store, label: "Panel Vecino" },
          { href: "/pos", icon: Store, label: "Terminal POS" },
          { href: "/dashboard/vecino#locations", icon: Settings, label: "Mis Puntos" },
          { href: "/dashboard/vecino#commissions", icon: DollarSign, label: "Comisiones" },
        ];
      
      case "usuario_final":
        return [
          ...baseItems,
          { href: "/dashboard/usuario", icon: User, label: "Mis Documentos" },
          { href: "/pos", icon: FileText, label: "Crear Documento" },
        ];
      
      case "socios":
        return [
          ...baseItems,
          { href: "/dashboard/socios", icon: Handshake, label: "Panel Socios" },
          { href: "/dashboard/socios#partnerships", icon: Handshake, label: "Alianzas" },
          { href: "/dashboard/socios#projects", icon: BarChart3, label: "Proyectos" },
        ];
      
      case "rrhh":
        return [
          ...baseItems,
          { href: "/dashboard/rrhh", icon: UserCog, label: "Panel RRHH" },
          { href: "/dashboard/rrhh#employees", icon: UserCog, label: "Personal" },
          { href: "/dashboard/rrhh#training", icon: Settings, label: "Capacitación" },
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getRoleNavigation(user?.role || "usuario_final");
  const RoleIcon = getRoleIcon(user?.role || "usuario_final");

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        {/* User Role Header */}
        <div className="px-3 py-2">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-chile-red rounded-lg flex items-center justify-center">
              <RoleIcon className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-600">
                {user?.role === "superadmin" ? "Superadmin" :
                 user?.role === "certificador" ? "Certificador" :
                 user?.role === "vecino" ? "Vecino" :
                 user?.role === "usuario_final" ? "Usuario" :
                 user?.role === "socios" ? "Socio" :
                 user?.role === "rrhh" ? "RRHH" : "Usuario"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || 
                (item.href !== "/" && location.startsWith(item.href));
              
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-chile-red text-white hover:bg-red-700"
                  )}
                >
                  <Link href={item.href}>
                    <Icon size={16} className="mr-2" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-3 py-2">
          <h3 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Acciones Rápidas
          </h3>
          <div className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/notifications">
                <Bell size={16} className="mr-2" />
                Notificaciones
              </Link>
            </Button>
            
            {(user?.role === "vecino" || user?.role === "usuario_final") && (
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/pos">
                  <FileText size={16} className="mr-2" />
                  Crear Documento
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
