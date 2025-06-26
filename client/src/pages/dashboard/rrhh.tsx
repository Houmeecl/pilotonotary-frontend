import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, GraduationCap, Calendar, Award, FileText, Clock,
  UserPlus, BookOpen, TrendingUp, Star, Target, CheckCircle
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import { useState } from "react";

export default function RrhhDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const queryClient = useQueryClient();

  const { data: hrStats } = useQuery({
    queryKey: ["/api/rrhh/stats"],
  });

  const { data: trainingPrograms } = useQuery({
    queryKey: ["/api/rrhh/training"],
  });

  const { data: employeePerformance } = useQuery({
    queryKey: ["/api/rrhh/performance", selectedPeriod],
  });

  const { data: certifications } = useQuery({
    queryKey: ["/api/rrhh/certifications"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-rrhh rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard RRHH</h1>
              <p className="text-gray-600">Gestión de talento humano y capacitación</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="btn-chile">
              <UserPlus className="mr-2" size={16} />
              Nuevo Colaborador
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Empleados</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {hrStats?.totalEmployees || 178}
                  </p>
                  <p className="text-sm text-green-600">+8 este mes</p>
                </div>
                <Users className="text-blue-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Capacitación</p>
                  <p className="text-3xl font-bold text-green-600">
                    {hrStats?.inTraining || 34}
                  </p>
                  <p className="text-sm text-blue-600">5 programas activos</p>
                </div>
                <GraduationCap className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Certificados</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {hrStats?.certifiedEmployees || 156}
                  </p>
                  <p className="text-sm text-green-600">87.6% del equipo</p>
                </div>
                <Award className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Satisfacción</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {hrStats?.satisfactionScore || "4.7"}★
                  </p>
                  <p className="text-sm text-gray-600">Promedio general</p>
                </div>
                <Star className="text-orange-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Training Programs Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="text-green-600" />
                <span>Programas de Capacitación</span>
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
                  <h4 className="font-semibold text-blue-800">Certificadores Activos</h4>
                  <p className="text-2xl font-bold text-blue-900">28</p>
                  <p className="text-sm text-blue-700">Profesionales certificados</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800">En Formación</h4>
                  <p className="text-2xl font-bold text-green-900">12</p>
                  <p className="text-sm text-green-700">Próximos certificadores</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800">Horas de Capacitación</h4>
                  <p className="text-2xl font-bold text-purple-900">1,247</p>
                  <p className="text-sm text-purple-700">Este mes</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800">Tasa de Aprobación</h4>
                  <p className="text-2xl font-bold text-orange-900">94%</p>
                  <p className="text-sm text-orange-700">Exámenes de certificación</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Meta Anual Certificaciones</h4>
                  <div className="mt-2">
                    <Progress value={89.1} className="w-full" />
                    <p className="text-sm text-gray-600 mt-1">156/175 certificados</p>
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                  <h4 className="font-semibold text-indigo-800">Retención</h4>
                  <p className="text-2xl font-bold text-indigo-900">96.2%</p>
                  <p className="text-sm text-indigo-700">Tasa de permanencia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Training & Performance */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Active Training Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="text-green-600" />
                <span>Capacitaciones Activas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(trainingPrograms || [
                  { 
                    id: 1, 
                    name: "Certificación Notarial Digital", 
                    participants: 12, 
                    progress: 65, 
                    instructor: "María González",
                    endDate: "2025-03-15"
                  },
                  { 
                    id: 2, 
                    name: "Atención al Cliente POS", 
                    participants: 8, 
                    progress: 80, 
                    instructor: "Carlos Ruiz",
                    endDate: "2025-02-28"
                  },
                  { 
                    id: 3, 
                    name: "Tecnologías eToken", 
                    participants: 15, 
                    progress: 45, 
                    instructor: "Ana López",
                    endDate: "2025-04-10"
                  }
                ]).map((program: any) => (
                  <div key={program.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{program.name}</h4>
                        <p className="text-sm text-gray-600">{program.instructor}</p>
                        <p className="text-xs text-gray-500">{program.participants} participantes</p>
                      </div>
                      <Badge variant="secondary">
                        {program.progress}% completado
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress value={program.progress} className="w-full" />
                      <p className="text-xs text-gray-500">
                        Finaliza: {new Date(program.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" variant="outline">
                  <BookOpen className="mr-2" size={16} />
                  Nuevo Programa
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employee Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="text-purple-600" />
                <span>Rendimiento del Equipo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Top Performers */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Top Certificadores</h4>
                  {[
                    { name: "María González", documents: 156, rating: 4.9, efficiency: 98 },
                    { name: "Carlos Ruiz", documents: 142, rating: 4.8, efficiency: 95 },
                    { name: "Ana López", documents: 138, rating: 4.9, efficiency: 96 }
                  ].map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                          <Award className="text-purple-600" size={16} />
                        </div>
                        <div>
                          <p className="font-medium">{performer.name}</p>
                          <p className="text-sm text-gray-600">{performer.documents} docs certificados</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="text-yellow-500" size={12} />
                          <span className="text-sm font-medium">{performer.rating}</span>
                        </div>
                        <p className="text-xs text-green-600">{performer.efficiency}% eficiencia</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Performance Metrics */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Métricas Generales</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-800">2.3h</p>
                      <p className="text-xs text-blue-600">Tiempo prom/doc</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-800">98.5%</p>
                      <p className="text-xs text-green-600">Precisión</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-800">4.8★</p>
                      <p className="text-xs text-purple-600">Satisfacción</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-800">96%</p>
                      <p className="text-xs text-orange-600">Retención</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certification Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="text-purple-600" />
              <span>Gestión de Certificaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
                <p className="text-lg font-bold text-green-800">Certificados</p>
                <p className="text-2xl font-bold text-green-900">156</p>
                <p className="text-xs text-green-600">Total activos</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="mx-auto text-blue-600 mb-2" size={32} />
                <p className="text-lg font-bold text-blue-800">En Proceso</p>
                <p className="text-2xl font-bold text-blue-900">12</p>
                <p className="text-xs text-blue-600">Evaluaciones pendientes</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Calendar className="mx-auto text-orange-600 mb-2" size={32} />
                <p className="text-lg font-bold text-orange-800">Renovaciones</p>
                <p className="text-2xl font-bold text-orange-900">23</p>
                <p className="text-xs text-orange-600">Próximos 3 meses</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Target className="mx-auto text-purple-600 mb-2" size={32} />
                <p className="text-lg font-bold text-purple-800">Meta 2025</p>
                <p className="text-2xl font-bold text-purple-900">175</p>
                <p className="text-xs text-purple-600">Objetivo anual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recruitment & Development */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recruitment Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="text-blue-600" />
                <span>Pipeline de Reclutamiento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  {[
                    { stage: "Candidatos", count: 45, color: "blue" },
                    { stage: "Entrevista Inicial", count: 18, color: "green" },
                    { stage: "Evaluación Técnica", count: 8, color: "purple" },
                    { stage: "Entrevista Final", count: 3, color: "orange" }
                  ].map((stage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <div className="flex items-center space-x-2">
                        <Badge className={`bg-${stage.color}-100 text-${stage.color}-700`}>
                          {stage.count}
                        </Badge>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 bg-${stage.color}-500 rounded-full`}
                            style={{ width: `${(stage.count / 45) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Tasa de conversión</p>
                      <p className="font-semibold">16.7%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tiempo promedio</p>
                      <p className="font-semibold">18 días</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Development */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="text-green-600" />
                <span>Desarrollo del Equipo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Development Areas */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Áreas de Desarrollo</h4>
                  {[
                    { area: "Tecnología Digital", participants: 24, progress: 78 },
                    { area: "Atención al Cliente", participants: 31, progress: 85 },
                    { area: "Procesos Legales", participants: 18, progress: 92 },
                    { area: "Liderazgo", participants: 12, progress: 65 }
                  ].map((area, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{area.area}</span>
                        <span>{area.participants} personas</span>
                      </div>
                      <Progress value={area.progress} className="h-2" />
                      <p className="text-xs text-gray-500">{area.progress}% completado</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="font-semibold text-blue-800">85</p>
                      <p className="text-xs text-blue-600">Horas/persona mes</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="font-semibold text-green-800">4.6★</p>
                      <p className="text-xs text-green-600">Satisfacción formación</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}