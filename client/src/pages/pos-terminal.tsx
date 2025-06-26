import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import DocumentForm from "@/components/document-form";
import IdentityVerification from "@/components/identity-verification";
import CommissionCalculator from "@/components/commission-calculator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

type PosStep = "selection" | "form" | "verification" | "payment" | "completion";

export default function PosTerminal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<PosStep>("selection");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [documentData, setDocumentData] = useState<any>(null);
  const [verificationData, setVerificationData] = useState<any>(null);

  const documentTypes = [
    {
      type: "declaracion_jurada",
      name: "Declaración Jurada",
      price: 12000,
      description: "Certificación de declaraciones con validez legal completa",
      icon: "📋"
    },
    {
      type: "finiquito_laboral",
      name: "Finiquito Laboral",
      price: 18000,
      description: "Documentos de término de relación laboral certificados",
      icon: "🤝"
    },
    {
      type: "contrato_simple",
      name: "Contrato Simple",
      price: 25000,
      description: "Acuerdos contractuales con firma electrónica avanzada",
      icon: "📄"
    }
  ];

  const createDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/documents", data);
      return response.json();
    },
    onSuccess: (document) => {
      setDocumentData(document);
      setCurrentStep("verification");
      toast({
        title: "Documento creado",
        description: "Documento creado exitosamente. Proceda con la verificación de identidad.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyIdentityMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/verify-identity", data);
    },
    onSuccess: () => {
      setCurrentStep("payment");
      toast({
        title: "Identidad verificada",
        description: "La identidad ha sido verificada exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error en verificación",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDocumentTypeSelect = (docType: any) => {
    setSelectedDocumentType(docType.type);
    setCurrentStep("form");
  };

  const handleFormSubmit = (formData: any) => {
    const selectedDoc = documentTypes.find(d => d.type === selectedDocumentType);
    
    createDocumentMutation.mutate({
      type: selectedDocumentType,
      title: `${selectedDoc?.name} - ${formData.nombre}`,
      content: formData,
      price: selectedDoc?.price.toString() || "0",
      status: "draft"
    });
  };

  const handleVerificationComplete = (verData: any) => {
    setVerificationData(verData);
    verifyIdentityMutation.mutate({
      documentId: documentData.id,
      verificationData: verData
    });
  };

  const handlePaymentComplete = () => {
    setCurrentStep("completion");
    toast({
      title: "Pago procesado",
      description: "El documento ha sido enviado para certificación.",
    });
  };

  const resetTerminal = () => {
    setCurrentStep("selection");
    setSelectedDocumentType("");
    setDocumentData(null);
    setVerificationData(null);
    queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "selection":
        return "Seleccionar Tipo de Documento";
      case "form":
        return "Completar Información";
      case "verification":
        return "Verificar Identidad";
      case "payment":
        return "Procesar Pago";
      case "completion":
        return "Proceso Completado";
      default:
        return "Terminal POS";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Monitor className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Terminal POS</h1>
                <p className="text-sm text-gray-500">VecinoXpress</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft className="mr-2" size={16} />
                  Volver
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{getStepTitle()}</h2>
              <div className="flex items-center space-x-2">
                {["selection", "form", "verification", "payment", "completion"].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step ? "bg-green-600 text-white" :
                      ["selection", "form", "verification", "payment", "completion"].indexOf(currentStep) > index ? "bg-green-100 text-green-600" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                      {["selection", "form", "verification", "payment", "completion"].indexOf(currentStep) > index ? (
                        <CheckCircle size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 4 && (
                      <div className={`w-8 h-1 mx-2 ${
                        ["selection", "form", "verification", "payment", "completion"].indexOf(currentStep) > index ? "bg-green-600" : "bg-gray-200"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Type Selection */}
        {currentStep === "selection" && (
          <div className="grid md:grid-cols-3 gap-6">
            {documentTypes.map((docType) => (
              <Card 
                key={docType.type}
                className="cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
                onClick={() => handleDocumentTypeSelect(docType)}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{docType.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{docType.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{docType.description}</p>
                  <div className="border-t pt-4">
                    <span className="text-2xl font-bold text-chile-red">
                      ${docType.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-2">CLP</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Document Form */}
        {currentStep === "form" && (
          <Card>
            <CardHeader>
              <CardTitle>
                Completar {documentTypes.find(d => d.type === selectedDocumentType)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentForm
                documentType={selectedDocumentType}
                onSubmit={handleFormSubmit}
                isLoading={createDocumentMutation.isPending}
              />
            </CardContent>
          </Card>
        )}

        {/* Identity Verification */}
        {currentStep === "verification" && documentData && (
          <Card>
            <CardHeader>
              <CardTitle>Verificación de Identidad</CardTitle>
            </CardHeader>
            <CardContent>
              <IdentityVerification
                documentId={documentData.id}
                onComplete={handleVerificationComplete}
                isLoading={verifyIdentityMutation.isPending}
              />
            </CardContent>
          </Card>
        )}

        {/* Payment Processing */}
        {currentStep === "payment" && documentData && (
          <Card>
            <CardHeader>
              <CardTitle>Procesar Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Resumen del Documento</h3>
                  <div className="flex justify-between items-center">
                    <span>{documentData.title}</span>
                    <span className="font-bold text-chile-red">
                      ${parseFloat(documentData.price).toLocaleString()} CLP
                    </span>
                  </div>
                </div>

                <CommissionCalculator
                  documentPrice={parseFloat(documentData.price)}
                  onPaymentComplete={handlePaymentComplete}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion */}
        {currentStep === "completion" && documentData && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4">¡Proceso Completado!</h2>
              <p className="text-gray-600 mb-6">
                Su documento ha sido enviado para certificación. Recibirá una notificación cuando esté listo.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Información del Documento</h3>
                <p className="text-sm text-gray-600">
                  <strong>ID:</strong> {documentData.id}<br />
                  <strong>Tipo:</strong> {documentData.title}<br />
                  <strong>Estado:</strong> Enviado para certificación
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={resetTerminal} className="btn-chile">
                  Nuevo Documento
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">
                    Finalizar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {(createDocumentMutation.isError || verifyIdentityMutation.isError) && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 text-red-600">
                <AlertCircle size={24} />
                <div>
                  <h3 className="font-semibold">Error en el proceso</h3>
                  <p className="text-sm">
                    {createDocumentMutation.error?.message || verifyIdentityMutation.error?.message}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <Button onClick={() => setCurrentStep("selection")} variant="outline">
                  Reiniciar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
