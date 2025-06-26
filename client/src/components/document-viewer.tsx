import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, Mail, MessageCircle, QrCode, FileText, Calendar, User, Shield } from "lucide-react";

interface DocumentViewerProps {
  document: any;
  onClose: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="status-draft">Borrador</Badge>;
      case "pending_verification":
        return <Badge className="status-pending">Verificando Identidad</Badge>;
      case "pending_certification":
        return <Badge className="status-pending">Pendiente Certificación</Badge>;
      case "certified":
        return <Badge className="status-certified">Certificado</Badge>;
      case "rejected":
        return <Badge className="status-rejected">Rechazado</Badge>;
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

  const handleDownload = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${document.title}.pdf`;
    link.click();
  };

  const handleSendEmail = () => {
    // Simulate email sending
    console.log('Sending document via email to:', document.content?.email);
  };

  const handleSendWhatsApp = () => {
    // Simulate WhatsApp sending
    console.log('Sending document via WhatsApp');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="text-purple-600" />
            <span>Detalles del Documento</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{document.title}</h3>
            {getStatusBadge(document.status)}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{getDocumentTypeName(document.type)}</span>
            <span>•</span>
            <span>ID: {document.id}</span>
          </div>
        </div>

        {/* Document Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Información del Solicitante</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <User size={14} className="text-gray-500" />
                <span><strong>Nombre:</strong> {document.content?.nombre || "No especificado"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={14} className="text-gray-500" />
                <span><strong>RUT:</strong> {document.content?.rut || "No especificado"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-gray-500" />
                <span><strong>Email:</strong> {document.content?.email || "No especificado"}</span>
              </div>
              {document.content?.telefono && (
                <div className="flex items-center space-x-2">
                  <MessageCircle size={14} className="text-gray-500" />
                  <span><strong>Teléfono:</strong> {document.content.telefono}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Detalles del Documento</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-gray-500" />
                <span><strong>Creado:</strong> {new Date(document.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText size={14} className="text-gray-500" />
                <span><strong>Precio:</strong> ${parseFloat(document.price).toLocaleString()} CLP</span>
              </div>
              {document.certifiedAt && (
                <div className="flex items-center space-x-2">
                  <Shield size={14} className="text-gray-500" />
                  <span><strong>Certificado:</strong> {new Date(document.certifiedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Estado de Verificación</h4>
          <div className="flex items-center space-x-2">
            {document.isIdentityVerified ? (
              <>
                <Shield className="text-green-600" size={16} />
                <span className="text-green-600 text-sm font-medium">Identidad Verificada</span>
              </>
            ) : (
              <>
                <Shield className="text-red-600" size={16} />
                <span className="text-red-600 text-sm font-medium">Identidad No Verificada</span>
              </>
            )}
          </div>
        </div>

        {/* Document Content */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Contenido del Documento</h4>
          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {document.content?.contenido || "No hay contenido disponible"}
            </p>
          </div>
        </div>

        {/* Additional Fields for Finiquito Laboral */}
        {document.type === "finiquito_laboral" && document.content && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Información Laboral</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {document.content.empleador && (
                <div><strong>Empleador:</strong> {document.content.empleador}</div>
              )}
              {document.content.cargo && (
                <div><strong>Cargo:</strong> {document.content.cargo}</div>
              )}
              {document.content.fechaIngreso && (
                <div><strong>Fecha Ingreso:</strong> {new Date(document.content.fechaIngreso).toLocaleDateString()}</div>
              )}
              {document.content.fechaTermino && (
                <div><strong>Fecha Término:</strong> {new Date(document.content.fechaTermino).toLocaleDateString()}</div>
              )}
              {document.content.motivo && (
                <div><strong>Motivo:</strong> {document.content.motivo}</div>
              )}
            </div>
          </div>
        )}

        {/* Additional Fields for Contrato Simple */}
        {document.type === "contrato_simple" && document.content && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Información del Contrato</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {document.content.contraparte && (
                <div><strong>Contraparte:</strong> {document.content.contraparte}</div>
              )}
              {document.content.objeto && (
                <div><strong>Objeto:</strong> {document.content.objeto}</div>
              )}
              {document.content.valor && (
                <div><strong>Valor:</strong> {document.content.valor}</div>
              )}
              {document.content.plazo && (
                <div><strong>Plazo:</strong> {document.content.plazo}</div>
              )}
            </div>
          </div>
        )}

        {/* Digital Signature Info */}
        {document.digitalSignature && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Firma Digital</h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800 font-mono break-all">
                {document.digitalSignature}
              </p>
            </div>
          </div>
        )}

        {/* QR Validation Code */}
        {document.qrValidationCode && document.status === "certified" && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Código de Validación</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <QrCode className="text-blue-600" size={16} />
                <span className="text-sm font-mono text-blue-800">
                  {document.qrValidationCode}
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Utilice este código para verificar la autenticidad del documento
              </p>
            </div>
          </div>
        )}

        {/* Rejection Reason */}
        {document.status === "rejected" && document.rejectionReason && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Razón del Rechazo</h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                {document.rejectionReason}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {document.status === "certified" && (
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button onClick={handleDownload} className="btn-chile">
              <Download className="mr-2" size={16} />
              Descargar PDF
            </Button>
            <Button onClick={handleSendEmail} variant="outline">
              <Mail className="mr-2" size={16} />
              Enviar por Email
            </Button>
            <Button onClick={handleSendWhatsApp} variant="outline">
              <MessageCircle className="mr-2" size={16} />
              Enviar WhatsApp
            </Button>
          </div>
        )}

        {/* Legal Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            <strong>Documento Electrónico:</strong> Este documento cumple con la Ley N° 19.799 
            sobre Documentos Electrónicos y Firma Electrónica de Chile. Su validez legal es 
            equivalente a un documento físico.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
