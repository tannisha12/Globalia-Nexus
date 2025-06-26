import React from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';

interface WorldMapProps {
  conflicts: any[];
}

export const WorldMap: React.FC<WorldMapProps> = ({ conflicts }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">Global Situation Map</h3>
      </div>
      
      {/* Simplified world map representation */}
      <div className="relative bg-slate-900 rounded-lg p-8 min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
            {/* Conflict hotspots */}
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-medium">Eastern Europe</span>
              </div>
              <p className="text-sm text-gray-300">Russia-Ukraine Conflict</p>
              <p className="text-xs text-red-400">Critical</p>
            </div>
            
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-medium">Middle East</span>
              </div>
              <p className="text-sm text-gray-300">Israel-Palestine</p>
              <p className="text-xs text-orange-400">High</p>
            </div>
            
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-medium">Africa</span>
              </div>
              <p className="text-sm text-gray-300">Sudan Civil War</p>
              <p className="text-xs text-red-400">Critical</p>
            </div>
            
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">East Asia</span>
              </div>
              <p className="text-sm text-gray-300">Taiwan Strait</p>
              <p className="text-xs text-yellow-400">Elevated</p>
            </div>
            
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-medium">Southeast Asia</span>
              </div>
              <p className="text-sm text-gray-300">Myanmar Crisis</p>
              <p className="text-xs text-orange-400">High</p>
            </div>
            
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Monitoring</span>
              </div>
              <p className="text-sm text-gray-300">190+ Regions</p>
              <p className="text-xs text-blue-400">Active</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-400">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-gray-400">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-400">Elevated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-400">Monitoring</span>
        </div>
      </div>
    </div>
  );
};