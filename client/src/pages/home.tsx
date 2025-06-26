import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Stamp, Store, User, Handshake, UserCog, BarChart3, FileText, DollarSign, Bell } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const { data: documents } = useQuery({
    queryKey: ["/api/documents"],
  });

  const { data: commissions } = useQuery({
    queryKey: ["/api/commissions"],
  });

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case "superadmin":
        return "/dashboard/superadmin";
      case "certificador":
        return "/dashboard/certificador";
      case "vecino":
        return "/dashboard/vecino";
      case "usuario_final":
        return "/dashboard/usuario";
      case "socios":
        return "/dashboard/socios";
      case "rrhh":
        return "/dashboard/rrhh";
      default:
        return "/dashboard/usuario";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Crown className="text-chile-red" size={32} />;
      case "certificador":
        return <Stamp className="text-chile-blue" size={32} />;
      case "vecino":
        return <Store className="text-green-600" size={32} />;
      case "usuario_final":
        return <User className="text-purple-600" size={32} />;
      case "socios":
        return <Handshake className="text-orange-600" size={32} />;
      case "rrhh":
        return <UserCog className="text-teal-600" size={32} />;
      default:
        return <User className="text-gray-600" size={32} />;
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-chile-red rounded-lg flex items-center justify-center">
                {getRoleIcon(user?.role || "")}
              </div>
              <div>
                <h1 className="text-xl font-bold">NotaryPro</h1>
                <p className="text-sm text-gray-500">
                  Bienvenido, {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell size={20} />
                {notifications && notifications.filter((n: any) => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-chile-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter((n: any) => !n.isRead).length}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/api/logout"}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              {getRoleIcon(user?.role || "")}
              <div>
                <h2 className="text-2xl font-bold">
                  Panel de {getRoleName(user?.role || "")}
                </h2>
                <p className="text-gray-600 font-normal">
                  Gestiona tus actividades en el ecosistema NotaryPro
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Documentos</p>
                    <p className="text-2xl font-bold">{documents?.length || 0}</p>
                  </div>
                  <FileText className="text-chile-blue" size={24} />
                </div>
              </div>
              
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Comisiones</p>
                    <p className="text-2xl font-bold">
                      ${commissions?.reduce((sum: number, c: any) => sum + parseFloat(c.vecinoAmount || c.certificadorAmount || 0), 0).toLocaleString() || 0}
                    </p>
                  </div>
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
              
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Notificaciones</p>
                    <p className="text-2xl font-bold">
                      {notifications?.filter((n: any) => !n.isRead).length || 0}
                    </p>
                  </div>
                  <Bell className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Primary Dashboard Access */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="text-chile-red" />
                <span>Acceder al Dashboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Accede a tu panel completo con todas las funcionalidades específicas de tu rol.
              </p>
              <Button asChild className="w-full btn-chile">
                <Link href={getDashboardRoute(user?.role || "")}>
                  Ir al Dashboard Completo
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role === "vecino" && (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pos">
                    <Store className="mr-2" size={16} />
                    Terminal POS
                  </Link>
                </Button>
              )}
              
              {user?.role === "usuario_final" && (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pos">
                    <FileText className="mr-2" size={16} />
                    Crear Documento
                  </Link>
                </Button>
              )}
              
              {user?.role === "certificador" && (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/certificador">
                    <Stamp className="mr-2" size={16} />
                    Documentos Pendientes
                  </Link>
                </Button>
              )}
              
              <Button asChild variant="outline" className="w-full">
                <Link href={getDashboardRoute(user?.role || "")}>
                  <Bell className="mr-2" size={16} />
                  Ver Notificaciones
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {documents && documents.length > 0 ? (
              <div className="space-y-4">
                {documents.slice(0, 5).map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{doc.title}</h4>
                      <p className="text-sm text-gray-600">
                        {doc.type} - {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium status-${doc.status}`}>
                      {doc.status === "certified" ? "Certificado" :
                       doc.status === "pending_certification" ? "Pendiente" :
                       doc.status === "rejected" ? "Rechazado" : "Borrador"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay documentos recientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
