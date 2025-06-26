import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Eye, FileText } from "lucide-react";

interface CertificationQueueProps {
  documents: any[];
  onSelectDocument: (document: any) => void;
  selectedDocument?: any;
}

export default function CertificationQueue({ documents, onSelectDocument, selectedDocument }: CertificationQueueProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_certification":
        return <Clock className="text-orange-600" size={16} />;
      case "certified":
        return <CheckCircle className="text-green-600" size={16} />;
      case "rejected":
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <FileText className="text-gray-600" size={16} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_certification":
        return <Badge className="bg-orange-100 text-orange-700">Pendiente</Badge>;
      case "certified":
        return <Badge className="bg-green-100 text-green-700">Certificado</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "declaracion_jurada":
        return "Declaración Jurada";
      case "finiquito_laboral":
        return "Finiquito Laboral";
      case "contrato_simple":
        return "Contrato Simple";
      default:
        return type;
    }
  };

  const getVerificationIcon = (isVerified: boolean) => {
    return isVerified ? (
      <div className="flex items-center text-green-600 text-xs">
        <CheckCircle size={12} className="mr-1" />
        Verificado
      </div>
    ) : (
      <div className="flex items-center text-red-600 text-xs">
        <XCircle size={12} className="mr-1" />
        Sin verificar
      </div>
    );
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText size={48} className="mx-auto mb-4 opacity-50" />
        <p>No hay documentos pendientes de certificación</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <Card 
          key={document.id}
          className={`cursor-pointer transition-all ${
            selectedDocument?.id === document.id 
              ? "ring-2 ring-chile-blue bg-blue-50" 
              : "hover:shadow-md"
          }`}
          onClick={() => onSelectDocument(document)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {getStatusIcon(document.status)}
                  <h4 className="font-medium">{document.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{getDocumentTypeName(document.type)}</p>
                <p className="text-xs text-gray-500">
                  Enviado: {new Date(document.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                {getStatusBadge(document.status)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDocument(document);
                  }}
                >
                  <Eye size={14} className="mr-1" />
                  Ver
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Solicitante:</p>
                <p className="font-medium">{document.content?.nombre || "No especificado"}</p>
              </div>
              <div>
                <p className="text-gray-600">RUT:</p>
                <p className="font-medium">{document.content?.rut || "No especificado"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center space-x-4">
                {getVerificationIcon(document.isIdentityVerified)}
                <div className="text-sm">
                  <span className="text-gray-600">Valor: </span>
                  <span className="font-semibold text-chile-red">
                    ${parseFloat(document.price).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {document.content?.email && (
                <div className="text-xs text-gray-500">
                  {document.content.email}
                </div>
              )}
            </div>

            {/* Show content preview for pending documents */}
            {document.status === "pending_certification" && document.content?.contenido && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-600 mb-1">Contenido:</p>
                <p className="text-sm bg-gray-50 p-2 rounded text-gray-700 line-clamp-2">
                  {document.content.contenido.substring(0, 100)}
                  {document.content.contenido.length > 100 && "..."}
                </p>
              </div>
            )}

            {/* Show rejection reason if rejected */}
            {document.status === "rejected" && document.rejectionReason && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-red-600 mb-1">Razón del rechazo:</p>
                <p className="text-sm bg-red-50 p-2 rounded text-red-700">
                  {document.rejectionReason}
                </p>
              </div>
            )}

            {/* Show certification info if certified */}
            {document.status === "certified" && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">
                    Certificado: {document.certifiedAt ? new Date(document.certifiedAt).toLocaleString() : "Fecha no disponible"}
                  </span>
                  {document.qrValidationCode && (
                    <span className="text-gray-500 font-mono">
                      QR: {document.qrValidationCode}
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
