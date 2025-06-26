import React, { useState, useEffect } from 'react';
import { X, Globe, DollarSign, Shield, Users, TrendingUp, MapPin, Calendar, ExternalLink, Brain, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountryData {
  name: string;
  region: string;
  capital: string;
  population: string;
  gdp: string;
  government: string;
  leader: string;
  independence: string;
  area: string;
  languages: string[];
  currency: string;
  timezone: string;
}

interface PoliticalHistory {
  period: string;
  events: string[];
  significance: string;
}

interface EconomicData {
  gdpGrowth: string;
  inflation: string;
  unemployment: string;
  majorIndustries: string[];
  tradePartners: string[];
  exports: string[];
  imports: string[];
  economicChallenges: string[];
}

interface MilitaryData {
  militaryBudget: string;
  activePersonnel: string;
  reservePersonnel: string;
  majorWeapons: string[];
  alliances: string[];
  conflicts: string[];
  peacekeeping: string[];
  threats: string[];
}

interface AllianceData {
  name: string;
  type: 'military' | 'economic' | 'political' | 'regional';
  members: string[];
  established: string;
  purpose: string;
  headquarters: string;
  keyAgreements: string[];
}

interface KnowledgePanelProps {
  countryName: string;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

const mockCountryData: { [key: string]: CountryData } = {
  'Ukraine': {
    name: 'Ukraine',
    region: 'Eastern Europe',
    capital: 'Kyiv',
    population: '43.8 million',
    gdp: '$200 billion (pre-war)',
    government: 'Unitary semi-presidential republic',
    leader: 'Volodymyr Zelenskyy',
    independence: 'August 24, 1991',
    area: '603,628 km²',
    languages: ['Ukrainian', 'Russian'],
    currency: 'Ukrainian hryvnia (UAH)',
    timezone: 'EET (UTC+2)'
  },
  'Russia': {
    name: 'Russian Federation',
    region: 'Eastern Europe/Northern Asia',
    capital: 'Moscow',
    population: '146.2 million',
    gdp: '$1.8 trillion',
    government: 'Federal semi-presidential republic',
    leader: 'Vladimir Putin',
    independence: 'June 12, 1990',
    area: '17,098,242 km²',
    languages: ['Russian'],
    currency: 'Russian ruble (RUB)',
    timezone: 'Multiple (UTC+2 to UTC+12)'
  },
  'China': {
    name: 'People\'s Republic of China',
    region: 'East Asia',
    capital: 'Beijing',
    population: '1.41 billion',
    gdp: '$17.7 trillion',
    government: 'Unitary one-party socialist republic',
    leader: 'Xi Jinping',
    independence: 'October 1, 1949',
    area: '9,596,960 km²',
    languages: ['Mandarin Chinese'],
    currency: 'Renminbi (CNY)',
    timezone: 'CST (UTC+8)'
  },
  'India': {
    name: 'Republic of India',
    region: 'South Asia',
    capital: 'New Delhi',
    population: '1.38 billion',
    gdp: '$3.7 trillion',
    government: 'Federal parliamentary republic',
    leader: 'Narendra Modi',
    independence: 'August 15, 1947',
    area: '3,287,263 km²',
    languages: ['Hindi', 'English', '20+ regional languages'],
    currency: 'Indian rupee (INR)',
    timezone: 'IST (UTC+5:30)'
  },
  'Pakistan': {
    name: 'Islamic Republic of Pakistan',
    region: 'South Asia',
    capital: 'Islamabad',
    population: '225 million',
    gdp: '$347 billion',
    government: 'Federal parliamentary republic',
    leader: 'Shehbaz Sharif',
    independence: 'August 14, 1947',
    area: '881,913 km²',
    languages: ['Urdu', 'English'],
    currency: 'Pakistani rupee (PKR)',
    timezone: 'PKT (UTC+5)'
  }
};

const mockPoliticalHistory: { [key: string]: PoliticalHistory[] } = {
  'Ukraine': [
    {
      period: '2022-Present',
      events: ['Russian invasion begins February 24, 2022', 'Martial law declared', 'EU candidate status granted', 'International military aid received'],
      significance: 'Existential war for independence and territorial integrity'
    },
    {
      period: '2014-2022',
      events: ['Euromaidan revolution', 'Russian annexation of Crimea', 'War in Donbas begins', 'Minsk agreements signed'],
      significance: 'Pivot toward Europe and beginning of conflict with Russia'
    },
    {
      period: '1991-2014',
      events: ['Independence from Soviet Union', 'Orange Revolution 2004', 'NATO membership aspirations', 'EU association agreement'],
      significance: 'Building democratic institutions and Western orientation'
    }
  ],
  'Russia': [
    {
      period: '2000-Present',
      events: ['Putin comes to power', 'Georgia war 2008', 'Crimea annexation 2014', 'Ukraine invasion 2022'],
      significance: 'Authoritarian consolidation and imperial resurgence'
    },
    {
      period: '1991-2000',
      events: ['Soviet Union collapse', 'Economic shock therapy', 'Chechen wars', 'Oligarch capitalism'],
      significance: 'Chaotic transition from communism to capitalism'
    }
  ],
  'China': [
    {
      period: '2012-Present',
      events: ['Xi Jinping leadership', 'Belt and Road Initiative', 'Hong Kong security law', 'Zero-COVID policy'],
      significance: 'Assertive global power projection and domestic control'
    },
    {
      period: '1978-2012',
      events: ['Economic reforms begin', 'Tiananmen Square 1989', 'WTO membership 2001', 'Beijing Olympics 2008'],
      significance: 'Economic opening while maintaining political control'
    }
  ]
};

const mockEconomicData: { [key: string]: EconomicData } = {
  'Ukraine': {
    gdpGrowth: '-30% (2022, war impact)',
    inflation: '26.6%',
    unemployment: '35% (war-affected)',
    majorIndustries: ['Agriculture', 'Steel', 'Mining', 'Machinery'],
    tradePartners: ['EU', 'China', 'Turkey', 'Poland'],
    exports: ['Grain', 'Steel', 'Iron ore', 'Machinery'],
    imports: ['Energy', 'Machinery', 'Chemicals', 'Vehicles'],
    economicChallenges: ['War destruction', 'Infrastructure damage', 'Refugee crisis', 'Energy shortages']
  },
  'Russia': {
    gdpGrowth: '-2.1% (2022)',
    inflation: '11.9%',
    unemployment: '3.9%',
    majorIndustries: ['Oil & Gas', 'Mining', 'Defense', 'Agriculture'],
    tradePartners: ['China', 'India', 'Turkey', 'UAE'],
    exports: ['Oil', 'Natural gas', 'Metals', 'Wheat'],
    imports: ['Machinery', 'Electronics', 'Pharmaceuticals', 'Vehicles'],
    economicChallenges: ['Western sanctions', 'Technology restrictions', 'Brain drain', 'Isolation from global markets']
  },
  'China': {
    gdpGrowth: '3.0% (2022)',
    inflation: '2.0%',
    unemployment: '5.5%',
    majorIndustries: ['Manufacturing', 'Technology', 'Construction', 'Services'],
    tradePartners: ['USA', 'EU', 'ASEAN', 'Japan'],
    exports: ['Electronics', 'Machinery', 'Textiles', 'Chemicals'],
    imports: ['Semiconductors', 'Oil', 'Iron ore', 'Soybeans'],
    economicChallenges: ['Property sector crisis', 'Demographic decline', 'US trade tensions', 'Zero-COVID impact']
  }
};

const mockMilitaryData: { [key: string]: MilitaryData } = {
  'Ukraine': {
    militaryBudget: '$6 billion + international aid',
    activePersonnel: '900,000 (mobilized)',
    reservePersonnel: '1.2 million',
    majorWeapons: ['HIMARS', 'Javelin missiles', 'Leopard tanks', 'F-16 fighters (incoming)'],
    alliances: ['NATO Partnership', 'EU cooperation'],
    conflicts: ['Russia-Ukraine War'],
    peacekeeping: ['UN missions (pre-war)'],
    threats: ['Russian invasion', 'Missile attacks', 'Nuclear threats']
  },
  'Russia': {
    militaryBudget: '$65.9 billion',
    activePersonnel: '1.15 million',
    reservePersonnel: '2 million',
    majorWeapons: ['Nuclear arsenal', 'Hypersonic missiles', 'S-400 systems', 'Su-57 fighters'],
    alliances: ['CSTO', 'SCO'],
    conflicts: ['Ukraine War', 'Syria intervention'],
    peacekeeping: ['CSTO missions'],
    threats: ['NATO expansion', 'Western sanctions', 'Internal instability']
  },
  'China': {
    militaryBudget: '$230 billion',
    activePersonnel: '2.18 million',
    reservePersonnel: '510,000',
    majorWeapons: ['Nuclear arsenal', 'DF-21 missiles', 'J-20 fighters', 'Type 055 destroyers'],
    alliances: ['SCO', 'Russia partnership'],
    conflicts: ['Taiwan tensions', 'South China Sea disputes'],
    peacekeeping: ['UN missions', 'Anti-piracy operations'],
    threats: ['US containment', 'Taiwan independence', 'Border disputes']
  }
};

const mockAllianceData: { [key: string]: AllianceData[] } = {
  'Ukraine': [
    {
      name: 'NATO Partnership for Peace',
      type: 'military',
      members: ['Ukraine', 'NATO members'],
      established: '1994',
      purpose: 'Military cooperation and eventual membership',
      headquarters: 'Brussels, Belgium',
      keyAgreements: ['Enhanced Opportunities Partnership', 'Annual National Programme']
    }
  ],
  'Russia': [
    {
      name: 'Collective Security Treaty Organization (CSTO)',
      type: 'military',
      members: ['Russia', 'Armenia', 'Belarus', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan'],
      established: '2002',
      purpose: 'Collective defense and security cooperation',
      headquarters: 'Moscow, Russia',
      keyAgreements: ['Collective Security Treaty', 'Rapid Reaction Force']
    },
    {
      name: 'Shanghai Cooperation Organisation (SCO)',
      type: 'political',
      members: ['Russia', 'China', 'India', 'Pakistan', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Uzbekistan'],
      established: '2001',
      purpose: 'Political, economic and security cooperation',
      headquarters: 'Beijing, China',
      keyAgreements: ['SCO Charter', 'Convention on Combating Terrorism']
    }
  ]
};

const AIAnalysisPanel = ({ countryName, isLoading }: { countryName: string; isLoading: boolean }) => {
  const [analysis, setAnalysis] = useState<string>('');

  useEffect(() => {
    // Simulate AI analysis generation
    const generateAnalysis = () => {
      const analyses: { [key: string]: string } = {
        'Ukraine': 'Current AI Analysis: Ukraine faces an existential crisis as it defends against Russian invasion. The country has demonstrated remarkable resilience, with strong international support providing military aid and economic assistance. Key challenges include infrastructure reconstruction, refugee reintegration, and long-term security guarantees. The conflict has accelerated Ukraine\'s integration with Western institutions.',
        'Russia': 'Current AI Analysis: Russia is experiencing significant isolation due to its invasion of Ukraine. Western sanctions have impacted its economy, forcing pivot to Asia and Global South. Domestic stability maintained through authoritarian control, but long-term challenges include brain drain, technological isolation, and economic diversification needs. Military capabilities remain substantial but strained.',
        'China': 'Current AI Analysis: China faces a complex strategic environment with slowing economic growth and demographic challenges. The zero-COVID policy reversal and property sector crisis have impacted stability. Geopolitically, China balances support for Russia with economic interests in the West. Taiwan tensions remain the primary flashpoint for potential conflict.',
        'India': 'Current AI Analysis: India is emerging as a key global power, balancing relationships with all major powers. Strong economic growth continues despite global headwinds. Border tensions with China and Pakistan persist, while India maintains strategic autonomy in foreign policy. Demographic dividend and digital transformation drive long-term potential.',
        'Pakistan': 'Current AI Analysis: Pakistan faces severe economic crisis with IMF bailout dependency and political instability. Climate change impacts including floods have worsened conditions. Security challenges from terrorism and tensions with India continue. China-Pakistan Economic Corridor provides opportunities but also debt concerns.'
      };
      
      setTimeout(() => {
        setAnalysis(analyses[countryName] || 'AI analysis not available for this region.');
      }, 2000);
    };

    if (countryName) {
      setAnalysis('');
      generateAnalysis();
    }
  }, [countryName]);

  return (
    <div className="bg-slate-700/30 rounded-lg p-4 border border-blue-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-blue-400" />
        <h4 className="font-semibold text-blue-400">AI Strategic Analysis</h4>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
      </div>
      {analysis ? (
        <p className="text-gray-300 text-sm leading-relaxed">{analysis}</p>
      ) : (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Generating real-time analysis...</span>
        </div>
      )}
      <div className="mt-3 text-xs text-gray-500">
        Last updated: {new Date().toLocaleString()} • Source: AI Analysis Engine
      </div>
    </div>
  );
};

export const KnowledgePanel: React.FC<KnowledgePanelProps> = ({ 
  countryName, 
  isOpen, 
  onClose, 
  position 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'political' | 'economic' | 'military' | 'alliances'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const countryData = mockCountryData[countryName];
  const politicalHistory = mockPoliticalHistory[countryName] || [];
  const economicData = mockEconomicData[countryName];
  const militaryData = mockMilitaryData[countryName];
  const allianceData = mockAllianceData[countryName] || [];

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate data loading
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [isOpen, countryName]);

  if (!isOpen || !countryData) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'political', label: 'Political', icon: Users },
    { id: 'economic', label: 'Economic', icon: DollarSign },
    { id: 'military', label: 'Military', icon: Shield },
    { id: 'alliances', label: 'Alliances', icon: TrendingUp }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: position.x, y: position.y }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-4 left-4 w-96 max-h-[80vh] bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{countryData.name}</h3>
                <p className="text-sm text-gray-400">{countryData.region}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 p-3 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon size={14} className="mx-auto mb-1" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Loading data...</span>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <AIAnalysisPanel countryName={countryName} isLoading={false} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-medium text-gray-400">Capital</span>
                      </div>
                      <p className="text-sm text-white">{countryData.capital}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-gray-400">Population</span>
                      </div>
                      <p className="text-sm text-white">{countryData.population}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-medium text-gray-400">GDP</span>
                      </div>
                      <p className="text-sm text-white">{countryData.gdp}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-medium text-gray-400">Independence</span>
                      </div>
                      <p className="text-sm text-white">{countryData.independence}</p>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <h4 className="font-medium text-white mb-2">Government</h4>
                    <p className="text-sm text-gray-300 mb-1">{countryData.government}</p>
                    <p className="text-xs text-gray-400">Leader: {countryData.leader}</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <h4 className="font-medium text-white mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-1">
                      {countryData.languages.map((lang) => (
                        <span key={lang} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'political' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Political History</h4>
                  {politicalHistory.map((period, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                      <h5 className="font-medium text-blue-400 mb-2">{period.period}</h5>
                      <ul className="space-y-1 mb-2">
                        {period.events.map((event, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            {event}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-400 italic">{period.significance}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'economic' && economicData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <span className="text-xs text-gray-400">GDP Growth</span>
                      <p className="text-sm font-medium text-white">{economicData.gdpGrowth}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <span className="text-xs text-gray-400">Inflation</span>
                      <p className="text-sm font-medium text-white">{economicData.inflation}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <span className="text-xs text-gray-400">Unemployment</span>
                      <p className="text-sm font-medium text-white">{economicData.unemployment}</p>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <h5 className="font-medium text-white mb-2">Major Industries</h5>
                    <div className="flex flex-wrap gap-1">
                      {economicData.majorIndustries.map((industry) => (
                        <span key={industry} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <h5 className="font-medium text-white mb-2">Trade Partners</h5>
                    <div className="flex flex-wrap gap-1">
                      {economicData.tradePartners.map((partner) => (
                        <span key={partner} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <h5 className="font-medium text-white mb-2">Economic Challenges</h5>
                    <ul className="space-y-1">
                      {economicData.economicChallenges.map((challenge, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'military' && militaryData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <span className="text-xs text-gray-400">Military Budget</span>
                      <p className="text-sm font-medium text-white">{militaryData.militaryBudget}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <span className="text-xs text-gray-400">Active Personnel</span>
                      <p className="text-sm font-medium text-white">{militaryData.activePersonnel}</p>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <h5 className="font-medium text-white mb-2">Major Weapons Systems</h5>
                    <div className="flex flex-wrap gap-1">
                      {militaryData.majorWeapons.map((weapon) => (
                        <span key={weapon} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                          {weapon}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <h5 className="font-medium text-white mb-2">Current Conflicts</h5>
                    <ul className="space-y-1">
                      {militaryData.conflicts.map((conflict, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                          {conflict}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <h5 className="font-medium text-white mb-2">Security Threats</h5>
                    <ul className="space-y-1">
                      {militaryData.threats.map((threat, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <div className="w-1 h-1 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'alliances' && (
                <div className="space-y-4">
                  {allianceData.length > 0 ? (
                    allianceData.map((alliance, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-white">{alliance.name}</h5>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            alliance.type === 'military' ? 'bg-red-500/20 text-red-400' :
                            alliance.type === 'economic' ? 'bg-green-500/20 text-green-400' :
                            alliance.type === 'political' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {alliance.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{alliance.purpose}</p>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>Established: {alliance.established}</p>
                          <p>Members: {alliance.members.length}</p>
                          <p>HQ: {alliance.headquarters}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400">No major alliance data available</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-3 bg-slate-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Data sources: CIA World Factbook, Wikipedia, Live APIs</span>
            <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
              <ExternalLink size={12} />
              More Info
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};