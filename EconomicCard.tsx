import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface EconomicCardProps {
  data: any;
}

export const EconomicCard: React.FC<EconomicCardProps> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'positive' ? 
      <TrendingUp className="w-4 h-4 text-green-400" /> : 
      <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{data.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{data.region}</span>
              <span>•</span>
              <span>{data.type}</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(data.trend)}
                <span className="capitalize">{data.trend} trend</span>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getImpactColor(data.impact)}`}>
            {data.impact} Impact
          </div>
        </div>

        {/* Summary */}
        <p className="text-gray-300 mb-4 leading-relaxed">{data.summary}</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {Object.entries(data.keyMetrics).map(([key, value]) => (
            <div key={key} className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{key}</p>
              <p className={`text-sm font-semibold ${
                typeof value === 'string' && value.includes('-') ? 'text-red-400' :
                typeof value === 'string' && value.includes('+') ? 'text-green-400' :
                'text-blue-400'
              }`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>{expanded ? 'Show Less' : 'Show Implications'}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-slate-700 p-6 bg-slate-800/30">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Economic Implications
            </h4>
            <ul className="space-y-2">
              {data.implications.map((implication: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  <span>{implication}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              Last updated: {new Date(data.lastUpdate).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};