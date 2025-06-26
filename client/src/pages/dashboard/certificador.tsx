import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, FileText, CheckCircle, AlertTriangle, Eye, Calendar, Star, Plus, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import CertificationQueue from "@/components/certification-queue";
import DocumentViewer from "@/components/document-viewer";
import IdentityVerification from "@/components/identity-verification";
import { useState } from "react";

export default function CertificadorDashboard() {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showClientSignature, setShowClientSignature] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [documentToSign, setDocumentToSign] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: documents } = useQuery({
    queryKey: ["/api/documents/certification-queue"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/certificador/stats"],
  });

  const { data: profile } = useQuery({
    queryKey: ["/api/certificador/profile"],
  });

  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
  });

  const createFromTemplateMutation = useMutation({
    mutationFn: async ({ templateId, clientData }: any) => {
      const response = await fetch("/api/documents/from-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, clientData }),
      });
      if (!response.ok) throw new Error("Error al crear documento desde plantilla");
      return response.json();
    },
    onSuccess: (document) => {
      setDocumentToSign(document);
      setShowTemplateForm(false);
      setShowClientSignature(true);
    },
  });

  const captureClientSignatureMutation = useMutation({
    mutationFn: async ({ documentId, clientSignature, clientData }: any) => {
      const response = await fetch(`/api/documents/${documentId}/client-signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSignature, clientData }),
      });
      if (!response.ok) throw new Error("Error al capturar firma del cliente");
      return response.json();
    },
    onSuccess: (document) => {
      setDocumentToSign(document);
      setShowClientSignature(false);
      signWithETokenMutation.mutate({ documentId: document.id });
    },
  });

  const signWithETokenMutation = useMutation({
    mutationFn: async ({ documentId }: any) => {
      const response = await fetch(`/api/documents/${documentId}/etoken-sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          certificadorId: profile?.id,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Error al firmar con eToken");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents/certification-queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/certificador/stats"] });
      setDocumentToSign(null);
    },
  });

  const certifyMutation = useMutation({
    mutationFn: async ({ documentId, status, signature }: any) => {
      const response = await fetch(`/api/documents/${documentId}/certify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, signature }),
      });
      if (!response.ok) throw new Error("Error al certificar documento");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents/certification-queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/certificador/stats"] });
      setSelectedDocument(null);
      setShowVerification(false);
    },
  });

  const handleCertify = (documentId: number) => {
    setShowVerification(true);
  };

  const handleVerificationComplete = (verificationData: any) => {
    if (selectedDocument) {
      certifyMutation.mutate({
        documentId: selectedDocument.id,
        status: "certified",
        signature: {
          certificadorId: profile?.id,
          timestamp: new Date().toISOString(),
          verificationData,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-certificador rounded-xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Certificador</h1>
              <p className="text-gray-600">
                Bienvenido, {profile?.firstName} {profile?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowTemplateForm(true)}
              className="btn-chile"
            >
              <Plus className="mr-2" size={16} />
              Crear desde Plantilla
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Star className="mr-1" size={14} />
              Calificación: {profile?.rating || "4.9"}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documentos Hoy</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    {stats?.todayCount || 15}
                  </p>
                </div>
                <FileText className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {documents?.filter((d: any) => d.status === "pending").length || 8}
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
                  <p className="text-sm text-gray-600">Certificados</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats?.certifiedCount || 142}
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
                  <p className="text-sm text-gray-600">Tiempo Promedio</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats?.avgTime || "2.3"}h
                  </p>
                </div>
                <Clock className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="text-chile-blue" />
              <span>Progreso Diario</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Meta diaria: 20 documentos</span>
                <span className="text-sm text-gray-600">{stats?.todayCount || 15}/20</span>
              </div>
              <Progress value={((stats?.todayCount || 15) / 20) * 100} className="w-full" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Mañana</p>
                  <p className="text-lg font-bold text-blue-800">8</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Tarde</p>
                  <p className="text-lg font-bold text-green-800">7</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Restante</p>
                  <p className="text-lg font-bold text-gray-800">5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Work Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Document Queue */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="text-chile-red" />
                  <span>Cola de Certificación</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CertificationQueue
                  documents={documents || []}
                  onSelectDocument={setSelectedDocument}
                  selectedDocument={selectedDocument}
                />
                {selectedDocument && (
                  <div className="mt-6 flex space-x-3">
                    <Button
                      onClick={() => handleCertify(selectedDocument.id)}
                      className="btn-chile"
                      disabled={certifyMutation.isPending}
                    >
                      <CheckCircle className="mr-2" size={16} />
                      Certificar Documento
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedDocument(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Métricas de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Precisión</span>
                    <span className="text-green-600 text-sm font-medium">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Velocidad</span>
                    <span className="text-blue-600 text-sm font-medium">Alta</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Satisfacción Cliente</span>
                    <span className="text-purple-600 text-sm font-medium">4.9⭐</span>
                  </div>
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
                      <p className="text-xs text-gray-600">Certificado - 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={16} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Finiquito Laboral</p>
                      <p className="text-xs text-gray-600">Certificado - 10:15 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                    <Eye className="text-blue-600" size={16} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Contrato Simple</p>
                      <p className="text-xs text-gray-600">En revisión - 9:45 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2" size={16} />
                    Ver Todos los Documentos
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2" size={16} />
                    Programar Descanso
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="mr-2" size={16} />
                    Reportar Problema
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Template Selection Modal */}
        {showTemplateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Crear Documento desde Plantilla</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateForm(false)}
                >
                  Cerrar
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Template Selection */}
                <div className="space-y-4">
                  <h3 className="font-medium">Seleccionar Plantilla</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "declaracion_jurada", name: "Declaración Jurada", price: 2000 },
                      { id: "finiquito_laboral", name: "Finiquito Laboral", price: 8000 },
                      { id: "contrato_simple", name: "Contrato Simple", price: 3500 },
                      { id: "contrato_arriendo", name: "Contrato de Arriendo", price: 5000 }
                    ].map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTemplate === template.id
                            ? "border-chile-red bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600">${template.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Information Form */}
                {selectedTemplate && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Información del Cliente</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const clientData = {
                          rut: formData.get("rut"),
                          nombre: formData.get("nombre"),
                          email: formData.get("email"),
                          telefono: formData.get("telefono"),
                          direccion: formData.get("direccion"),
                        };
                        createFromTemplateMutation.mutate({
                          templateId: selectedTemplate,
                          clientData,
                        });
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">RUT</label>
                          <input
                            name="rut"
                            type="text"
                            placeholder="12.345.678-9"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                          <input
                            name="nombre"
                            type="text"
                            placeholder="Juan Pérez García"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            name="email"
                            type="email"
                            placeholder="juan@ejemplo.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Teléfono</label>
                          <input
                            name="telefono"
                            type="tel"
                            placeholder="+56 9 1234 5678"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Dirección</label>
                        <input
                          name="direccion"
                          type="text"
                          placeholder="Av. Providencia 123, Santiago"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full btn-chile"
                        disabled={createFromTemplateMutation.isPending}
                      >
                        {createFromTemplateMutation.isPending ? "Creando..." : "Crear Documento"}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Client Signature Modal */}
        {showClientSignature && documentToSign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Captura de Firma del Cliente</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowClientSignature(false)}
                >
                  Cerrar
                </Button>
              </div>

              <div className="space-y-6">
                {/* Document Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Documento: {documentToSign.title}</h3>
                  <p className="text-sm text-gray-600">{documentToSign.type}</p>
                </div>

                {/* Signature Pad */}
                <div className="space-y-4">
                  <h3 className="font-medium">Firma del Cliente</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <canvas
                      id="signature-pad"
                      width="600"
                      height="200"
                      className="border border-gray-300 rounded bg-white mx-auto"
                      style={{ touchAction: "none" }}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Solicite al cliente que firme en el área de arriba
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const canvas = document.getElementById("signature-pad") as HTMLCanvasElement;
                        const ctx = canvas.getContext("2d");
                        ctx?.clearRect(0, 0, canvas.width, canvas.height);
                      }}
                    >
                      Limpiar Firma
                    </Button>
                    <Button
                      className="btn-chile flex-1"
                      onClick={() => {
                        const canvas = document.getElementById("signature-pad") as HTMLCanvasElement;
                        const signatureData = canvas.toDataURL();
                        captureClientSignatureMutation.mutate({
                          documentId: documentToSign.id,
                          clientSignature: signatureData,
                          clientData: documentToSign.clientData,
                        });
                      }}
                      disabled={captureClientSignatureMutation.isPending}
                    >
                      {captureClientSignatureMutation.isPending ? "Guardando..." : "Confirmar Firma"}
                    </Button>
                  </div>
                </div>

                {/* Client Verification */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800">Verificación del Cliente</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Confirme que el cliente ha leído y comprende el documento antes de proceder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* eToken Signing Progress Modal */}
        {signWithETokenMutation.isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-chile-red rounded-full flex items-center justify-center mx-auto">
                  <RefreshCw className="text-white animate-spin" size={32} />
                </div>
                <h3 className="text-lg font-bold">Firmando con eToken</h3>
                <p className="text-gray-600">
                  Procesando firma digital certificada...
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-700">
                    El documento será certificado automáticamente una vez completada la firma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Identity Verification Modal */}
        {showVerification && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Verificación de Identidad</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowVerification(false)}
                >
                  Cerrar
                </Button>
              </div>
              <IdentityVerification
                documentId={selectedDocument.id}
                onComplete={handleVerificationComplete}
                isLoading={certifyMutation.isPending}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}