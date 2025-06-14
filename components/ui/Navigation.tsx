
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calendar, MessageSquare, BarChart } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: BarChart3 },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/feedback', label: 'Feedback', icon: MessageSquare },
    { path: '/analytics', label: 'Analytics', icon: BarChart }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-ibm-blue-60 p-2 rounded">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">EventSync</h1>
          </Link>
          <nav className="flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-ibm-blue-60'
                      : 'text-gray-600 hover:text-ibm-blue-60 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
