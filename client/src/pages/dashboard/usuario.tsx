import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Eye, Plus, Search, Calendar, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import DocumentForm from "@/components/document-form";
import DocumentViewer from "@/components/document-viewer";
import QrGenerator from "@/components/qr-generator";
import { useState } from "react";

export default function UsuarioDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: documents } = useQuery({
    queryKey: ["/api/user/documents"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (documentData: any) => {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentData),
      });
      if (!response.ok) throw new Error("Error al crear documento");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      setShowCreateForm(false);
    },
  });

  const filteredDocuments = documents?.filter((doc: any) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "certified": return "bg-green-100 text-green-700";
      case "pending": return "bg-orange-100 text-orange-700";
      case "in_review": return "bg-blue-100 text-blue-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "certified": return "Certificado";
      case "pending": return "Pendiente";
      case "in_review": return "En Revisión";
      case "rejected": return "Rechazado";
      default: return "Borrador";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-usuario rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mis Documentos</h1>
              <p className="text-gray-600">Gestiona y consulta tus documentos certificados</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="btn-chile"
          >
            <Plus className="mr-2" size={16} />
            Nuevo Documento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documentos</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats?.totalDocuments || 8}
                  </p>
                </div>
                <FileText className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Certificados</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats?.certifiedDocuments || 6}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Proceso</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats?.pendingDocuments || 2}
                  </p>
                </div>
                <Clock className="text-orange-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Este Mes</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    {stats?.thisMonthDocuments || 3}
                  </p>
                </div>
                <Calendar className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Buscar por título o tipo de documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Calendar className="mr-2" size={16} />
                Filtrar por Fecha
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Documentos ({filteredDocuments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600">No tienes documentos aún</p>
                      <Button 
                        onClick={() => setShowCreateForm(true)}
                        className="mt-4"
                        variant="outline"
                      >
                        Crear tu primer documento
                      </Button>
                    </div>
                  ) : (
                    filteredDocuments.map((document: any) => (
                      <div key={document.id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-purple-600" size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">{document.title}</h4>
                            <p className="text-sm text-gray-600">{document.type}</p>
                            <p className="text-xs text-gray-500">
                              Creado: {new Date(document.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(document.status)}>
                            {getStatusText(document.status)}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedDocument(document)}
                            >
                              <Eye size={16} />
                            </Button>
                            {document.status === "certified" && (
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Download size={16} />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2" size={16} />
                    Declaración Jurada
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2" size={16} />
                    Finiquito Laboral
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2" size={16} />
                    Contrato Simple
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <Plus className="mr-2" size={16} />
                    Otro Documento
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={16} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Declaración Jurada</p>
                      <p className="text-xs text-gray-600">Certificado - Hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                    <Clock className="text-blue-600" size={16} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Finiquito Laboral</p>
                      <p className="text-xs text-gray-600">En revisión - Hace 1 día</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded-lg">
                    <Clock className="text-orange-600" size={16} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Contrato Arriendo</p>
                      <p className="text-xs text-gray-600">Pendiente - Hace 3 días</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">¿Necesitas Ayuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    ¿Cómo crear un documento?
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Tiempos de certificación
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Contactar soporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Document Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Crear Nuevo Documento</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cerrar
                </Button>
              </div>
              <DocumentForm
                documentType="declaracion_jurada"
                onSubmit={(data) => createDocumentMutation.mutate(data)}
                isLoading={createDocumentMutation.isPending}
              />
            </div>
          </div>
        )}

        {/* Document Viewer Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Ver Documento</h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDocument(null)}
                >
                  Cerrar
                </Button>
              </div>
              <DocumentViewer 
                document={selectedDocument} 
                onClose={() => setSelectedDocument(null)} 
              />
              {selectedDocument.status === "certified" && selectedDocument.qrValidationCode && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-3">Código de Validación</h3>
                  <div className="flex items-center justify-center">
                    <QrGenerator value={selectedDocument.qrValidationCode} size={150} />
                  </div>
                  <p className="text-sm text-green-700 text-center mt-3">
                    Escanea este código para validar la autenticidad del documento
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}