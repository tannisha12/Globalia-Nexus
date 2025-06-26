import React from 'react';
import { Clock, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

interface NewsCardProps {
  item: any;
  type: 'analysis' | 'conflict';
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, type }) => {
  const getIcon = () => {
    return type === 'analysis' ? 
      <TrendingUp className="w-4 h-4 text-blue-400" /> : 
      <AlertTriangle className="w-4 h-4 text-red-400" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-all">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium mb-1 line-clamp-2">
            {item.title || item.name}
          </h4>
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
            {item.summary || item.keyDevelopments?.[0]}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{item.region}</span>
            </div>
            {item.severity && (
              <span className={getSeverityColor(item.severity)}>
                {item.severity}
              </span>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(item.date || item.lastUpdate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};