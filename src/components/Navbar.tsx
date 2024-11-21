import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, MessageSquare, Shield, User, LogOut } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

export default function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const NavLink = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
        ${location.pathname === to 
          ? 'bg-gray-100 text-gray-900' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Link>
  );

  const navContent = (
    <>
      {currentUser ? (
        <>
          <NavLink to="/dashboard" icon={User}>Dashboard</NavLink>
          <NavLink to="/messages" icon={MessageSquare}>Messages</NavLink>
          <NavLink to="/licenses" icon={Shield}>Licenses</NavLink>
          {isAdmin && (
            <NavLink to="/admin" icon={Shield}>Admin</NavLink>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 
                     hover:text-gray-900 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Register</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-gray-800" />
              <span className="text-xl font-bold text-gray-800">ZOOM::SC</span>
            </Link>
          </div>

          {isMobile ? (
            <>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Mobile menu */}
              {isMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 space-y-2 animate-fade-in">
                  {navContent}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {navContent}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}