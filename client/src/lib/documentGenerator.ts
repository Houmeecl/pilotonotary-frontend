interface DocumentData {
  id: number;
  title: string;
  type: string;
  content: any;
  submitterId: string;
  certificadorId?: string;
  price: string;
  status: string;
  isIdentityVerified: boolean;
  digitalSignature?: string;
  qrValidationCode?: string;
  createdAt: string;
  certifiedAt?: string;
}

interface PDFGenerationOptions {
  includeHeader?: boolean;
  includeFooter?: boolean;
  watermark?: boolean;
}

export class DocumentGenerator {
  /**
   * Generate a PDF document from document data
   * In a real implementation, this would use a PDF library like jsPDF or PDFKit
   */
  static generatePDF(document: DocumentData, options: PDFGenerationOptions = {}): Blob {
    const {
      includeHeader = true,
      includeFooter = true,
      watermark = document.status !== "certified"
    } = options;

    // This is a simulation - in production, use a proper PDF library
    const htmlContent = this.generateHTMLContent(document, {
      includeHeader,
      includeFooter,
      watermark
    });

    // Convert HTML to Blob (simulated)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return blob;
  }

  /**
   * Generate HTML content for the document
   */
  private static generateHTMLContent(
    document: DocumentData,
    options: { includeHeader: boolean; includeFooter: boolean; watermark: boolean }
  ): string {
    const { includeHeader, includeFooter, watermark } = options;

    const documentTypeName = this.getDocumentTypeName(document.type);
    const formattedDate = new Date(document.createdAt).toLocaleDateString('es-CL');
    const certifiedDate = document.certifiedAt ? new Date(document.certifiedAt).toLocaleDateString('es-CL') : null;

    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${document.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #D52B1E;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #D52B1E;
          }
          .document-title {
            font-size: 20px;
            margin: 20px 0;
            font-weight: bold;
          }
          .content {
            margin: 30px 0;
            line-height: 1.8;
          }
          .signature-section {
            margin-top: 50px;
            border-top: 1px solid #ccc;
            padding-top: 20px;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72px;
            color: rgba(255, 0, 0, 0.1);
            font-weight: bold;
            z-index: -1;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .info-table td {
            padding: 8px;
            border-bottom: 1px solid #eee;
          }
          .info-table td:first-child {
            font-weight: bold;
            width: 150px;
          }
          .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
    `;

    // Add watermark if needed
    if (watermark) {
      html += `<div class="watermark">BORRADOR</div>`;
    }

    // Add header
    if (includeHeader) {
      html += `
        <div class="header">
          <div class="logo">NotaryPro + VecinoXpress</div>
          <p>Certificación Digital de Documentos Legales</p>
          <div class="document-title">${documentTypeName}</div>
        </div>
      `;
    }

    // Add document information
    html += `
      <table class="info-table">
        <tr>
          <td>Documento ID:</td>
          <td>${document.id}</td>
        </tr>
        <tr>
          <td>Fecha de Creación:</td>
          <td>${formattedDate}</td>
        </tr>
        <tr>
          <td>Solicitante:</td>
          <td>${document.content?.nombre || 'No especificado'}</td>
        </tr>
        <tr>
          <td>RUT:</td>
          <td>${document.content?.rut || 'No especificado'}</td>
        </tr>
        ${document.content?.email ? `
        <tr>
          <td>Email:</td>
          <td>${document.content.email}</td>
        </tr>
        ` : ''}
        ${certifiedDate ? `
        <tr>
          <td>Fecha de Certificación:</td>
          <td>${certifiedDate}</td>
        </tr>
        ` : ''}
      </table>
    `;

    // Add specific content based on document type
    html += this.generateTypeSpecificContent(document);

    // Add main content
    html += `
      <div class="content">
        <h3>Contenido del Documento:</h3>
        <p>${document.content?.contenido || 'No hay contenido disponible'}</p>
      </div>
    `;

    // Add signature section if certified
    if (document.status === "certified" && document.digitalSignature) {
      html += `
        <div class="signature-section">
          <h3>Certificación Digital</h3>
          <p><strong>Estado:</strong> Documento Certificado</p>
          <p><strong>Firma Digital:</strong> ${document.digitalSignature}</p>
          ${document.qrValidationCode ? `
          <div class="qr-section">
            <h4>Código de Validación QR</h4>
            <p><strong>${document.qrValidationCode}</strong></p>
            <p style="font-size: 12px;">Utilice este código para verificar la autenticidad del documento</p>
          </div>
          ` : ''}
        </div>
      `;
    }

    // Add footer
    if (includeFooter) {
      html += `
        <div class="footer">
          <p><strong>NotaryPro + VecinoXpress</strong></p>
          <p>Este documento cumple con la Ley N° 19.799 sobre Documentos Electrónicos y Firma Electrónica de Chile.</p>
          <p>Todos los documentos generados son legalmente válidos bajo las normativas vigentes.</p>
          <p>NotaryPro no es una notaría ni reemplaza funciones notariales, sino que actúa como certificador digital conforme a la ley.</p>
          ${certifiedDate ? `<p>Documento certificado digitalmente el ${certifiedDate}</p>` : ''}
        </div>
      `;
    }

    html += `
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Generate type-specific content for different document types
   */
  private static generateTypeSpecificContent(document: DocumentData): string {
    let html = '';

    switch (document.type) {
      case "finiquito_laboral":
        if (document.content) {
          html += `
            <div class="content">
              <h3>Información Laboral:</h3>
              <table class="info-table">
                ${document.content.empleador ? `
                <tr>
                  <td>Empleador:</td>
                  <td>${document.content.empleador}</td>
                </tr>
                ` : ''}
                ${document.content.cargo ? `
                <tr>
                  <td>Cargo:</td>
                  <td>${document.content.cargo}</td>
                </tr>
                ` : ''}
                ${document.content.fechaIngreso ? `
                <tr>
                  <td>Fecha de Ingreso:</td>
                  <td>${new Date(document.content.fechaIngreso).toLocaleDateString('es-CL')}</td>
                </tr>
                ` : ''}
                ${document.content.fechaTermino ? `
                <tr>
                  <td>Fecha de Término:</td>
                  <td>${new Date(document.content.fechaTermino).toLocaleDateString('es-CL')}</td>
                </tr>
                ` : ''}
                ${document.content.motivo ? `
                <tr>
                  <td>Motivo de Término:</td>
                  <td>${document.content.motivo}</td>
                </tr>
                ` : ''}
              </table>
            </div>
          `;
        }
        break;

      case "contrato_simple":
        if (document.content) {
          html += `
            <div class="content">
              <h3>Información del Contrato:</h3>
              <table class="info-table">
                ${document.content.contraparte ? `
                <tr>
                  <td>Contraparte:</td>
                  <td>${document.content.contraparte}</td>
                </tr>
                ` : ''}
                ${document.content.objeto ? `
                <tr>
                  <td>Objeto del Contrato:</td>
                  <td>${document.content.objeto}</td>
                </tr>
                ` : ''}
                ${document.content.valor ? `
                <tr>
                  <td>Valor:</td>
                  <td>${document.content.valor}</td>
                </tr>
                ` : ''}
                ${document.content.plazo ? `
                <tr>
                  <td>Plazo de Ejecución:</td>
                  <td>${document.content.plazo}</td>
                </tr>
                ` : ''}
              </table>
            </div>
          `;
        }
        break;

      default:
        // For declaracion_jurada and other types, no additional content needed
        break;
    }

    return html;
  }

  /**
   * Get document type display name
   */
  private static getDocumentTypeName(type: string): string {
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
  }

  /**
   * Download a document as PDF
   */
  static downloadDocument(document: DocumentData, filename?: string): void {
    const blob = this.generatePDF(document);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${document.title}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Validate document data before generation
   */
  static validateDocument(document: DocumentData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!document.title) {
      errors.push("El título del documento es obligatorio");
    }

    if (!document.content?.nombre) {
      errors.push("El nombre del solicitante es obligatorio");
    }

    if (!document.content?.rut) {
      errors.push("El RUT del solicitante es obligatorio");
    }

    if (!document.content?.contenido) {
      errors.push("El contenido del documento es obligatorio");
    }

    if (document.type === "finiquito_laboral") {
      if (!document.content?.empleador) {
        errors.push("El empleador es obligatorio para finiquitos laborales");
      }
    }

    if (document.type === "contrato_simple") {
      if (!document.content?.contraparte) {
        errors.push("La contraparte es obligatoria para contratos");
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
