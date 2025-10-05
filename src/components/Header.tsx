import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <h1 className="text-primary">EventosChile</h1>
          </div>
          
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('login')}
              >
                <User className="w-4 h-4 mr-2" />
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
