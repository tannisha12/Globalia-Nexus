import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Play, Pause, RotateCcw, FastForward, Rewind, Globe, Users, Sword, Crown, MapPin, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoricalEvent {
  year: number;
  title: string;
  description: string;
  type: 'war' | 'alliance' | 'empire' | 'revolution' | 'treaty' | 'independence';
  regions: string[];
  significance: 'low' | 'medium' | 'high' | 'critical';
}

interface HistoricalPeriod {
  startYear: number;
  endYear: number;
  name: string;
  description: string;
  keyEvents: HistoricalEvent[];
  majorPowers: string[];
  mapData: {
    empires: { name: string; color: string; territories: string[] }[];
    alliances: { name: string; members: string[]; type: 'military' | 'economic' | 'political' }[];
    conflicts: { name: string; participants: string[]; status: 'ongoing' | 'ended' }[];
  };
}

const historicalPeriods: HistoricalPeriod[] = [
  {
    startYear: 1914,
    endYear: 1918,
    name: "World War I Era",
    description: "The Great War reshapes global power dynamics and destroys old empires",
    keyEvents: [
      {
        year: 1914,
        title: "World War I Begins",
        description: "Assassination of Archduke Franz Ferdinand triggers global conflict",
        type: 'war',
        regions: ['Europe', 'Middle East', 'Africa'],
        significance: 'critical'
      },
      {
        year: 1915,
        title: "Gallipoli Campaign",
        description: "Allied forces attempt to open new front against Ottoman Empire",
        type: 'war',
        regions: ['Turkey', 'Mediterranean'],
        significance: 'high'
      },
      {
        year: 1916,
        title: "Battle of Verdun",
        description: "Longest single battle of WWI, symbol of French determination",
        type: 'war',
        regions: ['France'],
        significance: 'high'
      },
      {
        year: 1917,
        title: "Russian Revolution",
        description: "Bolsheviks overthrow Tsarist regime, Russia exits war",
        type: 'revolution',
        regions: ['Russia', 'Eastern Europe'],
        significance: 'critical'
      },
      {
        year: 1917,
        title: "US Enters War",
        description: "America joins Allied forces, tipping balance of power",
        type: 'alliance',
        regions: ['USA', 'Europe'],
        significance: 'critical'
      },
      {
        year: 1918,
        title: "Ottoman Empire Collapses",
        description: "End of 600-year Ottoman rule, Middle East redrawn",
        type: 'empire',
        regions: ['Middle East', 'Balkans'],
        significance: 'critical'
      }
    ],
    majorPowers: ['British Empire', 'German Empire', 'Russian Empire', 'Ottoman Empire', 'Austria-Hungary', 'France', 'United States'],
    mapData: {
      empires: [
        { name: 'British Empire', color: '#dc2626', territories: ['India', 'Canada', 'Australia', 'Egypt', 'South Africa'] },
        { name: 'German Empire', color: '#1f2937', territories: ['Germany', 'Alsace-Lorraine'] },
        { name: 'Russian Empire', color: '#059669', territories: ['Russia', 'Poland', 'Finland', 'Baltic States'] },
        { name: 'Ottoman Empire', color: '#d97706', territories: ['Turkey', 'Syria', 'Iraq', 'Palestine', 'Arabia'] }
      ],
      alliances: [
        { name: 'Triple Entente', members: ['Britain', 'France', 'Russia'], type: 'military' },
        { name: 'Central Powers', members: ['Germany', 'Austria-Hungary', 'Ottoman Empire'], type: 'military' }
      ],
      conflicts: [
        { name: 'World War I', participants: ['Triple Entente', 'Central Powers'], status: 'ongoing' }
      ]
    }
  },
  {
    startYear: 1939,
    endYear: 1945,
    name: "World War II Era",
    description: "Global conflict between Axis and Allied powers reshapes world order",
    keyEvents: [
      {
        year: 1939,
        title: "World War II Begins",
        description: "Germany invades Poland, triggering global conflict",
        type: 'war',
        regions: ['Europe', 'Asia', 'Africa', 'Pacific'],
        significance: 'critical'
      },
      {
        year: 1940,
        title: "Battle of Britain",
        description: "RAF defeats Luftwaffe, preventing German invasion",
        type: 'war',
        regions: ['Britain'],
        significance: 'critical'
      },
      {
        year: 1941,
        title: "Operation Barbarossa",
        description: "Germany invades Soviet Union, opening Eastern Front",
        type: 'war',
        regions: ['Eastern Europe', 'Russia'],
        significance: 'critical'
      },
      {
        year: 1941,
        title: "Pearl Harbor Attack",
        description: "Japan attacks US naval base, America enters war",
        type: 'war',
        regions: ['Pacific', 'USA'],
        significance: 'critical'
      },
      {
        year: 1943,
        title: "Battle of Stalingrad",
        description: "Turning point on Eastern Front, German advance halted",
        type: 'war',
        regions: ['Russia'],
        significance: 'critical'
      },
      {
        year: 1944,
        title: "D-Day Normandy Landings",
        description: "Allied invasion of Western Europe begins",
        type: 'war',
        regions: ['France'],
        significance: 'critical'
      },
      {
        year: 1945,
        title: "Atomic Bombs Dropped",
        description: "Nuclear weapons used on Hiroshima and Nagasaki",
        type: 'war',
        regions: ['Japan'],
        significance: 'critical'
      }
    ],
    majorPowers: ['United States', 'Soviet Union', 'British Empire', 'Nazi Germany', 'Imperial Japan', 'China', 'France'],
    mapData: {
      empires: [
        { name: 'Nazi Germany', color: '#1f2937', territories: ['Germany', 'Austria', 'Czechoslovakia', 'Poland', 'France', 'Norway'] },
        { name: 'Soviet Union', color: '#dc2626', territories: ['Russia', 'Ukraine', 'Belarus', 'Baltic States', 'Central Asia'] },
        { name: 'British Empire', color: '#2563eb', territories: ['Britain', 'India', 'Canada', 'Australia', 'Egypt'] },
        { name: 'Imperial Japan', color: '#dc2626', territories: ['Japan', 'Korea', 'Manchuria', 'Philippines', 'Indonesia'] }
      ],
      alliances: [
        { name: 'Allied Powers', members: ['USA', 'USSR', 'Britain', 'China', 'France'], type: 'military' },
        { name: 'Axis Powers', members: ['Germany', 'Japan', 'Italy'], type: 'military' }
      ],
      conflicts: [
        { name: 'World War II', participants: ['Allied Powers', 'Axis Powers'], status: 'ongoing' }
      ]
    }
  },
  {
    startYear: 1947,
    endYear: 1991,
    name: "Cold War Era",
    description: "Bipolar world order with US-Soviet rivalry and nuclear standoff",
    keyEvents: [
      {
        year: 1947,
        title: "Cold War Begins",
        description: "Truman Doctrine and Marshall Plan mark start of US-Soviet rivalry",
        type: 'alliance',
        regions: ['Global'],
        significance: 'critical'
      },
      {
        year: 1949,
        title: "NATO Founded",
        description: "Western military alliance formed to counter Soviet threat",
        type: 'alliance',
        regions: ['North America', 'Europe'],
        significance: 'critical'
      },
      {
        year: 1955,
        title: "Warsaw Pact Established",
        description: "Soviet-led military alliance responds to NATO",
        type: 'alliance',
        regions: ['Eastern Europe'],
        significance: 'high'
      },
      {
        year: 1961,
        title: "Berlin Wall Built",
        description: "Physical symbol of Cold War division erected",
        type: 'war',
        regions: ['Germany'],
        significance: 'high'
      },
      {
        year: 1962,
        title: "Cuban Missile Crisis",
        description: "World comes closest to nuclear war during 13-day standoff",
        type: 'war',
        regions: ['Caribbean', 'USA', 'USSR'],
        significance: 'critical'
      },
      {
        year: 1975,
        title: "Vietnam War Ends",
        description: "Communist victory in Southeast Asia, US withdrawal",
        type: 'war',
        regions: ['Southeast Asia'],
        significance: 'high'
      },
      {
        year: 1979,
        title: "Soviet-Afghan War Begins",
        description: "USSR invades Afghanistan, sparking decade-long conflict",
        type: 'war',
        regions: ['Central Asia'],
        significance: 'high'
      },
      {
        year: 1989,
        title: "Berlin Wall Falls",
        description: "Symbol of Cold War division collapses, German reunification begins",
        type: 'revolution',
        regions: ['Germany', 'Eastern Europe'],
        significance: 'critical'
      }
    ],
    majorPowers: ['United States', 'Soviet Union', 'China', 'Britain', 'France', 'West Germany', 'Japan'],
    mapData: {
      empires: [
        { name: 'Soviet Union', color: '#dc2626', territories: ['Russia', 'Ukraine', 'Belarus', 'Central Asia', 'Baltic States'] },
        { name: 'United States', color: '#2563eb', territories: ['USA', 'Puerto Rico', 'Guam'] },
        { name: 'China', color: '#059669', territories: ['China', 'Tibet'] }
      ],
      alliances: [
        { name: 'NATO', members: ['USA', 'Britain', 'France', 'West Germany', 'Italy', 'Canada'], type: 'military' },
        { name: 'Warsaw Pact', members: ['USSR', 'East Germany', 'Poland', 'Czechoslovakia', 'Hungary'], type: 'military' }
      ],
      conflicts: [
        { name: 'Cold War', participants: ['NATO', 'Warsaw Pact'], status: 'ongoing' }
      ]
    }
  },
  {
    startYear: 1991,
    endYear: 2001,
    name: "Post-Cold War Era",
    description: "Unipolar moment with US hegemony and emergence of new conflicts",
    keyEvents: [
      {
        year: 1991,
        title: "Soviet Union Collapses",
        description: "End of communist superpower, 15 new independent states emerge",
        type: 'empire',
        regions: ['Russia', 'Eastern Europe', 'Central Asia'],
        significance: 'critical'
      },
      {
        year: 1991,
        title: "Gulf War",
        description: "US-led coalition liberates Kuwait from Iraqi occupation",
        type: 'war',
        regions: ['Middle East'],
        significance: 'high'
      },
      {
        year: 1995,
        title: "Dayton Peace Accords",
        description: "End of Bosnian War, NATO peacekeeping mission begins",
        type: 'treaty',
        regions: ['Balkans'],
        significance: 'high'
      },
      {
        year: 1999,
        title: "NATO Expansion",
        description: "Former Warsaw Pact countries join Western alliance",
        type: 'alliance',
        regions: ['Eastern Europe'],
        significance: 'high'
      },
      {
        year: 1999,
        title: "Kosovo War",
        description: "NATO intervention in Yugoslav conflict",
        type: 'war',
        regions: ['Balkans'],
        significance: 'medium'
      }
    ],
    majorPowers: ['United States', 'Russia', 'China', 'Germany', 'Japan', 'Britain', 'France'],
    mapData: {
      empires: [
        { name: 'United States', color: '#2563eb', territories: ['USA', 'Puerto Rico', 'Guam'] },
        { name: 'Russian Federation', color: '#dc2626', territories: ['Russia'] },
        { name: 'China', color: '#059669', territories: ['China', 'Hong Kong'] }
      ],
      alliances: [
        { name: 'NATO', members: ['USA', 'Britain', 'France', 'Germany', 'Italy', 'Poland', 'Czech Republic'], type: 'military' },
        { name: 'EU', members: ['Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium'], type: 'economic' }
      ],
      conflicts: [
        { name: 'Yugoslav Wars', participants: ['Serbia', 'Croatia', 'Bosnia'], status: 'ongoing' }
      ]
    }
  },
  {
    startYear: 2001,
    endYear: 2025,
    name: "War on Terror & Multipolar Era",
    description: "Rise of China, return of great power competition, and global terrorism",
    keyEvents: [
      {
        year: 2001,
        title: "9/11 Attacks",
        description: "Terrorist attacks on US trigger global War on Terror",
        type: 'war',
        regions: ['USA', 'Middle East'],
        significance: 'critical'
      },
      {
        year: 2003,
        title: "Iraq War Begins",
        description: "US-led invasion topples Saddam Hussein regime",
        type: 'war',
        regions: ['Middle East'],
        significance: 'high'
      },
      {
        year: 2008,
        title: "Russia-Georgia War",
        description: "Russia reasserts influence in former Soviet space",
        type: 'war',
        regions: ['Caucasus'],
        significance: 'high'
      },
      {
        year: 2011,
        title: "Arab Spring",
        description: "Democratic uprisings sweep across Middle East and North Africa",
        type: 'revolution',
        regions: ['Middle East', 'North Africa'],
        significance: 'high'
      },
      {
        year: 2014,
        title: "Russia Annexes Crimea",
        description: "First forcible annexation in Europe since WWII",
        type: 'war',
        regions: ['Ukraine', 'Russia'],
        significance: 'critical'
      },
      {
        year: 2020,
        title: "COVID-19 Pandemic",
        description: "Global pandemic reshapes international relations",
        type: 'war',
        regions: ['Global'],
        significance: 'critical'
      },
      {
        year: 2022,
        title: "Russia Invades Ukraine",
        description: "Largest European war since WWII, new Cold War begins",
        type: 'war',
        regions: ['Eastern Europe'],
        significance: 'critical'
      },
      {
        year: 2025,
        title: "Iran-Israel-US Escalation",
        description: "Military confrontation threatens regional war in Middle East",
        type: 'war',
        regions: ['Middle East'],
        significance: 'critical'
      }
    ],
    majorPowers: ['United States', 'China', 'Russia', 'India', 'Germany', 'Japan', 'Britain', 'France'],
    mapData: {
      empires: [
        { name: 'United States', color: '#2563eb', territories: ['USA', 'Puerto Rico', 'Guam'] },
        { name: 'China', color: '#dc2626', territories: ['China', 'Hong Kong', 'Macau'] },
        { name: 'Russia', color: '#059669', territories: ['Russia', 'Crimea'] }
      ],
      alliances: [
        { name: 'NATO', members: ['USA', 'Britain', 'France', 'Germany', 'Poland', 'Baltic States'], type: 'military' },
        { name: 'BRICS', members: ['Brazil', 'Russia', 'India', 'China', 'South Africa'], type: 'economic' },
        { name: 'QUAD', members: ['USA', 'India', 'Japan', 'Australia'], type: 'military' }
      ],
      conflicts: [
        { name: 'Russia-Ukraine War', participants: ['Russia', 'Ukraine'], status: 'ongoing' },
        { name: 'Iran-Israel Conflict', participants: ['Iran', 'Israel'], status: 'ongoing' }
      ]
    }
  }
];

