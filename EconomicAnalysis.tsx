import React, { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, Globe, AlertCircle, TrendingDown, Zap, Users, Factory, Truck, PieChart, LineChart, Download, FileText, Database, Settings } from 'lucide-react';
import { EconomicCard } from '../components/EconomicCard';
import { ReportGenerator, downloadReport, type ReportData, type ReportOptions } from '../services/reportService';

export const EconomicAnalysis: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    includeCharts: true,
    includeRiskAssessment: true,
    includeRecommendations: true,
    format: 'pdf'
  });

  const economicData = [
    {
      id: 1,
      title: "Global Trade War Escalation: US-China-EU Triangle",
      region: "Global",
      type: "Trade Analysis",
      impact: "Critical",
      trend: "negative",
      summary: "Escalating trade tensions between major economies creating unprecedented supply chain disruptions and reshaping global commerce patterns with long-term structural implications.",
      keyMetrics: {
        "Global GDP Impact": "-1.2%",
        "Trade Volume Decline": "-18%",
        "Tariff Increases": "+340%",
        "Supply Chain Costs": "+25%",
        "Manufacturing Relocation": "$2.3T",
        "Job Displacement": "15M workers"
      },
      implications: [
        "Permanent restructuring of global supply chains away from efficiency toward resilience",
        "Accelerated regionalization of trade blocs (USMCA, RCEP, EU)",
        "Technology decoupling creating parallel innovation ecosystems",
        "Emerging markets forced to choose between competing economic spheres",
        "Inflation pressures from supply chain fragmentation and higher costs",
        "Strategic industries reshoring despite higher production costs"
      ],
      lastUpdate: "2025-01-20"
    },
    {
      id: 2,
      title: "European Energy Crisis: Post-Russian Dependency Transition",
      region: "Europe",
      type: "Energy Security",
      impact: "Critical",
      trend: "negative",
      summary: "Europe's energy transformation following Russian supply cuts creates massive economic restructuring with industrial competitiveness at stake amid soaring costs.",
      keyMetrics: {
        "Energy Price Surge": "+280%",
        "Industrial Production": "-22%",
        "Household Energy Costs": "+320%",
        "Green Investment": "€1.2T",
        "Gas Storage Levels": "65%",
        "Renewable Capacity": "+45%"
      },
      implications: [
        "Deindustrialization risk as energy-intensive industries relocate to lower-cost regions",
        "Accelerated green transition despite short-term economic pain",
        "Social unrest potential from cost-of-living crisis affecting middle class",
        "Geopolitical realignment toward Middle East and North African energy suppliers",
        "Innovation boom in energy efficiency and alternative technologies",
        "Economic recession probability exceeds 70% for winter 2025"
      ],
      lastUpdate: "2025-01-20"
    },
    {
      id: 3,
      title: "China's Economic Slowdown: Property Crisis and Demographic Cliff",
      region: "Asia",
      type: "Structural Crisis",
      impact: "High",
      trend: "negative",
      summary: "China faces simultaneous property sector collapse, demographic transition, and debt overhang creating the most serious economic challenge since market reforms began.",
      keyMetrics: {
        "GDP Growth": "2.8%",
        "Property Sector Decline": "-35%",
        "Youth Unemployment": "21.3%",
        "Local Government Debt": "$13T",
        "Population Decline": "-850K",
        "Export Growth": "-12%"
      },
      implications: [
        "Global commodity demand collapse affecting resource-dependent economies",
        "Supply chain disruptions as manufacturing costs rise and efficiency declines",
        "Deflationary pressures exported globally through reduced Chinese consumption",
        "Geopolitical tensions may increase as economic growth model fails",
        "Technology transfer restrictions accelerating domestic innovation push",
        "Belt and Road Initiative scaling back due to fiscal constraints"
      ],
      lastUpdate: "2025-01-18"
    },
    {
      id: 4,
      title: "US Federal Reserve Policy Dilemma: Inflation vs Growth",
      region: "Americas",
      type: "Monetary Policy",
      impact: "High",
      trend: "negative",
      summary: "Federal Reserve faces impossible choice between controlling persistent inflation and preventing recession as multiple economic pressures converge.",
      keyMetrics: {
        "Core Inflation": "4.8%",
        "Federal Funds Rate": "5.75%",
        "Unemployment": "4.2%",
        "GDP Growth": "1.1%",
        "Dollar Index": "108.5",
        "Corporate Bankruptcies": "+45%"
      },
      implications: [
        "Higher interest rates strengthening dollar and hurting emerging market debt",
        "Commercial real estate crisis deepening with $1.5T in refinancing needs",
        "Regional bank stress from unrealized losses on bond portfolios",
        "Consumer spending decline as credit tightens and savings deplete",
        "Stock market volatility as valuations adjust to higher discount rates",
        "Political pressure mounting for fiscal stimulus despite inflation concerns"
      ],
      lastUpdate: "2025-01-18"
    },
    {
      id: 5,
      title: "Middle East Economic Transformation: Oil Transition Challenges",
      region: "Middle East",
      type: "Structural Transition",
      impact: "High",
      trend: "mixed",
      summary: "Gulf states racing to diversify economies away from oil dependency while managing geopolitical tensions and massive infrastructure investments.",
      keyMetrics: {
        "Oil Revenue Decline": "-15%",
        "Diversification Investment": "$2.5T",
        "Non-Oil GDP Growth": "+8.2%",
        "Sovereign Wealth Assets": "$4.1T",
        "Youth Unemployment": "28%",
        "Renewable Energy Capacity": "+180%"
      },
      implications: [
        "Massive public works projects creating short-term growth but long-term debt concerns",
        "Competition between Gulf states for foreign investment and tourism",
        "Social contract changes as subsidies reduced and taxes introduced",
        "Geopolitical tensions affecting investor confidence and project timelines",
        "Technology sector development creating new economic clusters",
        "Labor market transformation requiring extensive retraining programs"
      ],
      lastUpdate: "2025-01-17"
    },
    {
      id: 6,
      title: "African Economic Integration: Continental Free Trade Challenges",
      region: "Africa",
      type: "Trade Integration",
      impact: "Medium",
      trend: "positive",
      summary: "African Continental Free Trade Area implementation faces infrastructure and governance challenges while offering unprecedented economic integration opportunities.",
      keyMetrics: {
        "Intra-African Trade": "+32%",
        "Infrastructure Investment": "$170B",
        "Digital Payment Growth": "+85%",
        "Manufacturing Growth": "+12%",
        "Youth Population": "420M",
        "Mobile Penetration": "89%"
      },
      implications: [
        "Manufacturing hub potential as global supply chains diversify from Asia",
        "Resource wealth monetization through value-added processing",
        "Digital leapfrogging creating new financial and technology ecosystems",
        "Demographic dividend if education and job creation challenges addressed",
        "Climate adaptation costs requiring massive international financing",
        "Governance improvements essential for sustained foreign investment"
      ],
      lastUpdate: "2025-01-16"
    },
    {
      id: 7,
      title: "India's Economic Acceleration: Manufacturing and Services Boom",
      region: "Asia",
      type: "Growth Analysis",
      impact: "High",
      trend: "positive",
      summary: "India emerges as major beneficiary of global supply chain diversification while domestic consumption and digital transformation drive sustained growth.",
      keyMetrics: {
        "GDP Growth": "6.8%",
        "Manufacturing Growth": "+11.2%",
        "Digital Economy": "$800B",
        "FDI Inflows": "$95B",
        "Infrastructure Investment": "$1.4T",
        "Middle Class Expansion": "+180M"
      },
      implications: [
        "Alternative manufacturing base to China attracting global investment",
        "Domestic market size creating scale advantages for local and foreign companies",
        "Technology sector leadership in software, fintech, and digital services",
        "Infrastructure development creating massive employment and productivity gains",
        "Energy transition challenges requiring $4T investment over two decades",
        "Geopolitical positioning as swing power between US and China blocs"
      ],
      lastUpdate: "2025-01-16"
    },
    {
      id: 8,
      title: "Latin America Commodity Supercycle: Resource Wealth Management",
      region: "Americas",
      type: "Commodity Analysis",
      impact: "Medium",
      trend: "positive",
      summary: "Latin American economies benefit from commodity price surge driven by energy transition and geopolitical supply disruptions, but face governance challenges.",
      keyMetrics: {
        "Commodity Price Index": "+65%",
        "Export Revenue Growth": "+28%",
        "Mining Investment": "$180B",
        "Agricultural Exports": "+22%",
        "Currency Appreciation": "+15%",
        "Inflation Rate": "8.2%"
      },
      implications: [
        "Dutch disease risk as commodity wealth strengthens currencies and hurts manufacturing",
        "Environmental and social governance pressures from international investors",
        "Indigenous rights conflicts over mining and agricultural expansion",
        "Opportunity to build sovereign wealth funds for economic diversification",
        "Infrastructure development needs to support commodity export capacity",
        "Political stability challenges as wealth distribution becomes contentious issue"
      ],
      lastUpdate: "2025-01-15"
    }
  ];

  const globalIndicators = [
    {
      name: "Global GDP Growth",
      value: "2.1%",
      change: "-0.8%",
      trend: "down",
      description: "Slowest growth since 2009 financial crisis"
    },
    {
      name: "World Trade Volume",
      value: "$28.5T",
      change: "-5.2%",
      trend: "down",
      description: "First decline since pandemic recovery"
    },
    {
      name: "Global Inflation",
      value: "6.8%",
      change: "+2.1%",
      trend: "up",
      description: "Persistent above central bank targets"
    },
    {
      name: "Commodity Price Index",
      value: "145.2",
      change: "+12%",
      trend: "up",
      description: "Energy and food prices driving increases"
    },
    {
      name: "Dollar Index (DXY)",
      value: "108.5",
      change: "+8.2%",
      trend: "up",
      description: "Strong dollar pressuring emerging markets"
    },
    {
      name: "Global Debt-to-GDP",
      value: "256%",
      change: "+12%",
      trend: "up",
      description: "Record high debt levels across sectors"
    }
  ];

  const economicRisks = [
    {
      risk: "Debt Crisis in Emerging Markets",
      probability: "High",
      impact: "Critical",
      description: "Rising US rates and strong dollar creating refinancing crisis",
      affectedCountries: ["Sri Lanka", "Pakistan", "Ghana", "Zambia", "Lebanon"]
    },
    {
      risk: "European Recession",
      probability: "Very High",
      impact: "High",
      description: "Energy crisis and inflation forcing economic contraction",
      affectedCountries: ["Germany", "Italy", "UK", "Netherlands", "Belgium"]
    },
    {
      risk: "Chinese Property Sector Collapse",
      probability: "Medium",
      impact: "Critical",
      description: "Systemic banking crisis from property developer defaults",
      affectedCountries: ["China", "Hong Kong", "Singapore", "Australia", "Chile"]
    },
    {
      risk: "Global Food Crisis",
      probability: "High",
      impact: "High",
      description: "Climate and conflict disrupting agricultural production",
      affectedCountries: ["Egypt", "Bangladesh", "Nigeria", "Ethiopia", "Yemen"]
    },
    {
      risk: "Technology Cold War Escalation",
      probability: "Very High",
      impact: "Medium",
      description: "Further decoupling increasing costs and reducing innovation",
      affectedCountries: ["USA", "China", "Taiwan", "South Korea", "Netherlands"]
    }
  ];

  const sectorPerformance = [
    { sector: "Technology", performance: "+12.5%", status: "Strong", color: "text-green-400" },
    { sector: "Energy", performance: "+45.2%", status: "Boom", color: "text-green-400" },
    { sector: "Manufacturing", performance: "-8.1%", status: "Weak", color: "text-red-400" },
    { sector: "Financial Services", performance: "-2.3%", status: "Stressed", color: "text-orange-400" },
    { sector: "Real Estate", performance: "-15.7%", status: "Crisis", color: "text-red-400" },
    { sector: "Agriculture", performance: "+8.9%", status: "Resilient", color: "text-green-400" }
  ];

  const tradeFlows = [
    { route: "Asia-Pacific ↔ North America", volume: "$2.1T", change: "-12%", status: "Declining" },
    { route: "Europe ↔ Asia", volume: "$1.8T", change: "-8%", status: "Stressed" },
    { route: "North America ↔ Europe", volume: "$1.2T", change: "+3%", status: "Stable" },
    { route: "Asia ↔ Middle East", volume: "$890B", change: "+15%", status: "Growing" },
    { route: "Africa ↔ Asia", volume: "$340B", change: "+22%", status: "Expanding" }
  ];

  const regions = ['global', 'Europe', 'Asia', 'Americas', 'Middle East', 'Africa'];
  const categories = ['all', 'Trade Analysis', 'Energy Security', 'Monetary Policy', 'Structural Crisis', 'Growth Analysis', 'Commodity Analysis'];
  const timeframes = ['current', 'quarterly', 'annual', 'historical'];

  const filteredData = economicData.filter(data => {
    const matchesRegion = selectedRegion === 'global' || data.region.toLowerCase() === selectedRegion.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || data.type === selectedCategory;
    return matchesRegion && matchesCategory;
  });

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      const reportData: ReportData = {
        region: selectedRegion,
        category: selectedCategory,
        timeframe: selectedTimeframe,
        economicData: filteredData,
        globalIndicators,
        economicRisks,
        sectorPerformance,
        tradeFlows
      };

      const generator = new ReportGenerator();
      
      let blob: Blob;
      let filename = `economic-intelligence-${selectedRegion}-${new Date().toISOString().split('T')[0]}`;
      
      switch (reportOptions.format) {
        case 'pdf':
          blob = generator.generatePDFReport(reportData, reportOptions);
          downloadReport(blob, filename, 'pdf');
          break;
          
        case 'json':
          const jsonContent = generator.generateJSONReport(reportData);
          blob = new Blob([jsonContent], { type: 'application/json' });
          downloadReport(blob, filename, 'json');
          break;
          
        case 'csv':
          const csvContent = generator.generateCSVReport(reportData);
          blob = new Blob([csvContent], { type: 'text/csv' });
          downloadReport(blob, filename, 'csv');
          break;
      }
      
      // Show success message
      setTimeout(() => {
        alert(`Report generated successfully! Check your downloads folder for ${filename}.${reportOptions.format}`);
      }, 500);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
      setShowReportOptions(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getProbabilityColor = (prob: string) => {
    switch (prob.toLowerCase()) {
      case 'very high': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-green-400" />
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 via-blue-300 to-green-500 bg-clip-text">
              Global Economic Intelligence
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Comprehensive economic analysis covering trade wars, energy transitions, monetary policy, and structural economic shifts
          </p>
        </div>

        {/* Global Economic Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {globalIndicators.map((indicator, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{indicator.name}</h3>
                <div className={`p-2 rounded-lg ${
                  indicator.trend === 'up' ? 'bg-red-500/20' : 
                  indicator.trend === 'down' ? 'bg-green-500/20' : 'bg-gray-500/20'
                }`}>
                  {indicator.trend === 'up' ? <TrendingUp className="w-4 h-4 text-red-400" /> :
                   indicator.trend === 'down' ? <TrendingDown className="w-4 h-4 text-green-400" /> :
                   <BarChart3 className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-3xl font-bold text-blue-400">{indicator.value}</p>
                <span className={`text-sm font-medium ${
                  indicator.trend === 'up' ? 'text-red-400' : 
                  indicator.trend === 'down' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {indicator.change}
                </span>
              </div>
              <p className="text-sm text-gray-400">{indicator.description}</p>
            </div>
          ))}
        </div>

        {/* Economic Risk Assessment */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-semibold text-white">Critical Economic Risks</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {economicRisks.map((risk, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-white">{risk.risk}</h4>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(risk.impact)}`}>
                      {risk.impact}
                    </span>
                    <span className={`text-xs font-medium ${getProbabilityColor(risk.probability)}`}>
                      {risk.probability}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">{risk.description}</p>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Most Affected:</p>
                  <div className="flex flex-wrap gap-1">
                    {risk.affectedCountries.map((country) => (
                      <span key={country} className="px-2 py-1 bg-slate-600 text-gray-300 rounded text-xs">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'global' ? 'Global Overview' : region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Timeframe</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              >
                {timeframes.map(timeframe => (
                  <option key={timeframe} value={timeframe}>
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Analysis
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowReportOptions(!showReportOptions)}
                disabled={isGeneratingReport}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGeneratingReport ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Economic Analysis Cards */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Detailed Economic Analysis</h3>
            <p className="text-gray-400">
              Showing {filteredData.length} of {economicData.length} analyses
            </p>
          </div>
          {filteredData.map(data => (
            <EconomicCard key={data.id} data={data} />
          ))}
        </div>

        {/* Economic Indicators Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Sectors Performance */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Factory className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Sector Performance</h3>
            </div>
            <div className="space-y-4">
              {sectorPerformance.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-gray-300">{item.sector}</span>
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${item.color}`}>{item.performance}</span>
                    <span className={`px-2 py-1 rounded text-xs ${item.color} bg-current bg-opacity-20`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Flow Analysis */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-semibold text-white">Global Trade Flows</h3>
            </div>
            <div className="space-y-4">
              {tradeFlows.map((route, index) => (
                <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm font-medium">{route.route}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      route.status === 'Growing' || route.status === 'Expanding' ? 'bg-green-500/20 text-green-400' :
                      route.status === 'Stable' ? 'bg-blue-500/20 text-blue-400' :
                      route.status === 'Stressed' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {route.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-medium">{route.volume}</span>
                    <span className={`text-sm ${
                      route.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {route.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report Options Modal - Fixed positioning */}
      {showReportOptions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Report Generation Options
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Export Format</label>
                <select
                  value={reportOptions.format}
                  onChange={(e) => setReportOptions({...reportOptions, format: e.target.value as 'pdf' | 'json' | 'csv'})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  <option value="pdf">📄 PDF Report (Recommended)</option>
                  <option value="json">📊 JSON Data Export</option>
                  <option value="csv">📈 CSV Spreadsheet</option>
                </select>
              </div>

              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-300">Include in Report:</h5>
                <label className="flex items-center gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={reportOptions.includeRiskAssessment}
                    onChange={(e) => setReportOptions({...reportOptions, includeRiskAssessment: e.target.checked})}
                    className="rounded bg-slate-700 border-slate-600 text-green-500 focus:ring-green-500"
                  />
                  <span>Risk Assessment & Analysis</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={reportOptions.includeRecommendations}
                    onChange={(e) => setReportOptions({...reportOptions, includeRecommendations: e.target.checked})}
                    className="rounded bg-slate-700 border-slate-600 text-green-500 focus:ring-green-500"
                  />
                  <span>Strategic Recommendations</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={reportOptions.includeCharts}
                    onChange={(e) => setReportOptions({...reportOptions, includeCharts: e.target.checked})}
                    className="rounded bg-slate-700 border-slate-600 text-green-500 focus:ring-green-500"
                  />
                  <span>Data Tables & Metrics</span>
                </label>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3 text-xs text-gray-400">
                <p><strong>Report will include:</strong></p>
                <ul className="mt-1 space-y-1">
                  <li>• Executive summary with key findings</li>
                  <li>• Global economic indicators analysis</li>
                  <li>• Detailed economic situation assessments</li>
                  <li>• Sector performance and trade flow data</li>
                  {reportOptions.includeRiskAssessment && <li>• Comprehensive risk assessment</li>}
                  {reportOptions.includeRecommendations && <li>• Strategic recommendations</li>}
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowReportOptions(false)}
                  className="px-4 py-3 bg-slate-600 text-gray-300 rounded-lg hover:bg-slate-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};