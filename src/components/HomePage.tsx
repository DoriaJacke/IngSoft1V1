import { Event } from '../types';
import { events } from '../data/events';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface HomePageProps {
  onSelectEvent: (eventId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectEvent }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1543147012-c049aefea8a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NTk1MjczMDV8MA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl mb-4">Encuentra tu evento</h1>
            <p className="text-xl">Descubre los mejores conciertos y eventos en Chile</p>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="mb-8">Eventos destacados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => onSelectEvent(event.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  {event.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="mb-2">{event.title}</h3>
                <p className="text-muted-foreground mb-4">{event.artist}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date} - {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.venue}, {event.location}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-primary">
                    Desde ${event.price.toLocaleString('es-CL')}
                  </span>
                  <Button size="sm">
                    Ver detalles
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
