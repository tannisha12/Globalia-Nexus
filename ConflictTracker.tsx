import React, { useState } from 'react';
import { AlertTriangle, MapPin, Users, Clock, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { ConflictCard } from '../components/ConflictCard';

export const ConflictTracker: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const conflicts = [
    {
      id: 1,
      name: "Iran-Israel-US Escalation",
      region: "Middle East",
      severity: "Critical",
      status: "Active",
      startDate: "2025-01-20",
      casualties: "2,500+",
      displacement: "150K evacuated",
      keyDevelopments: [
        "Iran launches ballistic missile strikes on Israeli military bases",
        "Israel conducts massive airstrikes on Iranian nuclear facilities",
        "US deploys additional carrier strike groups to Persian Gulf",
        "Iran activates proxy forces across Lebanon, Syria, and Iraq",
        "Oil prices surge 40% as Strait of Hormuz threatened with closure",
        "International calls for immediate ceasefire as conflict spreads regionally"
      ],
      trend: "escalating",
      lastUpdate: "2025-01-20"
    },
    {
      id: 2,
      name: "Russia-Ukraine War",
      region: "Eastern Europe",
      severity: "Critical",
      status: "Active",
      startDate: "2022-02-24",
      casualties: "500,000+",
      displacement: "6.2M refugees",
      keyDevelopments: [
        "Winter offensive operations ongoing with focus on energy infrastructure",
        "Western military aid packages worth $50B approved for 2025",
        "Civilian infrastructure systematically targeted in recent campaigns",
        "Diplomatic efforts stalled with no breakthrough in sight",
        "NATO considering additional defensive measures"
      ],
      trend: "escalating",
      lastUpdate: "2025-01-15"
    },
    {
      id: 3,
      name: "India-Pakistan Kashmir Dispute",
      region: "South Asia",
      severity: "High",
      status: "Active",
      startDate: "1947-10-22",
      casualties: "100,000+",
      displacement: "500K displaced",
      keyDevelopments: [
        "Cross-border shelling incidents increased 300% in past month",
        "India deploys additional 50,000 troops along Line of Control",
        "Pakistan activates air defense systems in response",
        "Civilian casualties reported on both sides of border",
        "International community calls for restraint and dialogue"
      ],
      trend: "escalating",
      lastUpdate: "2025-01-15"
    },
    {
      id: 4,
      name: "China-India Border Tensions",
      region: "South Asia",
      severity: "High",
      status: "Active",
      startDate: "1962-10-20",
      casualties: "5,000+",
      displacement: "Limited",
      keyDevelopments: [
        "China constructs 12 new military outposts along LAC",
        "India completes strategic border roads in Ladakh sector",
        "Military face-offs reported in Tawang and Demchok areas",
        "Both nations enhance surveillance and early warning systems",
        "Border personnel meetings show limited progress on disengagement"
      ],
      trend: "stable",
      lastUpdate: "2025-01-15"
    },
    {
      id: 5,
      name: "North Korea Nuclear Crisis",
      region: "East Asia",
      severity: "Critical",
      status: "Active",
      startDate: "2003-01-10",
      casualties: "Unknown",
      displacement: "N/A",
      keyDevelopments: [
        "Missile testing program accelerated with 15 tests in 2024",
        "New uranium enrichment facility operational at Yongbyon",
        "Estimated nuclear arsenal expanded to 70-100 warheads",
        "Submarine-launched ballistic missile capabilities enhanced",
        "Six-party talks remain suspended with no diplomatic progress"
      ],
      trend: "escalating",
      lastUpdate: "2025-01-14"
    },
    {
      id: 6,
      name: "Israel-Palestine Conflict",
      region: "Middle East",
      severity: "High",
      status: "Active",
      startDate: "2023-10-07",
      casualties: "50,000+",
      displacement: "2.1M displaced",
      keyDevelopments: [
        "Ceasefire negotiations ongoing with Egyptian and Qatari mediation",
        "Humanitarian aid corridors established but access remains limited",
        "Regional tensions persist with Iran-backed proxy involvement",
        "International mediation efforts intensify with UN involvement",
        "Reconstruction planning begins despite ongoing hostilities"
      ],
      trend: "stable",
      lastUpdate: "2025-01-14"
    },
    {
      id: 7,
      name: "Sudan Civil War",
      region: "Africa",
      severity: "Critical",
      status: "Active",
      startDate: "2023-04-15",
      casualties: "15,000+",
      displacement: "7.1M displaced",
      keyDevelopments: [
        "RSF controls western regions including parts of Darfur",
        "SAF maintains control of capital Khartoum and eastern regions",
        "Humanitarian crisis deepening with 25M people needing aid",
        "Regional powers UAE and Egypt provide support to different factions",
        "African Union mediation efforts show limited progress"
      ],
      trend: "escalating",
      lastUpdate: "2025-01-13"
    },
    {
      id: 8,
      name: "Ethiopia-Tigray Conflict",
      region: "Africa",
      severity: "High",
      status: "Active",
      startDate: "2020-11-04",
      casualties: "600,000+",
      displacement: "2.5M displaced",
      keyDevelopments: [
        "Ceasefire violations reported despite peace agreement",
        "Humanitarian access remains severely restricted in Tigray",
        "Regional spillover effects destabilize Horn of Africa",
        "2.5 million refugees strain resources in neighboring countries",
        "International mediation continues with AU and UN involvement"
      ],
      trend: "stable",
      lastUpdate: "2025-01-13"
    },
    {
      id: 9,
      name: "Myanmar Civil Conflict",
      region: "Southeast Asia",
      severity: "High",
      status: "Active",
      startDate: "2021-02-01",
      casualties: "4,500+",
      displacement: "1.8M displaced",
      keyDevelopments: [
        "Opposition forces gain control of significant rural territories",
        "Military junta loses control over multiple border regions",
        "ASEAN mediation attempts show limited effectiveness",
        "Economic collapse accelerates with 50% poverty rate",
        "China and India maintain complex relationships with all parties"
      ],
      trend: "escalating",
      lastUpdate: "2025-01-12"
    },
    {
      id: 10,
      name: "Turkey-Greece Aegean Tensions",
      region: "Europe",
      severity: "Medium",
      status: "Active",
      startDate: "1996-01-31",
      casualties: "Limited",
      displacement: "N/A",
      keyDevelopments: [
        "Turkish drilling activities continue in disputed Eastern Mediterranean",
        "Greek military exercises conducted with French naval support",
        "Cyprus energy exploration agreements create additional tensions",
        "EU considers sanctions against Turkey over drilling activities",
        "NATO attempts mediation between two alliance members"
      ],
      trend: "stable",
      lastUpdate: "2025-01-12"
    }
  ];

  const severityLevels = ['all', 'Critical', 'High', 'Medium', 'Low'];
  const regions = ['all', 'Eastern Europe', 'South Asia', 'East Asia', 'Middle East', 'Africa', 'Southeast Asia', 'Europe'];

  const filteredConflicts = conflicts.filter(conflict => {
    const matchesSearch = conflict.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conflict.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || conflict.severity === selectedSeverity;
    const matchesRegion = selectedRegion === 'all' || conflict.region === selectedRegion;
    
    return matchesSearch && matchesSeverity && matchesRegion;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-10 h-10 text-red-400" />
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-red-400 via-orange-300 to-red-500 bg-clip-text">
              Global Conflict Tracker
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Real-time monitoring of active conflicts and crisis situations worldwide
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Active Conflicts</h3>
            </div>
            <p className="text-3xl font-bold text-red-400">{conflicts.length}</p>
            <p className="text-sm text-gray-400">Ongoing situations</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Displaced</h3>
            </div>
            <p className="text-3xl font-bold text-orange-400">22.5M</p>
            <p className="text-sm text-gray-400">People affected</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Regions</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">7</p>
            <p className="text-sm text-gray-400">Affected areas</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Avg Duration</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">8.2</p>
            <p className="text-sm text-gray-400">Years active</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conflicts, regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <div>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              >
                {severityLevels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Severities' : level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredConflicts.length} of {conflicts.length} conflicts
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedSeverity !== 'all' && ` with ${selectedSeverity} severity`}
            {selectedRegion !== 'all' && ` in ${selectedRegion}`}
          </p>
        </div>

        {/* Conflict Cards */}
        <div className="space-y-6">
          {filteredConflicts.length > 0 ? (
            filteredConflicts.map(conflict => (
              <ConflictCard key={conflict.id} conflict={conflict} />
            ))
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No conflicts found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};