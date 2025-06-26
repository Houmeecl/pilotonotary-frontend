import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, Smartphone, CheckCircle, AlertCircle } from "lucide-react";
import { calculateCommissions } from "@/lib/commissionCalculator";

interface CommissionCalculatorProps {
  documentPrice: number;
  onPaymentComplete: () => void;
}

export default function CommissionCalculator({ documentPrice, onPaymentComplete }: CommissionCalculatorProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const commissions = calculateCommissions(documentPrice);

  const handlePayment = async () => {
    if (!paymentMethod) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompleted(true);
      
      // Complete the payment after a short delay
      setTimeout(() => {
        onPaymentComplete();
      }, 1500);
    }, 2000);
  };

  if (paymentCompleted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">¡Pago Procesado!</h3>
          <p className="text-gray-600 mb-4">
            El documento ha sido enviado para certificación
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              Recibirá notificaciones por correo y WhatsApp cuando el documento esté certificado
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Commission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="text-green-600" />
            <span>Distribución de Comisiones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Vecino (40%)</p>
                <p className="text-xl font-bold text-green-600">
                  ${commissions.vecino.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Certificador (35%)</p>
                <p className="text-xl font-bold text-chile-blue">
                  ${commissions.certificador.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Administración (25%)</p>
                <p className="text-xl font-bold text-chile-red">
                  ${commissions.admin.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total del Documento:</span>
                <span className="text-2xl font-bold text-chile-red">
                  ${documentPrice.toLocaleString()} CLP
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Button
              variant={paymentMethod === "cash" ? "default" : "outline"}
              className="h-20 flex-col space-y-2"
              onClick={() => setPaymentMethod("cash")}
            >
              <DollarSign size={24} />
              <span>Efectivo</span>
            </Button>
            
            <Button
              variant={paymentMethod === "card" ? "default" : "outline"}
              className="h-20 flex-col space-y-2"
              onClick={() => setPaymentMethod("card")}
            >
              <CreditCard size={24} />
              <span>Tarjeta</span>
            </Button>
            
            <Button
              variant={paymentMethod === "transfer" ? "default" : "outline"}
              className="h-20 flex-col space-y-2"
              onClick={() => setPaymentMethod("transfer")}
            >
              <Smartphone size={24} />
              <span>Transferencia</span>
            </Button>
          </div>

          {/* Payment Details */}
          {paymentMethod && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {paymentMethod === "cash" && <DollarSign className="text-blue-600" size={20} />}
                  {paymentMethod === "card" && <CreditCard className="text-blue-600" size={20} />}
                  {paymentMethod === "transfer" && <Smartphone className="text-blue-600" size={20} />}
                  <div>
                    <p className="font-medium text-blue-800">
                      {paymentMethod === "cash" && "Pago en Efectivo"}
                      {paymentMethod === "card" && "Pago con Tarjeta"}
                      {paymentMethod === "transfer" && "Transferencia Móvil"}
                    </p>
                    <p className="text-sm text-blue-700">
                      {paymentMethod === "cash" && "Reciba el efectivo del cliente"}
                      {paymentMethod === "card" && "Procese el pago con el terminal POS"}
                      {paymentMethod === "transfer" && "Cliente realiza transferencia via app móvil"}
                    </p>
                  </div>
                </div>
              </div>

              {/* MercadoPago Integration Simulation */}
              {(paymentMethod === "card" || paymentMethod === "transfer") && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">MercadoPago</p>
                      <p className="text-sm text-blue-100">Procesador de pagos seguro</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    <p>✓ Transacción segura</p>
                    <p>✓ Comisiones automáticas</p>
                    <p>✓ Confirmación instantánea</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Payment Button */}
      <div className="flex justify-center">
        <Button
          onClick={handlePayment}
          disabled={!paymentMethod || isProcessing}
          className="btn-chile min-w-[250px] h-12"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Procesando Pago...
            </>
          ) : (
            `Procesar Pago - $${documentPrice.toLocaleString()}`
          )}
        </Button>
      </div>

      {/* Legal Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-gray-600 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-sm font-medium text-gray-800">
              Información de Facturación
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Las comisiones se distribuyen automáticamente según el modelo de negocio establecido. 
              El documento será enviado para certificación una vez confirmado el pago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
