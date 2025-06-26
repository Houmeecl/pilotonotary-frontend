import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, User, Building } from "lucide-react";

interface DocumentFormProps {
  documentType: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function DocumentForm({ documentType, onSubmit, isLoading }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: "",
    contenido: "",
    // Campos específicos para finiquito laboral
    empleador: "",
    cargo: "",
    fechaIngreso: "",
    fechaTermino: "",
    motivo: "",
    // Campos específicos para contrato simple
    contraparte: "",
    objeto: "",
    valor: "",
    plazo: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim() || !formData.rut.trim() || !formData.email.trim()) {
      return;
    }

    onSubmit(formData);
  };

  const getDocumentIcon = () => {
    switch (documentType) {
      case "declaracion_jurada":
        return <FileText className="text-blue-600" size={24} />;
      case "finiquito_laboral":
        return <Building className="text-green-600" size={24} />;
      case "contrato_simple":
        return <User className="text-purple-600" size={24} />;
      default:
        return <FileText className="text-gray-600" size={24} />;
    }
  };

  const getDocumentTitle = () => {
    switch (documentType) {
      case "declaracion_jurada":
        return "Declaración Jurada";
      case "finiquito_laboral":
        return "Finiquito Laboral";
      case "contrato_simple":
        return "Contrato Simple";
      default:
        return "Documento";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b">
        {getDocumentIcon()}
        <div>
          <h3 className="text-lg font-semibold">{getDocumentTitle()}</h3>
          <p className="text-sm text-gray-600">Complete todos los campos obligatorios</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Información Personal</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-field">
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Juan Pérez González"
                required
              />
            </div>
            
            <div className="form-field">
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                value={formData.rut}
                onChange={(e) => handleChange("rut", e.target.value)}
                placeholder="12.345.678-9"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-field">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="juan@ejemplo.com"
                required
              />
            </div>
            
            <div className="form-field">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          <div className="form-field">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              placeholder="Av. Principal 123, Comuna, Región"
            />
          </div>
        </div>

        {/* Campos específicos para Finiquito Laboral */}
        {documentType === "finiquito_laboral" && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Información Laboral</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-field">
                <Label htmlFor="empleador">Empleador</Label>
                <Input
                  id="empleador"
                  value={formData.empleador}
                  onChange={(e) => handleChange("empleador", e.target.value)}
                  placeholder="Empresa ABC S.A."
                />
              </div>
              
              <div className="form-field">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => handleChange("cargo", e.target.value)}
                  placeholder="Vendedor"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="form-field">
                <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                <Input
                  id="fechaIngreso"
                  type="date"
                  value={formData.fechaIngreso}
                  onChange={(e) => handleChange("fechaIngreso", e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <Label htmlFor="fechaTermino">Fecha de Término</Label>
                <Input
                  id="fechaTermino"
                  type="date"
                  value={formData.fechaTermino}
                  onChange={(e) => handleChange("fechaTermino", e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <Label htmlFor="motivo">Motivo de Término</Label>
                <Select onValueChange={(value) => handleChange("motivo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="renuncia">Renuncia Voluntaria</SelectItem>
                    <SelectItem value="despido">Despido</SelectItem>
                    <SelectItem value="termino_contrato">Término de Contrato</SelectItem>
                    <SelectItem value="mutuo_acuerdo">Mutuo Acuerdo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Campos específicos para Contrato Simple */}
        {documentType === "contrato_simple" && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Información del Contrato</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-field">
                <Label htmlFor="contraparte">Contraparte</Label>
                <Input
                  id="contraparte"
                  value={formData.contraparte}
                  onChange={(e) => handleChange("contraparte", e.target.value)}
                  placeholder="Nombre de la otra parte"
                />
              </div>
              
              <div className="form-field">
                <Label htmlFor="valor">Valor del Contrato</Label>
                <Input
                  id="valor"
                  value={formData.valor}
                  onChange={(e) => handleChange("valor", e.target.value)}
                  placeholder="$1.000.000"
                />
              </div>
            </div>

            <div className="form-field">
              <Label htmlFor="objeto">Objeto del Contrato</Label>
              <Input
                id="objeto"
                value={formData.objeto}
                onChange={(e) => handleChange("objeto", e.target.value)}
                placeholder="Prestación de servicios de..."
              />
            </div>

            <div className="form-field">
              <Label htmlFor="plazo">Plazo de Ejecución</Label>
              <Input
                id="plazo"
                value={formData.plazo}
                onChange={(e) => handleChange("plazo", e.target.value)}
                placeholder="30 días"
              />
            </div>
          </div>
        )}

        {/* Contenido del documento */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {documentType === "declaracion_jurada" ? "Contenido de la Declaración" : 
             documentType === "finiquito_laboral" ? "Detalles Adicionales" :
             "Términos y Condiciones"}
          </h4>
          
          <div className="form-field">
            <Label htmlFor="contenido">
              {documentType === "declaracion_jurada" ? "Declare bajo juramento que:" : "Descripción:"}
            </Label>
            <Textarea
              id="contenido"
              value={formData.contenido}
              onChange={(e) => handleChange("contenido", e.target.value)}
              rows={6}
              placeholder={
                documentType === "declaracion_jurada" 
                  ? "Detalle aquí el contenido de su declaración jurada..."
                  : documentType === "finiquito_laboral"
                  ? "Detalles adicionales sobre el finiquito..."
                  : "Términos y condiciones específicas del contrato..."
              }
              required
            />
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Aviso Legal:</strong> Este documento será certificado digitalmente conforme a la 
            Ley N° 19.799 sobre Documentos Electrónicos y Firma Electrónica de Chile. 
            La información proporcionada debe ser veraz y completa.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="btn-chile min-w-[200px]"
          >
            {isLoading ? "Procesando..." : "Continuar con Verificación"}
          </Button>
        </div>
      </form>
    </div>
  );
}
