import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, Plus, Home, List } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-xl font-bold text-primary-600"
              >
                <List className="h-8 w-8" />
                <span>Wishlist</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {state.auth.user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {state.auth.user?.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
