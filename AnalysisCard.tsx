import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Calendar, AlertCircle, TrendingUp } from 'lucide-react';

interface AnalysisCardProps {
  analysis: any;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
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

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{analysis.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{analysis.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(analysis.date).toLocaleDateString()}</span>
              </div>
              <span className="text-gray-500">•</span>
              <span>{analysis.type}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getSeverityColor(analysis.severity)}`}>
            {analysis.severity}
          </div>
        </div>

        {/* Summary */}
        <p className="text-gray-300 mb-4 leading-relaxed">{analysis.summary}</p>

        {/* Confidence Score */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-400">Confidence:</span>
          <div className="flex-1 bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-400 h-2 rounded-full transition-all"
              style={{ width: `${analysis.confidence}%` }}
            />
          </div>
          <span className="text-sm text-blue-400 font-medium">{analysis.confidence}%</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Points */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Key Points
              </h4>
              <ul className="space-y-2">
                {analysis.keyPoints.map((point: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Implications */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                Implications
              </h4>
              <p className="text-gray-300 leading-relaxed">{analysis.implications}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};