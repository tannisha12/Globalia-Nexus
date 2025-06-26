import React, { useState } from 'react';
import { Brain, Search, Filter, Calendar, Globe, TrendingUp, AlertCircle } from 'lucide-react';
import { AnalysisCard } from '../components/AnalysisCard';
import { ChatBot } from '../components/ChatBot';

export const AnalysisPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showChatBot, setShowChatBot] = useState(false);

  const analyses = [
    {
      id: 1,
      title: "Iran-Israel-US Military Escalation: Regional War Risk Assessment",
      region: "Middle East",
      type: "Military Analysis",
      severity: "Critical",
      date: "2025-01-20",
      summary: "Unprecedented military escalation between Iran, Israel, and the United States threatens to engulf the entire Middle East in regional warfare with global implications.",
      keyPoints: [
        "Iran launches 200+ ballistic missiles targeting Israeli military installations",
        "Israel conducts massive airstrikes on Iranian nuclear facilities in Isfahan and Natanz",
        "US deploys 3 carrier strike groups to Persian Gulf and Eastern Mediterranean",
        "Iran threatens to close Strait of Hormuz, affecting 20% of global oil transit",
        "Hezbollah activates 150,000 rockets from Lebanon, opening northern front",
        "Oil prices surge 40% as global energy markets panic"
      ],
      implications: "Risk of full-scale regional war involving multiple state and non-state actors. Global economic disruption through energy supply chain breakdown. Potential for nuclear escalation if Iranian facilities are severely damaged.",
      confidence: 95
    },
    {
      id: 2,
      title: "India-Pakistan Kashmir Tensions: Military Escalation Analysis",
      region: "South Asia",
      type: "Military Analysis",
      severity: "High",
      date: "2025-01-15",
      summary: "Cross-border shelling incidents have increased 300% in the past month along the Line of Control. Both nations have deployed additional troops and artillery systems.",
      keyPoints: [
        "15 ceasefire violations recorded in past week",
        "India deploys additional 50,000 troops to Kashmir",
        "Pakistan activates air defense systems",
        "Civilian casualties rising on both sides",
        "International mediation efforts underway"
      ],
      implications: "Risk of full-scale military confrontation between two nuclear powers. Regional stability threatened with potential for escalation beyond Kashmir.",
      confidence: 88
    },
    {
      id: 3,
      title: "China-India LAC Standoff: Infrastructure War Assessment",
      region: "South Asia",
      type: "Border Analysis",
      severity: "High",
      date: "2025-01-15",
      summary: "Satellite imagery reveals massive infrastructure development by both sides along the Line of Actual Control, indicating long-term strategic positioning.",
      keyPoints: [
        "China constructs 12 new military outposts in Aksai Chin",
        "India completes strategic roads in Ladakh sector",
        "Military face-offs in Tawang sector increase",
        "Both sides enhance surveillance capabilities",
        "Border personnel meetings show limited progress"
      ],
      implications: "Permanent militarization of the border. Economic costs mounting for both nations. Risk of miscalculation in remote sectors.",
      confidence: 85
    },
    {
      id: 4,
      title: "North Korea Nuclear Program: Weapons Capability Assessment",
      region: "East Asia",
      type: "Nuclear Analysis",
      severity: "Critical",
      date: "2025-01-14",
      summary: "Intelligence analysis indicates North Korea has significantly expanded its nuclear weapons production capacity with new centrifuge facilities operational.",
      keyPoints: [
        "Estimated 70-100 nuclear warheads in arsenal",
        "New uranium enrichment facility at Yongbyon",
        "ICBM testing program accelerated",
        "Submarine-launched ballistic missile development",
        "Tactical nuclear weapons deployment suspected"
      ],
      implications: "Regional arms race intensifying. South Korea and Japan considering nuclear options. US extended deterrence credibility questioned.",
      confidence: 92
    },
    {
      id: 5,
      title: "Russia-Ukraine Conflict: Winter Campaign Analysis",
      region: "Eastern Europe",
      type: "Conflict Analysis",
      severity: "Critical",
      date: "2025-01-14",
      summary: "Analysis of Russian winter campaign strategy focusing on infrastructure targeting and energy warfare tactics against Ukrainian civilian population.",
      keyPoints: [
        "Systematic targeting of energy infrastructure",
        "Mobilization of additional 300,000 troops",
        "Western military aid packages accelerating",
        "Civilian impact reaching critical levels",
        "NATO involvement risk increasing"
      ],
      implications: "Prolonged conflict likely. Humanitarian crisis deepening. Risk of NATO Article 5 activation if attacks spill over borders.",
      confidence: 94
    },
    {
      id: 6,
      title: "Ethiopia-Tigray Conflict: Regional Spillover Assessment",
      region: "Africa",
      type: "Regional Analysis",
      severity: "High",
      date: "2025-01-13",
      summary: "The Ethiopian conflict is destabilizing the Horn of Africa with refugee flows and armed group activities spreading across borders.",
      keyPoints: [
        "2.5 million refugees in neighboring countries",
        "Armed groups operating across Sudan border",
        "Humanitarian access severely restricted",
        "Regional powers taking sides in conflict",
        "Economic impact spreading throughout Horn"
      ],
      implications: "Regional state collapse risk. Humanitarian catastrophe expanding. International intervention may be necessary.",
      confidence: 82
    },
    {
      id: 7,
      title: "Taiwan Strait Crisis: Military Buildup Analysis",
      region: "East Asia",
      type: "Military Analysis",
      severity: "High",
      date: "2025-01-13",
      summary: "Unprecedented military exercises and naval presence in Taiwan Strait indicate potential preparation for military action against Taiwan.",
      keyPoints: [
        "PLA conducts largest ever military exercises",
        "US deploys additional naval assets to region",
        "Taiwan activates reserve forces",
        "Semiconductor supply chain vulnerabilities exposed",
        "QUAD nations coordinate response"
      ],
      implications: "Global economic disruption potential. US-China military confrontation risk. Technology supply chains at risk.",
      confidence: 89
    },
    {
      id: 8,
      title: "Turkey-Greece Aegean Tensions: Energy Dispute Analysis",
      region: "Europe",
      type: "Energy Analysis",
      severity: "Medium",
      date: "2025-01-12",
      summary: "Competing claims over energy exploration rights in the Eastern Mediterranean creating NATO alliance tensions.",
      keyPoints: [
        "Turkish drilling activities in disputed waters",
        "Greek military exercises with France",
        "Cyprus energy exploration agreements",
        "EU sanctions consideration against Turkey",
        "NATO mediation efforts ongoing"
      ],
      implications: "NATO unity at risk. Energy security implications for Europe. Potential for military incidents at sea.",
      confidence: 76
    }
  ];

  const regions = ['all', 'South Asia', 'East Asia', 'Eastern Europe', 'Middle East', 'Africa', 'Europe', 'Southeast Asia'];
  const types = ['all', 'Military Analysis', 'Conflict Analysis', 'Nuclear Analysis', 'Border Analysis', 'Hybrid Warfare Analysis', 'Regional Analysis', 'Energy Analysis'];

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         analysis.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         analysis.keyPoints.some(point => point.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = selectedRegion === 'all' || analysis.region === selectedRegion;
    const matchesType = selectedType === 'all' || analysis.type === selectedType;
    
    return matchesSearch && matchesRegion && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-blue-400" />
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text">
              Deep Analysis Center
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Comprehensive geopolitical analysis powered by advanced AI algorithms and real-time intelligence
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search analyses, countries, conflicts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredAnalyses.length} of {analyses.length} analyses
            {searchQuery && ` for "${searchQuery}"`}
            {selectedRegion !== 'all' && ` in ${selectedRegion}`}
            {selectedType !== 'all' && ` of type ${selectedType}`}
          </p>
        </div>

        {/* Analysis Cards */}
        <div className="space-y-6 mb-8">
          {filteredAnalyses.length > 0 ? (
            filteredAnalyses.map(analysis => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No analyses found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* AI Chat Bot Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowChatBot(!showChatBot)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110"
          >
            <Brain className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Bot */}
        {showChatBot && (
          <ChatBot onClose={() => setShowChatBot(false)} />
        )}
      </div>
    </div>
  );
};