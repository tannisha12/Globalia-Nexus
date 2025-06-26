import React, { useState, useEffect } from 'react';
import { Globe, TrendingUp, AlertTriangle, Users, Clock, ArrowRight, Brain, Shield, DollarSign, Zap, MapPin, Calendar, Eye, Activity, Target, Flame, ChevronDown, ChevronUp, Filter, Search, RefreshCw, Bell, BarChart3, PieChart, LineChart, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorldMap } from '../components/WorldMap';
import { ThreatLevel } from '../components/ThreatLevel';
import { NewsCard } from '../components/NewsCard';
import { ChatBot } from '../components/ChatBot';
import { getGlobalThreatLevel, getLatestAnalyses, getActiveConflicts } from '../services/geopoliticsService';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveAlert {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium';
  region: string;
  timestamp: Date;
  description: string;
}

interface RegionalTension {
  region: string;
  level: number;
  trend: 'rising' | 'stable' | 'declining';
  primaryConcerns: string[];
  riskFactors: number;
}

interface EconomicIndicator {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface IntelligenceUpdate {
  id: string;
  type: 'military' | 'economic' | 'diplomatic' | 'cyber';
  title: string;
  confidence: number;
  source: string;
  timestamp: Date;
  summary: string;
}

export const HomePage: React.FC = () => {
  const [threatLevel, setThreatLevel] = useState(5);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    alerts: true,
    tensions: true,
    intelligence: true
  });

  const [liveAlerts] = useState<LiveAlert[]>([
    {
      id: '1',
      title: 'Iran Launches Ballistic Missiles at Israeli Military Bases',
      severity: 'Critical',
      region: 'Middle East',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Over 200 ballistic missiles launched targeting Israeli military installations in coordinated attack'
    },
    {
      id: '2',
      title: 'India-Pakistan Border Shelling Intensifies',
      severity: 'High',
      region: 'South Asia',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      description: 'Cross-border artillery exchanges along Line of Control increase 300% in past 24 hours'
    },
    {
      id: '3',
      title: 'Chinese Naval Exercises Near Taiwan Strait',
      severity: 'High',
      region: 'East Asia',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      description: 'PLA Navy conducts largest military exercises with 40+ warships and 150+ aircraft'
    },
    {
      id: '4',
      title: 'Russian Energy Infrastructure Attacks on Ukraine',
      severity: 'High',
      region: 'Eastern Europe',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      description: 'Systematic targeting of power grids affecting 40% of Ukraine\'s energy capacity'
    },
    {
      id: '5',
      title: 'North Korea Missile Test Preparation Detected',
      severity: 'Medium',
      region: 'East Asia',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      description: 'Satellite imagery shows increased activity at Sohae launch facility'
    }
  ]);

  const [regionalTensions] = useState<RegionalTension[]>([
    {
      region: 'Middle East',
      level: 95,
      trend: 'rising',
      primaryConcerns: ['Iran-Israel conflict', 'Oil supply disruption', 'Regional proxy wars'],
      riskFactors: 8
    },
    {
      region: 'South Asia',
      level: 85,
      trend: 'rising',
      primaryConcerns: ['Kashmir tensions', 'Nuclear escalation risk', 'Water disputes'],
      riskFactors: 6
    },
    {
      region: 'East Asia',
      level: 80,
      trend: 'stable',
      primaryConcerns: ['Taiwan Strait crisis', 'North Korea nuclear program', 'Trade tensions'],
      riskFactors: 7
    },
    {
      region: 'Eastern Europe',
      level: 90,
      trend: 'stable',
      primaryConcerns: ['Russia-Ukraine war', 'NATO expansion', 'Energy security'],
      riskFactors: 5
    },
    {
      region: 'Africa',
      level: 70,
      trend: 'rising',
      primaryConcerns: ['Sudan civil war', 'Sahel instability', 'Climate migration'],
      riskFactors: 4
    },
    {
      region: 'Americas',
      level: 45,
      trend: 'declining',
      primaryConcerns: ['Venezuela crisis', 'Drug cartels', 'Economic instability'],
      riskFactors: 3
    }
  ]);

  const [economicIndicators] = useState<EconomicIndicator[]>([
    {
      name: 'Global GDP Growth',
      value: '2.1%',
      change: '-0.8%',
      trend: 'down',
      impact: 'negative',
      description: 'Slowest growth since 2009 financial crisis'
    },
    {
      name: 'Oil Price (Brent)',
      value: '$95.40',
      change: '+40%',
      trend: 'up',
      impact: 'negative',
      description: 'Middle East tensions driving energy prices higher'
    },
    {
      name: 'Global Trade Volume',
      value: '$28.5T',
      change: '-5.2%',
      trend: 'down',
      impact: 'negative',
      description: 'First decline since pandemic recovery'
    },
    {
      name: 'Dollar Index (DXY)',
      value: '108.5',
      change: '+8.2%',
      trend: 'up',
      impact: 'negative',
      description: 'Strong dollar pressuring emerging markets'
    },
    {
      name: 'Global Inflation',
      value: '6.8%',
      change: '+2.1%',
      trend: 'up',
      impact: 'negative',
      description: 'Persistent above central bank targets'
    },
    {
      name: 'VIX (Fear Index)',
      value: '28.5',
      change: '+45%',
      trend: 'up',
      impact: 'negative',
      description: 'Elevated market volatility and uncertainty'
    }
  ]);

  const [intelligenceUpdates] = useState<IntelligenceUpdate[]>([
    {
      id: '1',
      type: 'military',
      title: 'Iranian Revolutionary Guard Mobilization',
      confidence: 95,
      source: 'SIGINT',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      summary: 'Large-scale mobilization of IRGC forces across multiple provinces with enhanced readiness levels'
    },
    {
      id: '2',
      type: 'economic',
      title: 'Chinese Property Sector Stress Indicators',
      confidence: 88,
      source: 'FININT',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      summary: 'Multiple property developers showing signs of liquidity stress with potential systemic implications'
    },
    {
      id: '3',
      type: 'cyber',
      title: 'State-Sponsored Cyber Campaign Against Critical Infrastructure',
      confidence: 92,
      source: 'CYBINT',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      summary: 'Coordinated attacks targeting energy and transportation networks across multiple countries'
    },
    {
      id: '4',
      type: 'diplomatic',
      title: 'Secret Diplomatic Channels Activated',
      confidence: 78,
      source: 'HUMINT',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
      summary: 'Back-channel communications established between conflicting parties through neutral intermediaries'
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [threat, latestAnalyses, activeConflicts] = await Promise.all([
          getGlobalThreatLevel(),
          getLatestAnalyses(),
          getActiveConflicts()
        ]);
        
        setThreatLevel(threat);
        setAnalyses(latestAnalyses);
        setConflicts(activeConflicts);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'High': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'military': return <Shield className="w-4 h-4 text-red-400" />;
      case 'economic': return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'cyber': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'diplomatic': return <Users className="w-4 h-4 text-blue-400" />;
      default: return <Brain className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMinutes}m ago`;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredAlerts = liveAlerts.filter(alert => 
    selectedRegion === 'all' || alert.region === selectedRegion
  );

  const filteredIntelligence = intelligenceUpdates.filter(update => {
    const timeFilter = selectedTimeframe === '24h' ? 
      Date.now() - update.timestamp.getTime() < 24 * 60 * 60 * 1000 :
      selectedTimeframe === '7d' ?
      Date.now() - update.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000 :
      true;
    
    const regionFilter = selectedRegion === 'all' || true; // Intelligence is global
    
    return timeFilter && regionFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <Globe className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Analyzing global situation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header with Live Status */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Globe className="w-10 h-10 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text">
              Global Intelligence Dashboard
            </h2>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">LIVE</span>
            </div>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Real-time geopolitical analysis powered by advanced AI algorithms and global intelligence networks
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              <span>Auto-refresh: 5min</span>
            </div>
          </div>
        </div>

        {/* Global Status Bar */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{filteredAlerts.length}</div>
              <div className="text-xs text-gray-400">Live Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{conflicts.length}</div>
              <div className="text-xs text-gray-400">Active Conflicts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">195</div>
              <div className="text-xs text-gray-400">Countries Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{intelligenceUpdates.length}</div>
              <div className="text-xs text-gray-400">Intel Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-xs text-gray-400">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">AI</div>
              <div className="text-xs text-gray-400">Powered</div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-400" />
              Dashboard Controls
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Time Range</label>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Region Focus</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="all">All Regions</option>
                    <option value="Middle East">Middle East</option>
                    <option value="South Asia">South Asia</option>
                    <option value="East Asia">East Asia</option>
                    <option value="Eastern Europe">Eastern Europe</option>
                    <option value="Africa">Africa</option>
                    <option value="Americas">Americas</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Alerts Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 mb-8">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-semibold text-white">Live Security Alerts</h3>
                <div className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                  {filteredAlerts.length} Active
                </div>
              </div>
              <button
                onClick={() => toggleSection('alerts')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {expandedSections.alerts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {expandedSections.alerts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6"
              >
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{alert.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="text-xs text-gray-400">{getTimeAgo(alert.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.region}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Threat Level & Regional Tensions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ThreatLevel level={threatLevel} />
          
          {/* Regional Tension Monitor */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-semibold text-white">Regional Tension Monitor</h3>
                </div>
                <button
                  onClick={() => toggleSection('tensions')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {expandedSections.tensions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedSections.tensions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6"
                >
                  <div className="space-y-4">
                    {regionalTensions.map((tension, index) => (
                      <div key={tension.region} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-white">{tension.region}</h4>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(tension.trend)}
                            <span className={`text-lg font-bold ${
                              tension.level >= 90 ? 'text-red-400' :
                              tension.level >= 70 ? 'text-orange-400' :
                              tension.level >= 50 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {tension.level}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              tension.level >= 90 ? 'bg-red-400' :
                              tension.level >= 70 ? 'bg-orange-400' :
                              tension.level >= 50 ? 'bg-yellow-400' : 'bg-green-400'
                            }`}
                            style={{ width: `${tension.level}%` }}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          {tension.primaryConcerns.map((concern, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              <div className="w-1 h-1 bg-orange-400 rounded-full" />
                              <span>{concern}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-400">
                          Risk Factors: {tension.riskFactors}/10
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Economic Indicators Dashboard */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Global Economic Indicators</h3>
            <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
              Live Data
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {economicIndicators.map((indicator, index) => (
              <motion.div
                key={indicator.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{indicator.name}</h4>
                  <div className={`p-1 rounded ${
                    indicator.trend === 'up' ? 'bg-red-500/20' : 
                    indicator.trend === 'down' ? 'bg-green-500/20' : 'bg-gray-500/20'
                  }`}>
                    {indicator.trend === 'up' ? <TrendingUp className="w-3 h-3 text-red-400" /> :
                     indicator.trend === 'down' ? <TrendingDown className="w-3 h-3 text-green-400" /> :
                     <Activity className="w-3 h-3 text-gray-400" />}
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-bold text-blue-400">{indicator.value}</span>
                  <span className={`text-sm font-medium ${
                    indicator.impact === 'positive' ? 'text-green-400' :
                    indicator.impact === 'negative' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {indicator.change}
                  </span>
                </div>
                
                <p className="text-xs text-gray-400">{indicator.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Intelligence Updates */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 mb-8">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Intelligence Updates</h3>
                <div className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                  {filteredIntelligence.length} New
                </div>
              </div>
              <button
                onClick={() => toggleSection('intelligence')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {expandedSections.intelligence ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {expandedSections.intelligence && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6"
              >
                <div className="space-y-4">
                  {filteredIntelligence.map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-slate-700/30 rounded-lg p-4 border border-slate-600"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(update.type)}
                          <h4 className="font-semibold text-white">{update.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">Confidence:</span>
                            <span className={`text-xs font-medium ${
                              update.confidence >= 90 ? 'text-green-400' :
                              update.confidence >= 70 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {update.confidence}%
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">{getTimeAgo(update.timestamp)}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2">{update.summary}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Source: {update.source}</span>
                        <span className={`px-2 py-1 rounded ${
                          update.type === 'military' ? 'bg-red-500/20 text-red-400' :
                          update.type === 'economic' ? 'bg-green-500/20 text-green-400' :
                          update.type === 'cyber' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {update.type.toUpperCase()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* World Map */}
        <div className="mb-8">
          <WorldMap conflicts={conflicts} />
        </div>

        {/* Latest Analyses & Active Conflicts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Latest Analyses */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">Latest Analyses</h3>
              </div>
              <Link 
                to="/analysis"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {analyses.slice(0, 4).map((analysis) => (
                <NewsCard key={analysis.id} item={analysis} type="analysis" />
              ))}
            </div>
          </div>

          {/* Active Conflicts */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-semibold text-white">Active Conflicts</h3>
              </div>
              <Link 
                to="/conflicts"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {conflicts.slice(0, 4).map((conflict) => (
                <NewsCard key={conflict.id} item={conflict} type="conflict" />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access Navigation */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" />
            Quick Access
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/analysis"
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-blue-500/50 transition-all group"
            >
              <Brain className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">Deep Analysis</h4>
              <p className="text-xs text-gray-400">AI-powered insights</p>
            </Link>
            
            <Link
              to="/vulnerabilities"
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-orange-500/50 transition-all group"
            >
              <Shield className="w-8 h-8 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">Vulnerabilities</h4>
              <p className="text-xs text-gray-400">Country assessments</p>
            </Link>
            
            <Link
              to="/economics"
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-green-500/50 transition-all group"
            >
              <DollarSign className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">Economics</h4>
              <p className="text-xs text-gray-400">Market intelligence</p>
            </Link>
            
            <Link
              to="/vr-interface"
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-purple-500/50 transition-all group"
            >
              <Eye className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">VR Interface</h4>
              <p className="text-xs text-gray-400">Immersive analysis</p>
            </Link>
          </div>
        </div>

        {/* Real-time Updates Footer */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Last updated: {new Date().toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={16} />
                <span>System Status: Operational</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">Live Monitoring Active</span>
            </div>
          </div>
        </div>

        {/* AI Chat Bot Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowChatBot(!showChatBot)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 relative"
          >
            <Brain className="w-6 h-6" />
            {filteredAlerts.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {filteredAlerts.length}
              </div>
            )}
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