const TimelineSlider = ({ 
  currentYear, 
  minYear, 
  maxYear, 
  onYearChange, 
  isPlaying, 
  onPlayPause, 
  onReset, 
  playbackSpeed, 
  onSpeedChange 
}: any) => {
  const progress = ((currentYear - minYear) / (maxYear - minYear)) * 100;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-4 mb-4">
        <Clock className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Time Navigator</h3>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-2xl font-bold text-blue-400">
            {currentYear}
          </div>
          <div className="text-sm text-gray-400">
            Speed: {playbackSpeed}x
          </div>
        </div>
      </div>
      
      <div className="relative mb-6">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #475569 ${progress}%, #475569 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{minYear}</span>
          <span className="text-blue-400 font-medium">{Math.floor((minYear + maxYear) / 2)}</span>
          <span>{maxYear}</span>
        </div>
        
        {/* Progress indicator */}
        <div className="absolute top-0 w-full h-3 pointer-events-none">
          <div 
            className="absolute top-0 w-1 h-3 bg-yellow-400 rounded-full shadow-lg"
            style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onYearChange(Math.max(minYear, currentYear - 10))}
            className="p-2 bg-slate-700 text-gray-400 rounded-lg hover:text-blue-400 transition-colors"
            title="Back 10 years"
          >
            <Rewind size={16} />
          </button>
          <button
            onClick={() => onYearChange(Math.max(minYear, currentYear - 1))}
            className="p-2 bg-slate-700 text-gray-400 rounded-lg hover:text-blue-400 transition-colors"
            title="Back 1 year"
          >
            ⏮
          </button>
          <button
            onClick={onPlayPause}
            className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
              isPlaying ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-green-500 text-white shadow-lg shadow-green-500/30'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => onYearChange(Math.min(maxYear, currentYear + 1))}
            className="p-2 bg-slate-700 text-gray-400 rounded-lg hover:text-blue-400 transition-colors"
            title="Forward 1 year"
          >
            ⏭
          </button>
          <button
            onClick={() => onYearChange(Math.min(maxYear, currentYear + 10))}
            className="p-2 bg-slate-700 text-gray-400 rounded-lg hover:text-blue-400 transition-colors"
            title="Forward 10 years"
          >
            <FastForward size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-2 bg-slate-700 text-gray-400 rounded-lg hover:text-orange-400 transition-colors"
            title="Reset to start"
          >
            <RotateCcw size={16} />
          </button>
          <select
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
            <option value={10}>10x</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const HistoricalMap = ({ period, currentYear }: { period: HistoricalPeriod; currentYear: number }) => {
  const getEventsByYear = (year: number) => {
    return period.keyEvents.filter(event => event.year === year);
  };

  const getEventsUpToYear = (year: number) => {
    return period.keyEvents.filter(event => event.year <= year);
  };

  const currentEvents = getEventsByYear(currentYear);
  const pastEvents = getEventsUpToYear(currentYear);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-bold text-white">World Map - {currentYear}</h3>
        <div className="ml-auto text-sm text-gray-400">
          {pastEvents.length} events occurred by this year
        </div>
      </div>
      
      {/* Simplified World Map Representation */}
      <div className="relative bg-slate-900 rounded-lg p-8 min-h-96 mb-6 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
          {/* Major Powers/Empires */}
          {period.mapData.empires.map((empire, index) => {
            const isActive = currentYear >= period.startYear && currentYear <= period.endYear;
            return (
              <motion.div
                key={empire.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isActive ? 1 : 0.5, 
                  scale: isActive ? 1 : 0.9 
                }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-lg p-4 border-2 transition-all duration-500 ${
                  isActive ? 'shadow-lg' : 'grayscale'
                }`}
                style={{ 
                  backgroundColor: `${empire.color}20`,
                  borderColor: `${empire.color}50`,
                  boxShadow: isActive ? `0 0 20px ${empire.color}30` : 'none'
                }}
              >
                <h4 className="font-bold text-white mb-2">{empire.name}</h4>
                <div className="space-y-1">
                  {empire.territories.slice(0, 3).map((territory) => (
                    <div key={territory} className="text-xs text-gray-300">
                      • {territory}
                    </div>
                  ))}
                  {empire.territories.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{empire.territories.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Connection Lines for Alliances */}
        <div className="absolute inset-0 pointer-events-none">
          {period.mapData.alliances.map((alliance, index) => (
            <motion.div 
              key={alliance.name} 
              className="absolute top-4 right-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                alliance.type === 'military' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                alliance.type === 'economic' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`} style={{ top: `${index * 35}px` }}>
                {alliance.name}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {currentEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-red-500/10 rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Current Year Events */}
      <AnimatePresence>
        {currentEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sword className="w-5 h-5 text-red-400" />
              Major Events in {currentYear}
            </h4>
            {currentEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  event.significance === 'critical' ? 'bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/20' :
                  event.significance === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                  'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-white">{event.title}</h5>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.type === 'war' ? 'bg-red-500/20 text-red-400' :
                    event.type === 'alliance' ? 'bg-blue-500/20 text-blue-400' :
                    event.type === 'empire' ? 'bg-purple-500/20 text-purple-400' :
                    event.type === 'revolution' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <MapPin size={12} />
                  <span>{event.regions.join(', ')}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PeriodSelector = ({ periods, selectedPeriod, onPeriodChange }: any) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <Crown className="w-5 h-5 text-yellow-400" />
      Historical Periods
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {periods.map((period: HistoricalPeriod) => (
        <motion.button
          key={period.name}
          onClick={() => onPeriodChange(period)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-lg border text-left transition-all ${
            selectedPeriod?.name === period.name
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/20'
              : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-slate-500 hover:bg-slate-700/70'
          }`}
        >
          <h4 className="font-semibold mb-1">{period.name}</h4>
          <p className="text-xs text-gray-400 mb-2">
            {period.startYear} - {period.endYear} ({period.endYear - period.startYear + 1} years)
          </p>
          <p className="text-xs">{period.description}</p>
          <div className="mt-2 text-xs text-gray-500">
            {period.keyEvents.length} major events
          </div>
        </motion.button>
      ))}
    </div>
  </div>
);

const NarrationPanel = ({ period, currentYear, isNarrating, onToggleNarration }: any) => {
  const [currentNarrationIndex, setCurrentNarrationIndex] = useState(0);

  const getCurrentNarration = useCallback(() => {
    const yearProgress = (currentYear - period.startYear) / (period.endYear - period.startYear);
    const eventsUpToYear = period.keyEvents.filter(event => event.year <= currentYear);
    const recentEvent = eventsUpToYear[eventsUpToYear.length - 1];
    
    if (yearProgress < 0.2) {
      return `Welcome to the ${period.name}. In ${currentYear}, the world was dominated by major powers including ${period.majorPowers.slice(0, 3).join(', ')}. ${period.description}`;
    } else if (yearProgress < 0.5) {
      return `By ${currentYear}, significant developments were reshaping the global order. ${recentEvent ? `The recent ${recentEvent.title} in ${recentEvent.year} has had major implications for ${recentEvent.regions.join(' and ')}.` : ''} Key alliances like ${period.mapData.alliances[0]?.name} were influencing international relations.`;
    } else if (yearProgress < 0.8) {
      return `The middle period of the ${period.name.toLowerCase()} around ${currentYear} saw intensifying conflicts and changing power dynamics. ${recentEvent ? `The ${recentEvent.title} marked a turning point in global affairs.` : ''} Major powers were repositioning themselves for the challenges ahead.`;
    } else {
      return `As the ${period.name.toLowerCase()} approached its conclusion around ${currentYear}, the foundations were being laid for the next era of global politics. ${recentEvent ? `Recent events like the ${recentEvent.title} would have lasting consequences.` : ''} The world was about to enter a new phase of international relations.`;
    }
  }, [period, currentYear]);

  useEffect(() => {
    if (isNarrating) {
      const interval = setInterval(() => {
        setCurrentNarrationIndex(prev => (prev + 1) % 4);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isNarrating]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          Historical Narration
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleNarration}
            className={`p-2 rounded-lg transition-colors ${
              isNarrating ? 'text-red-400' : 'text-gray-400 hover:text-purple-400'
            }`}
          >
            {isNarrating ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={onToggleNarration}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              isNarrating
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            {isNarrating ? 'Stop' : 'Start'} Narration
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <motion.div 
          key={currentYear}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-700/30 rounded-lg p-4"
        >
          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
            {period.name} - {currentYear}
            {isNarrating && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {getCurrentNarration()}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h5 className="text-sm font-medium text-gray-400 mb-2">Major Powers ({currentYear})</h5>
            <div className="grid grid-cols-2 gap-1">
              {period.majorPowers.slice(0, 6).map((power) => (
                <div key={power} className="text-xs text-gray-300 flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  {power}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-400 mb-2">Active Alliances</h5>
            <div className="space-y-1">
              {period.mapData.alliances.map((alliance) => (
                <div key={alliance.name} className="text-xs text-gray-300 flex items-center gap-1">
                  <div className={`w-1 h-1 rounded-full ${
                    alliance.type === 'military' ? 'bg-red-400' :
                    alliance.type === 'economic' ? 'bg-green-400' : 'bg-blue-400'
                  }`} />
                  {alliance.name} ({alliance.members.length} members)
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TimeTravelMode: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<HistoricalPeriod>(historicalPeriods[2]); // Cold War as default
  const [currentYear, setCurrentYear] = useState(1962); // Cuban Missile Crisis
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isNarrating, setIsNarrating] = useState(false);

  useEffect(() => {
    if (selectedPeriod) {
      const midPoint = selectedPeriod.startYear + Math.floor((selectedPeriod.endYear - selectedPeriod.startYear) / 2);
      setCurrentYear(midPoint);
      setIsPlaying(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedPeriod) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= selectedPeriod.endYear) {
            setIsPlaying(false);
            return selectedPeriod.endYear;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedPeriod, playbackSpeed]);

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    if (isPlaying) setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (selectedPeriod && currentYear >= selectedPeriod.endYear) {
      setCurrentYear(selectedPeriod.startYear);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    if (selectedPeriod) {
      setCurrentYear(selectedPeriod.startYear);
      setIsPlaying(false);
    }
  };

  const handlePeriodChange = (period: HistoricalPeriod) => {
    setSelectedPeriod(period);
    setIsPlaying(false);
    setIsNarrating(false);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const handleToggleNarration = () => {
    setIsNarrating(!isNarrating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-10 h-10 text-blue-400" />
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-blue-500 bg-clip-text">
              Time Travel Mode
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Journey through history and witness how borders, alliances, and conflicts evolved over time with fully interactive controls
          </p>
        </div>

        {/* Period Selector */}
        <PeriodSelector
          periods={historicalPeriods}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        {selectedPeriod && (
          <>
            {/* Timeline Controls */}
            <div className="mb-8">
              <TimelineSlider
                currentYear={currentYear}
                minYear={selectedPeriod.startYear}
                maxYear={selectedPeriod.endYear}
                onYearChange={handleYearChange}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
                playbackSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Historical Map */}
              <div className="lg:col-span-2">
                <HistoricalMap period={selectedPeriod} currentYear={currentYear} />
              </div>

              {/* Narration Panel */}
              <div>
                <NarrationPanel 
                  period={selectedPeriod} 
                  currentYear={currentYear}
                  isNarrating={isNarrating}
                  onToggleNarration={handleToggleNarration}
                />
              </div>
            </div>
          </>
        )}

        {/* Enhanced Features Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-white font-medium mb-1">Smart Navigation</h3>
            <p className="text-gray-400 text-xs">Play/pause, speed control, jump to events</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 text-center">
            <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-medium mb-1">Dynamic Maps</h3>
            <p className="text-gray-400 text-xs">Animated empires and real-time changes</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 text-center">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-white font-medium mb-1">Live Narration</h3>
            <p className="text-gray-400 text-xs">Contextual analysis that adapts to current year</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 text-center">
            <Sword className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h3 className="text-white font-medium mb-1">Event Timeline</h3>
            <p className="text-gray-400 text-xs">Major conflicts and treaties as they happen</p>
          </div>
        </div>
      </div>
    </div>
  );
};