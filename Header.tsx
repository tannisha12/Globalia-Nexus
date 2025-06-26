import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, BarChart3, AlertTriangle, TrendingUp, Brain, Shield, Headphones, MessageSquare, Gamepad2, Clock } from 'lucide-react';

const GlobeIcon = () => (
  <div className="relative">
    <Globe className="w-8 h-8 text-blue-400" />
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
  </div>
);

export const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/analysis', label: 'Analysis', icon: Brain },
    { path: '/conflicts', label: 'Conflicts', icon: AlertTriangle },
    { path: '/economics', label: 'Economics', icon: TrendingUp },
    { path: '/vulnerabilities', label: 'Vulnerabilities', icon: Shield },
    { path: '/time-travel', label: 'Time Travel', icon: Clock },
    { path: '/vr-interface', label: 'VR/AR', icon: Headphones },
    { path: '/debate', label: 'Debate', icon: MessageSquare },
    { path: '/game', label: 'Game', icon: Gamepad2 },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm shadow-2xl sticky top-0 z-50 border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors group">
            <div className="bg-blue-500/20 p-2 rounded-xl backdrop-blur-sm border border-blue-500/30 group-hover:bg-blue-500/30 transition-all">
              <GlobeIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                GeoPolitics AI
              </h1>
              <p className="text-xs text-gray-400 font-mono">Deep Analysis Engine</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium text-sm ${
                  location.pathname === path
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20'
                }`}
              >
                <Icon size={16} />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};