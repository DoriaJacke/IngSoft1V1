import { events } from '../data/events';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { CheckCircle, Download, Calendar, MapPin, Mail, AlertCircle } from 'lucide-react';
import { Purchase } from '../types';

interface ConfirmationProps {
  eventId: string;
  onNavigate: (view: string) => void;
  purchaseData?: Purchase;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ 
  eventId, 
  onNavigate, 
  purchaseData 
}) => {
  const { user } = useAuth();
  const event = events.find(e => e.id === eventId);

  if (!event) {
    return <div>Evento no encontrado</div>;
  }

  // Usar datos de compra si están disponibles, sino generar datos por defecto
  const orderNumber = purchaseData?.orderNumber || `ORD-${Date.now()}`;
  const emailSent = purchaseData?.emailSent ?? true;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="mb-4">¡Compra exitosa!</h1>
          
          {/* Estado del email */}
          <div className="mb-6">
            {emailSent ? (
              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <Mail className="w-5 h-5" />
                <span className="text-sm">Email de confirmación enviado</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-yellow-600 mb-4">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Email de confirmación pendiente</span>
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground mb-8">
            Tu compra ha sido procesada correctamente. 
            {emailSent 
              ? `Hemos enviado un email de confirmación a ${user?.email}` 
              : `Recibirás un email de confirmación en ${user?.email} en breve`
            }
          </p>

          <div className="bg-muted rounded-lg p-6 mb-8 text-left">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Número de orden</p>
                <p className="text-lg">{orderNumber}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2">{event.title}</h3>
                <p className="text-muted-foreground">{event.artist}</p>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">Fecha y hora</p>
                  <p>{event.date} - {event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">Ubicación</p>
                  <p>{event.venue}, {event.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => onNavigate('home')}
            >
              Volver al inicio
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onNavigate('home')}
            >
              Ver detalles del evento
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-2">
            ¿Tienes alguna pregunta? Contáctanos a soporte@eventoschile.cl
          </p>
          {!emailSent && (
            <p className="text-sm text-yellow-600">
              Si no recibes el email en los próximos minutos, revisa tu carpeta de spam
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
