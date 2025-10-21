import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { EventDetails } from './components/EventDetails';
import { LoginRegister } from './components/LoginRegister';
import { Checkout } from './components/Checkout';
import { Confirmation } from './components/Confirmation';
import TestPage from './components/TestPage';
import { Purchase } from './types';

type View = 'home' | 'event' | 'login' | 'checkout' | 'confirmation' | 'test';

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
        
        {/* Botón de acceso rápido al test */}
        <div style={{ 
          position: 'fixed', 
          top: '80px', 
          right: '20px', 
          zIndex: 1000 
        }}>
          <button
            onClick={() => setCurrentView('test')}
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            🧪 Test Email/PDF
          </button>
        </div>
        
        {currentView === 'home' && (
          <HomePage onSelectEvent={handleSelectEvent} />
        )}
        
        {currentView === 'test' && (
          <TestPage />
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
      </div>
    </AuthProvider>
  );
}
