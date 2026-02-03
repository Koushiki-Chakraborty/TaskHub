import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Menu, LogOut, User } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>
        {/* Placeholder for page title or breadcrumbs */}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block">{user?.name || 'User'}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} title="Logout">
          <LogOut className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
