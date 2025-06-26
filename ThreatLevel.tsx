import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

interface ThreatLevelProps {
  level: number; // 1-5 scale
}

export const ThreatLevel: React.FC<ThreatLevelProps> = ({ level }) => {
  const getThreatInfo = (level: number) => {
    switch (level) {
      case 1:
        return { color: 'green', text: 'Low', description: 'Minimal global tensions' };
      case 2:
        return { color: 'blue', text: 'Guarded', description: 'Some regional concerns' };
      case 3:
        return { color: 'yellow', text: 'Elevated', description: 'Heightened tensions' };
      case 4:
        return { color: 'orange', text: 'High', description: 'Multiple active conflicts' };
      case 5:
        return { color: 'red', text: 'Critical', description: 'Severe global instability' };
      default:
        return { color: 'gray', text: 'Unknown', description: 'Assessment pending' };
    }
  };

  const threat = getThreatInfo(level);
  const colorClasses = {
    green: 'text-green-400 bg-green-500/20 border-green-500/30',
    blue: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    orange: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    red: 'text-red-400 bg-red-500/20 border-red-500/30',
    gray: 'text-gray-400 bg-gray-500/20 border-gray-500/30'
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700`}>
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">Global Threat Level</h3>
      </div>
      
      <div className={`${colorClasses[threat.color as keyof typeof colorClasses]} rounded-lg p-4 border`}>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className={`w-8 h-8 ${threat.color === 'green' ? 'text-green-400' : 
            threat.color === 'blue' ? 'text-blue-400' :
            threat.color === 'yellow' ? 'text-yellow-400' :
            threat.color === 'orange' ? 'text-orange-400' :
            threat.color === 'red' ? 'text-red-400' : 'text-gray-400'}`} />
          <div>
            <p className={`text-2xl font-bold ${threat.color === 'green' ? 'text-green-400' : 
              threat.color === 'blue' ? 'text-blue-400' :
              threat.color === 'yellow' ? 'text-yellow-400' :
              threat.color === 'orange' ? 'text-orange-400' :
              threat.color === 'red' ? 'text-red-400' : 'text-gray-400'}`}>
              {threat.text}
            </p>
            <p className="text-sm text-gray-300">{threat.description}</p>
          </div>
        </div>
        
        {/* Threat level indicator */}
        <div className="flex gap-1 mt-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded ${
                i <= level 
                  ? threat.color === 'green' ? 'bg-green-400' :
                    threat.color === 'blue' ? 'bg-blue-400' :
                    threat.color === 'yellow' ? 'bg-yellow-400' :
                    threat.color === 'orange' ? 'bg-orange-400' :
                    threat.color === 'red' ? 'bg-red-400' : 'bg-gray-400'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        {/* Current Threat Factors */}
        <div className="mt-4 text-sm text-gray-300">
          <p className="font-medium mb-2">Current factors:</p>
          <ul className="space-y-1 text-xs">
            <li>• Iran-Israel-US military escalation</li>
            <li>• Russia-Ukraine conflict ongoing</li>
            <li>• India-Pakistan Kashmir tensions</li>
            <li>• North Korea nuclear program</li>
            <li>• Multiple economic crises</li>
          </ul>
        </div>
      </div>
    </div>
  );
};