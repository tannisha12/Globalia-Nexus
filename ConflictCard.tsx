import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Calendar, Users, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface ConflictCardProps {
  conflict: any;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict }) => {
  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'escalating':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'de-escalating':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      default:
        return <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>;
    }
  };

  const getDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{conflict.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{conflict.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Duration: {getDuration(conflict.startDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(conflict.trend)}
                <span className="capitalize">{conflict.trend}</span>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getSeverityColor(conflict.severity)}`}>
            {conflict.severity}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-400">Casualties</span>
            </div>
            <p className="text-lg font-semibold text-red-400">{conflict.casualties}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-400">Displaced</span>
            </div>
            <p className="text-lg font-semibold text-orange-400">{conflict.displacement}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 md:col-span-1 col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${conflict.status === 'Active' ? 'bg-red-400' : 'bg-green-400'}`} />
              <span className="text-sm text-gray-400">Status</span>
            </div>
            <p className={`text-lg font-semibold ${conflict.status === 'Active' ? 'text-red-400' : 'text-green-400'}`}>
              {conflict.status}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>{expanded ? 'Show Less' : 'Show Details'}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-slate-700 p-6 bg-slate-800/30">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Recent Developments
            </h4>
            <ul className="space-y-2">
              {conflict.keyDevelopments.map((development: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <span>{development}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              Last updated: {new Date(conflict.lastUpdate).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};