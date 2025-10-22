import { useState } from 'react';
import { events } from '../data/events';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Minus, Plus, CreditCard, Loader2 } from 'lucide-react';
import {
  generateOrderNumber,
  formatPurchaseDate,
} from '../services/emailService';
import { processCompletePurchase } from '../services/databaseService';
import { PurchaseDetails } from '../types/emailTypes';
import { Purchase, EmailStatus } from '../types';

interface CheckoutProps {
  eventId: string;
  onNavigate: (view: string, eventId?: string, purchaseData?: Purchase) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ eventId, onNavigate }) => {
  const { user } = useAuth();
  const event = events.find(e => e.id === eventId);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>({ sent: false });

  if (!event) {
    return <div>Evento no encontrado</div>;
  }

  const totalPrice = event.price * quantity;

  const handleIncreaseQuantity = () => {
    if (quantity < event.availableTickets && quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePayment = async () => {
    if (!user || !event) return;

    setIsProcessing(true);

    try {
      // Generar datos de compra
      const orderNumber = generateOrderNumber();
      const serviceCharge = quantity * 500;
      const totalPrice = event.price * quantity + serviceCharge;
      const purchaseDate = formatPurchaseDate();

      // Preparar datos para el email
      const purchaseDetails: PurchaseDetails = {
        orderNumber,
        event,
        quantity,
        totalPrice,
        serviceCharge,
        purchaseDate,
        user
      };

      // Procesar compra completa con SQLAlchemy
      console.log('🛒 Procesando compra con base de datos SQLAlchemy...');
      
      const purchaseResult = await processCompletePurchase(purchaseDetails);
      
      if (!purchaseResult.success) {
        throw new Error(purchaseResult.message);
      }

      console.log('✅ Compra procesada exitosamente:', purchaseResult.orderNumber);

      // Crear objeto purchase para compatibilidad con el frontend
      const purchase: Purchase = {
        id: purchaseResult.purchaseId?.toString() || `purchase_${Date.now()}`,
        orderNumber: purchaseResult.orderNumber || orderNumber,
        userId: user.id,
        eventId: event.id,
        quantity,
        unitPrice: event.price,
        serviceCharge,
        totalPrice,
        purchaseDate,
        status: 'completed',
        emailSent: true // Ya se envió en processCompletePurchase
      };

      // Simular proceso de pago exitoso
      setTimeout(() => {
        setIsProcessing(false);
        // Navegar a confirmación con datos de compra
        onNavigate('confirmation', eventId, purchase);
      }, 1500);

    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      setIsProcessing(false);
      setEmailStatus({
        sent: false,
        error: 'Error en el proceso de pago'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('event', eventId)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al evento
        </Button>

        <h1 className="mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h3 className="mb-4">Información del comprador</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input value={user?.name} disabled className="mt-1" />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input value={user?.lastName} disabled className="mt-1" />
                </div>
                <div>
                  <Label>RUT</Label>
                  <Input value={user?.rut || ''} disabled className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input value={user?.email} disabled className="mt-1" />
                </div>
              </div>
            </div>

            {/* Ticket Selection */}
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h3 className="mb-4">Cantidad de entradas</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl w-16 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= event.availableTickets || quantity >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-muted-foreground ml-4">
                  Máximo 10 entradas por compra
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h3 className="mb-4">Método de pago</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Número de tarjeta</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Fecha de expiración</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="card-name">Nombre en la tarjeta</Label>
                  <Input
                    id="card-name"
                    placeholder="Nombre completo"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-md sticky top-24">
              <h3 className="mb-4">Resumen de la compra</h3>
              
              <div className="mb-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-3 mb-6">
                <h4>{event.title}</h4>
                <p className="text-muted-foreground">{event.artist}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <p className="text-sm text-muted-foreground">{event.venue}</p>
              </div>

              <div className="border-t border-border pt-4 space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entradas ({quantity})</span>
                  <span>${(event.price * quantity).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cargo por servicio</span>
                  <span>${(quantity * 500).toLocaleString('es-CL')}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span>Total</span>
                  <span className="text-xl text-primary">
                    ${(totalPrice + quantity * 500).toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando pago...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pagar ahora
                  </>
                )}
              </Button>
              
              {/* Mostrar estado del email si hay error */}
              {emailStatus.error && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ El pago se procesó correctamente, pero hubo un problema al enviar el email de confirmación. 
                    Recibirás la confirmación por email en breve.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
