import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Handshake, Building, TrendingUp, Users, MapPin, Calendar, 
  Target, Award, FileText, DollarSign, Plus, Eye
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import { useState } from "react";

export default function SociosDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const queryClient = useQueryClient();

  const { data: partnerStats } = useQuery({
    queryKey: ["/api/socios/stats"],
  });

  const { data: partnerships } = useQuery({
    queryKey: ["/api/socios/partnerships"],
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/socios/projects"],
  });

  const { data: revenue } = useQuery({
    queryKey: ["/api/socios/revenue", selectedPeriod],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-socios rounded-xl flex items-center justify-center">
              <Handshake size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Socios</h1>
              <p className="text-gray-600">Gestión de alianzas estratégicas y proyectos</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="btn-chile">
              <Plus className="mr-2" size={16} />
              Nueva Alianza
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Socios Activos</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {partnerStats?.activePartners || 23}
                  </p>
                  <p className="text-sm text-green-600">+3 este mes</p>
                </div>
                <Building className="text-blue-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Proyectos Activos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {partnerStats?.activeProjects || 8}
                  </p>
                  <p className="text-sm text-blue-600">2 en desarrollo</p>
                </div>
                <Target className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos Mes</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${revenue?.monthlyRevenue?.toLocaleString() || "347,820"}
                  </p>
                  <p className="text-sm text-green-600">+18% crecimiento</p>
                </div>
                <DollarSign className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expansión</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {partnerStats?.expansionTargets || 15}
                  </p>
                  <p className="text-sm text-gray-600">nuevas regiones</p>
                </div>
                <MapPin className="text-orange-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partnership Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <Handshake className="text-blue-600" />
                <span>Resumen de Alianzas</span>
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
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800">Alianzas Estratégicas</h4>
                  <p className="text-2xl font-bold text-blue-900">23</p>
                  <p className="text-sm text-blue-700">Socios comerciales activos</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800">Nuevos POS Integrados</h4>
                  <p className="text-2xl font-bold text-green-900">47</p>
                  <p className="text-sm text-green-700">Este mes</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800">ROI Promedio</h4>
                  <p className="text-2xl font-bold text-purple-900">285%</p>
                  <p className="text-sm text-purple-700">Retorno de inversión</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800">Tiempo Implementación</h4>
                  <p className="text-2xl font-bold text-orange-900">21 días</p>
                  <p className="text-sm text-orange-700">Promedio por socio</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Meta Anual</h4>
                  <div className="mt-2">
                    <Progress value={76.7} className="w-full" />
                    <p className="text-sm text-gray-600 mt-1">23/30 socios objetivo</p>
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                  <h4 className="font-semibold text-indigo-800">Satisfacción Socios</h4>
                  <p className="text-2xl font-bold text-indigo-900">4.8★</p>
                  <p className="text-sm text-indigo-700">Calificación promedio</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects & Partnerships */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="text-green-600" />
                <span>Proyectos Activos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(projects || [
                  { 
                    id: 1, 
                    name: "Expansión Región Norte", 
                    partner: "RedPOS Chile", 
                    progress: 75, 
                    deadline: "2025-03-15",
                    status: "En progreso"
                  },
                  { 
                    id: 2, 
                    name: "Integración Bancaria", 
                    partner: "Banco Estado", 
                    progress: 40, 
                    deadline: "2025-04-30",
                    status: "Desarrollo"
                  },
                  { 
                    id: 3, 
                    name: "App Móvil Certificadores", 
                    partner: "TechSolutions", 
                    progress: 90, 
                    deadline: "2025-02-28",
                    status: "Testing"
                  }
                ]).map((project: any) => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.partner}</p>
                      </div>
                      <Badge variant={
                        project.status === "En progreso" ? "default" :
                        project.status === "Testing" ? "secondary" : "outline"
                      }>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="w-full" />
                      <p className="text-xs text-gray-500">
                        Fecha límite: {new Date(project.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" variant="outline">
                  <Plus className="mr-2" size={16} />
                  Nuevo Proyecto
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Partnership Directory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="text-purple-600" />
                <span>Directorio de Socios</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    name: "RedPOS Chile", 
                    type: "Tecnología", 
                    locations: 89, 
                    revenue: 234000,
                    status: "Activo"
                  },
                  { 
                    name: "Banco Estado", 
                    type: "Financiero", 
                    locations: 156, 
                    revenue: 445000,
                    status: "Activo"
                  },
                  { 
                    name: "TechSolutions", 
                    type: "Desarrollo", 
                    locations: 12, 
                    revenue: 89000,
                    status: "En integración"
                  },
                  { 
                    name: "Notarias Digital", 
                    type: "Legal", 
                    locations: 34, 
                    revenue: 156000,
                    status: "Activo"
                  }
                ].map((partner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Building className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">{partner.name}</h4>
                        <p className="text-sm text-gray-600">{partner.type}</p>
                        <p className="text-xs text-gray-500">
                          {partner.locations} ubicaciones
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={partner.status === "Activo" ? "default" : "secondary"}>
                        {partner.status}
                      </Badge>
                      <p className="text-sm text-green-600 mt-1">
                        ${partner.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <Eye className="mr-2" size={16} />
                  Ver Todos los Socios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="text-green-600" />
              <span>Análisis de Rendimiento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Award className="mx-auto text-blue-600 mb-2" size={32} />
                <p className="text-lg font-bold text-blue-800">Top Socio</p>
                <p className="text-sm text-blue-600">RedPOS Chile</p>
                <p className="text-xs text-blue-500">89 ubicaciones</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="mx-auto text-green-600 mb-2" size={32} />
                <p className="text-lg font-bold text-green-800">Crecimiento</p>
                <p className="text-sm text-green-600">+18%</p>
                <p className="text-xs text-green-500">vs mes anterior</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="mx-auto text-purple-600 mb-2" size={32} />
                <p className="text-lg font-bold text-purple-800">Nuevos Usuarios</p>
                <p className="text-sm text-purple-600">1,247</p>
                <p className="text-xs text-purple-500">por socios</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <MapPin className="mx-auto text-orange-600 mb-2" size={32} />
                <p className="text-lg font-bold text-orange-800">Cobertura</p>
                <p className="text-sm text-orange-600">12 regiones</p>
                <p className="text-xs text-orange-500">de 15 totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="text-chile-blue" />
              <span>Actividades Recientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { 
                  action: "Nuevo socio incorporado", 
                  partner: "Notarias Digital", 
                  time: "Hace 2 días",
                  type: "partnership"
                },
                { 
                  action: "Proyecto completado", 
                  partner: "App Móvil - TechSolutions", 
                  time: "Hace 5 días",
                  type: "project"
                },
                { 
                  action: "Expansión aprobada", 
                  partner: "RedPOS Chile - Región Norte", 
                  time: "Hace 1 semana",
                  type: "expansion"
                },
                { 
                  action: "Renovación de contrato", 
                  partner: "Banco Estado", 
                  time: "Hace 2 semanas",
                  type: "contract"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === "partnership" ? "bg-blue-100" :
                      activity.type === "project" ? "bg-green-100" :
                      activity.type === "expansion" ? "bg-purple-100" : "bg-orange-100"
                    }`}>
                      {activity.type === "partnership" ? <Handshake size={16} /> :
                       activity.type === "project" ? <Target size={16} /> :
                       activity.type === "expansion" ? <MapPin size={16} /> :
                       <FileText size={16} />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.partner}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}