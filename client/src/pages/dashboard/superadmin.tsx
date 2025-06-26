import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, Users, FileText, DollarSign, TrendingUp, AlertTriangle, 
  Settings, BarChart3, MapPin, Star, Bell, CheckCircle, Clock,
  UserPlus, Building, Eye, Download
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import UserManagementPanel from "@/components/user-management-panel";
import { useState } from "react";

export default function SuperadminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const queryClient = useQueryClient();

  const { data: systemStats } = useQuery({
    queryKey: ["/api/admin/system-stats"],
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/admin/user-stats"],
  });

  const { data: revenueData } = useQuery({
    queryKey: ["/api/admin/revenue", selectedPeriod],
  });

  const { data: systemAlerts } = useQuery({
    queryKey: ["/api/admin/alerts"],
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/admin/recent-activity"],
  });

  const { data: allUsers } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Error al crear usuario");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/user-stats"] });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-superadmin rounded-xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Superadmin</h1>
              <p className="text-gray-600">Control total del sistema NotaryPro</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="mr-2" size={16} />
              Exportar Datos
            </Button>
            <Button className="btn-chile">
              <Settings className="mr-2" size={16} />
              Configuración
            </Button>
          </div>
        </div>

        {/* System Alerts */}
        {systemAlerts && systemAlerts.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <AlertTriangle className="text-orange-600" />
                <span>Alertas del Sistema ({systemAlerts.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.slice(0, 3).map((alert: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="text-orange-600" size={16} />
                      <div>
                        <p className="font-medium text-orange-800">{alert.title}</p>
                        <p className="text-sm text-orange-700">{alert.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Resolver
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuarios Totales</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {userStats?.totalUsers || 2847}
                  </p>
                  <p className="text-sm text-green-600">+12% este mes</p>
                </div>
                <Users className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documentos Hoy</p>
                  <p className="text-3xl font-bold text-green-600">
                    {systemStats?.todayDocuments || 342}
                  </p>
                  <p className="text-sm text-green-600">+8% vs ayer</p>
                </div>
                <FileText className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos Mes</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    ${revenueData?.monthlyRevenue?.toLocaleString() || "1,847,320"}
                  </p>
                  <p className="text-sm text-green-600">+15% vs mes anterior</p>
                </div>
                <DollarSign className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">POS Activos</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {systemStats?.activePOS || 145}
                  </p>
                  <p className="text-sm text-gray-600">de 158 total</p>
                </div>
                <MapPin className="text-orange-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics and Performance */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Analytics */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="text-green-600" />
                    <span>Análisis de Ingresos</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    {["week", "month", "quarter"].map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period === "week" ? "Semana" : period === "month" ? "Mes" : "Trimestre"}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Revenue Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-green-800">
                        ${revenueData?.total?.toLocaleString() || "1,847,320"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Comisiones Pagadas</p>
                      <p className="text-2xl font-bold text-blue-800">
                        ${revenueData?.commissionsPaid?.toLocaleString() || "1,385,490"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Ganancia Neta</p>
                      <p className="text-2xl font-bold text-purple-800">
                        ${revenueData?.netProfit?.toLocaleString() || "461,830"}
                      </p>
                    </div>
                  </div>

                  {/* Growth Metrics */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Crecimiento Mensual</span>
                      <span className="text-green-600 font-medium">+15.3%</span>
                    </div>
                    <Progress value={78} className="w-full" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Documentos/día promedio:</span>
                        <span className="font-medium">342</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor promedio/doc:</span>
                        <span className="font-medium">$5,394</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Disponibilidad</span>
                    <Badge className="bg-green-100 text-green-700">99.8%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tiempo de Respuesta</span>
                    <Badge className="bg-blue-100 text-blue-700">245ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uso de Base de Datos</span>
                    <Badge className="bg-orange-100 text-orange-700">67%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Transacciones/min</span>
                    <Badge className="bg-purple-100 text-purple-700">1,245</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Certificadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "María González", docs: 156, rating: 4.9 },
                    { name: "Carlos Ruiz", docs: 142, rating: 4.8 },
                    { name: "Ana López", docs: 138, rating: 4.9 }
                  ].map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{cert.name}</p>
                        <p className="text-xs text-gray-600">{cert.docs} docs</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-500" size={12} />
                        <span className="text-xs font-medium">{cert.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Management Panel */}
        <div className="mb-8">
          <UserManagementPanel 
            users={allUsers || []}
            isLoading={false}
          />
        </div>

        {/* Quick User Stats */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="text-purple-600" />
                <span>Estadísticas de Usuarios</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* User Type Distribution */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-800">
                      {userStats?.certificadores || 28}
                    </p>
                    <p className="text-xs text-blue-600">Certificadores</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-800">
                      {userStats?.vecinos || 145}
                    </p>
                    <p className="text-xs text-green-600">Vecinos</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-800">
                      {userStats?.usuarios || 2674}
                    </p>
                    <p className="text-xs text-purple-600">Usuarios</p>
                  </div>
                </div>

                {/* Recent Registrations */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Registros Recientes</h4>
                  {(allUsers || []).slice(0, 3).map((user: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* POS Network Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="text-orange-600" />
                <span>Red de POS</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* POS Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-800">145</p>
                    <p className="text-xs text-green-600">POS Activos</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-lg font-bold text-red-800">13</p>
                    <p className="text-xs text-red-600">POS Inactivos</p>
                  </div>
                </div>

                {/* Regional Distribution */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Distribución Regional</h4>
                  <div className="space-y-2">
                    {[
                      { region: "Región Metropolitana", count: 87, percentage: 55 },
                      { region: "Valparaíso", count: 23, percentage: 15 },
                      { region: "Biobío", count: 18, percentage: 11 },
                      { region: "Otros", count: 30, percentage: 19 }
                    ].map((region, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{region.region}</span>
                          <span>{region.count} POS</span>
                        </div>
                        <Progress value={region.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Building className="mr-2" size={16} />
                  Gestionar Red POS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="text-chile-blue" />
              <span>Actividad Reciente del Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(recentActivity || [
                { type: "document", action: "Documento certificado", user: "María González", time: "Hace 5 min", status: "success" },
                { type: "user", action: "Nuevo certificador registrado", user: "Carlos Ruiz", time: "Hace 15 min", status: "info" },
                { type: "payment", action: "Comisión pagada", user: "POS Centro", time: "Hace 30 min", status: "success" },
                { type: "alert", action: "POS desconectado", user: "POS Maipú", time: "Hace 1h", status: "warning" },
                { type: "document", action: "Documento rechazado", user: "Ana López", time: "Hace 2h", status: "error" }
              ]).map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.status === "success" ? "bg-green-100" :
                      activity.status === "warning" ? "bg-orange-100" :
                      activity.status === "error" ? "bg-red-100" : "bg-blue-100"
                    }`}>
                      {activity.type === "document" ? <FileText size={16} /> :
                       activity.type === "user" ? <Users size={16} /> :
                       activity.type === "payment" ? <DollarSign size={16} /> :
                       <AlertTriangle size={16} />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <Badge variant={
                      activity.status === "success" ? "default" : 
                      activity.status === "warning" ? "secondary" : 
                      activity.status === "error" ? "destructive" : "outline"
                    } className={
                      activity.status === "success" ? "bg-green-100 text-green-700" :
                      activity.status === "warning" ? "bg-orange-100 text-orange-700" :
                      activity.status === "error" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    }>
                      {activity.status === "success" ? "Completado" :
                       activity.status === "warning" ? "Atención" :
                       activity.status === "error" ? "Error" : "Info"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline">
                <Eye className="mr-2" size={16} />
                Ver Toda la Actividad
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}