import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

export default function NotFound() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertTriangle className="w-16 h-16 text-gray-400 mb-4" />
      <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-800 mb-2`}>
        Page Not Found
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg
                 hover:bg-gray-700 transition-colors duration-200"
      >
        <Home className="w-5 h-5" />
        <span>Return Home</span>
      </Link>
    </div>
  );
}