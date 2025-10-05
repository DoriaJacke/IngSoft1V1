import { Event } from '../types';
import { events } from '../data/events';
import { Calendar, MapPin, Clock, Ticket, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

interface EventDetailsProps {
  eventId: string;
  onNavigate: (view: string, eventId?: string) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const event = events.find(e => e.id === eventId);

  if (!event) {
    return <div>Evento no encontrado</div>;
  }

  const handleBuyTicket = () => {
    if (!isAuthenticated) {
      // Si el usuario no está autenticado, redirigir a login
      onNavigate('login', eventId);
    } else {
      // Si está autenticado, ir directo a checkout
      onNavigate('checkout', eventId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a eventos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative h-96 lg:h-auto rounded-lg overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full mb-4">
                {event.category}
              </div>
              <h1 className="mb-2">{event.title}</h1>
              <h2 className="text-muted-foreground">{event.artist}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">Fecha</p>
                  <p>{event.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">Hora</p>
                  <p>{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">Ubicación</p>
                  <p>{event.venue}</p>
                  <p>{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ticket className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">Entradas disponibles</p>
                  <p>{event.availableTickets} tickets</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="mb-3">Descripción</h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground">Precio desde</p>
                  <p className="text-3xl text-primary">
                    ${event.price.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleBuyTicket}
              >
                Compra tu entrada aquí
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
