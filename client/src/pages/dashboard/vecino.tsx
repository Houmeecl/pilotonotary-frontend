import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Store, DollarSign, TrendingUp, Users, MapPin, Calendar, Wifi, WifiOff } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import CommissionCalculator from "@/components/commission-calculator";
import { useState } from "react";

export default function VecinoDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const queryClient = useQueryClient();

  const { data: posData } = useQuery({
    queryKey: ["/api/vecino/pos-locations"],
  });

  const { data: earnings } = useQuery({
    queryKey: ["/api/vecino/earnings", selectedPeriod],
  });

  const { data: todayStats } = useQuery({
    queryKey: ["/api/vecino/today-stats"],
  });

  const { data: commissions } = useQuery({
    queryKey: ["/api/vecino/commissions"],
  });

  const togglePosMutation = useMutation({
    mutationFn: async ({ posId, isActive }: any) => {
      const response = await fetch(`/api/pos-locations/${posId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Error al cambiar estado del POS");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vecino/pos-locations"] });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-vecino rounded-xl flex items-center justify-center">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Vecino</h1>
              <p className="text-gray-600">Gestión de puntos de venta y ganancias</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {posData?.filter((p: any) => p.isActive).length || 0} POS Activos
            </Badge>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documentos Hoy</p>
                  <p className="text-3xl font-bold text-green-600">
                    {todayStats?.documentsCount || 23}
                  </p>
                </div>
                <Store className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ganancias Hoy</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    ${todayStats?.todayEarnings?.toLocaleString() || "4,680"}
                  </p>
                </div>
                <DollarSign className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Clientes Únicos</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {todayStats?.uniqueCustomers || 18}
                  </p>
                </div>
                <Users className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Promedio/Doc</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${todayStats?.avgPerDocument || "203"}
                  </p>
                </div>
                <TrendingUp className="text-orange-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="text-green-600" />
                <span>Resumen de Ganancias</span>
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
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800">Ganancias Totales</h4>
                  <p className="text-2xl font-bold text-green-900">
                    ${earnings?.total?.toLocaleString() || "147,320"}
                  </p>
                  <p className="text-sm text-green-700">
                    +12% vs período anterior
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800">Comisión Promedio</h4>
                  <p className="text-2xl font-bold text-blue-900">40%</p>
                  <p className="text-sm text-blue-700">
                    ${earnings?.avgCommission?.toLocaleString() || "1,847"} por documento
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800">Documentos Procesados</h4>
                  <p className="text-2xl font-bold text-purple-900">
                    {earnings?.documentsCount || 342}
                  </p>
                  <p className="text-sm text-purple-700">
                    Meta mensual: 400 docs
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800">Mejor Día</h4>
                  <p className="text-2xl font-bold text-orange-900">
                    ${earnings?.bestDay || "8,940"}
                  </p>
                  <p className="text-sm text-orange-700">
                    {earnings?.bestDayDate || "15 de Enero"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Progreso Meta Mensual</h4>
                  <div className="mt-2">
                    <Progress value={85.5} className="w-full" />
                    <p className="text-sm text-gray-600 mt-1">342/400 documentos</p>
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                  <h4 className="font-semibold text-indigo-800">Ranking Regional</h4>
                  <p className="text-2xl font-bold text-indigo-900">#3</p>
                  <p className="text-sm text-indigo-700">
                    Top 5 en Región Metropolitana
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* POS Management */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="text-chile-red" />
                <span>Gestión de POS</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(posData || [
                  { id: 1, name: "POS Centro", address: "Centro, Santiago", isActive: true, todayDocs: 12 },
                  { id: 2, name: "POS Maipú", address: "Maipú, RM", isActive: true, todayDocs: 8 },
                  { id: 3, name: "POS Las Condes", address: "Las Condes, RM", isActive: false, todayDocs: 0 }
                ]).map((pos: any) => (
                  <div key={pos.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {pos.isActive ? (
                        <Wifi className="text-green-600" size={20} />
                      ) : (
                        <WifiOff className="text-red-600" size={20} />
                      )}
                      <div>
                        <h4 className="font-medium">{pos.name}</h4>
                        <p className="text-sm text-gray-600">{pos.address}</p>
                        <p className="text-xs text-gray-500">
                          {pos.todayDocs} documentos hoy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={pos.isActive ? "default" : "secondary"}
                        className={pos.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                      >
                        {pos.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePosMutation.mutate({ 
                          posId: pos.id, 
                          isActive: !pos.isActive 
                        })}
                        disabled={togglePosMutation.isPending}
                      >
                        {pos.isActive ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" variant="outline">
                  <MapPin className="mr-2" size={16} />
                  Agregar Nuevo POS
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Commission Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="text-purple-600" />
                <span>Calculadora de Comisiones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommissionCalculator
                documentPrice={5000}
                onPaymentComplete={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/vecino/today-stats"] });
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="text-chile-blue" />
              <span>Transacciones Recientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "14:30", type: "Declaración Jurada", amount: 2000, commission: 800, customer: "Ana García" },
                { time: "13:45", type: "Finiquito Laboral", amount: 8000, commission: 3200, customer: "Carlos Ruiz" },
                { time: "12:15", type: "Contrato Simple", amount: 3500, commission: 1400, customer: "María López" },
                { time: "11:30", type: "Declaración Jurada", amount: 2000, commission: 800, customer: "Pedro Silva" },
                { time: "10:45", type: "Contrato Arriendo", amount: 5000, commission: 2000, customer: "Laura Morales" }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">{transaction.type}</h4>
                      <p className="text-sm text-gray-600">
                        {transaction.customer} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      +${transaction.commission.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      de ${transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline">
                Ver Todas las Transacciones
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}