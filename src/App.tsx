import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { EventDetails } from './components/EventDetails';
import { LoginRegister } from './components/LoginRegister';
import { Checkout } from './components/Checkout';
import { Confirmation } from './components/Confirmation';
import { EventManagement } from './components/EventManagementSimple';
import { ReportsSimple as Reports } from './components/ReportsSimple';

type View = 'home' | 'event' | 'login' | 'checkout' | 'confirmation' | 'management' | 'reports';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [purchaseData, setPurchaseData] = useState<Purchase | undefined>(undefined);

  const handleNavigate = (view: string, eventId?: string, purchase?: Purchase) => {
    setCurrentView(view as View);
    if (eventId) {
      setSelectedEventId(eventId);
    }
    if (purchase) {
      setPurchaseData(purchase);
    }
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('event');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header onNavigate={handleNavigate} />
        
        {currentView === 'home' && (
          <HomePage onSelectEvent={handleSelectEvent} />
        )}
        
        {currentView === 'event' && selectedEventId && (
          <EventDetails 
            eventId={selectedEventId} 
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'login' && (
          <LoginRegister 
            onNavigate={handleNavigate}
            returnEventId={selectedEventId}
          />
        )}
        
        {currentView === 'checkout' && selectedEventId && (
          <Checkout 
            eventId={selectedEventId}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'confirmation' && selectedEventId && (
          <Confirmation 
            eventId={selectedEventId}
            onNavigate={handleNavigate}
            purchaseData={purchaseData}
          />
        )}
        
        {currentView === 'management' && (
          <EventManagement onNavigate={handleNavigate} />
        )}
        
        {currentView === 'reports' && (
          <Reports onNavigate={handleNavigate} />
        )}
      </div>
    </AuthProvider>
  );
}
