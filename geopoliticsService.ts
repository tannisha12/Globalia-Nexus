// Mock service for geopolitical data
// In production, this would connect to real intelligence APIs and databases

export const getGlobalThreatLevel = async (): Promise<number> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return 5; // Critical threat level due to Iran-Israel-US escalation
};

export const getLatestAnalyses = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: 1,
      title: "Iran-Israel-US Military Escalation",
      region: "Middle East",
      severity: "Critical",
      date: "2025-01-20",
      summary: "Unprecedented military escalation threatens regional war with global implications as Iran launches ballistic missiles at Israeli targets."
    },
    {
      id: 2,
      title: "India-Pakistan Kashmir Tensions Escalate",
      region: "South Asia",
      severity: "High",
      date: "2025-01-15",
      summary: "Cross-border shelling increases in Kashmir region with military buildup on both sides of Line of Control."
    },
    {
      id: 3,
      title: "China-India Border Standoff Analysis",
      region: "South Asia",
      severity: "High",
      date: "2025-01-15",
      summary: "LAC tensions persist with infrastructure development and military positioning in Ladakh and Arunachal Pradesh."
    },
    {
      id: 4,
      title: "North Korea Nuclear Program Assessment",
      region: "East Asia",
      severity: "Critical",
      date: "2025-01-14",
      summary: "Intelligence indicates accelerated uranium enrichment and missile testing program expansion."
    },
    {
      id: 5,
      title: "Ethiopia-Tigray Conflict Spillover",
      region: "Africa",
      severity: "High",
      date: "2025-01-13",
      summary: "Regional instability spreads as humanitarian crisis deepens in Horn of Africa."
    },
    {
      id: 6,
      title: "European Energy Security Assessment",
      region: "Europe",
      severity: "Medium",
      date: "2025-01-13",
      summary: "Winter energy supplies stable but vulnerability to supply disruptions remains elevated."
    }
  ];
};

export const getActiveConflicts = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    {
      id: 1,
      name: "Iran-Israel-US Escalation",
      region: "Middle East",
      severity: "Critical",
      lastUpdate: "2025-01-20",
      keyDevelopments: ["Iran launches ballistic missiles at Israeli bases", "Israel strikes Iranian nuclear facilities", "US deploys carrier strike groups"]
    },
    {
      id: 2,
      name: "Russia-Ukraine War",
      region: "Eastern Europe",
      severity: "Critical",
      lastUpdate: "2025-01-15",
      keyDevelopments: ["Winter offensive operations continue", "Western aid packages approved", "Energy infrastructure targeted"]
    },
    {
      id: 3,
      name: "India-Pakistan Kashmir Dispute",
      region: "South Asia",
      severity: "High",
      lastUpdate: "2025-01-15",
      keyDevelopments: ["Cross-border shelling incidents", "Military buildup on LOC", "Diplomatic channels strained"]
    },
    {
      id: 4,
      name: "China-India Border Tensions",
      region: "South Asia",
      severity: "High",
      lastUpdate: "2025-01-15",
      keyDevelopments: ["LAC infrastructure development", "Military face-offs in Ladakh", "Diplomatic talks ongoing"]
    },
    {
      id: 5,
      name: "Israel-Palestine Conflict",
      region: "Middle East",
      severity: "High",
      lastUpdate: "2025-01-14",
      keyDevelopments: ["Ceasefire negotiations ongoing", "Humanitarian corridors established", "Regional tensions persist"]
    },
    {
      id: 6,
      name: "North Korea Nuclear Crisis",
      region: "East Asia",
      severity: "Critical",
      lastUpdate: "2025-01-14",
      keyDevelopments: ["Missile testing program active", "Nuclear facility expansion", "Six-party talks stalled"]
    },
    {
      id: 7,
      name: "Sudan Civil War",
      region: "Africa",
      severity: "Critical",
      lastUpdate: "2025-01-13",
      keyDevelopments: ["RSF advances in western regions", "Humanitarian crisis deepening", "Regional mediation efforts"]
    },
    {
      id: 8,
      name: "Ethiopia-Tigray Conflict",
      region: "Africa",
      severity: "High",
      lastUpdate: "2025-01-13",
      keyDevelopments: ["Ceasefire violations reported", "Humanitarian access limited", "Regional spillover effects"]
    },
    {
      id: 9,
      name: "Myanmar Civil Conflict",
      region: "Southeast Asia",
      severity: "High",
      lastUpdate: "2025-01-12",
      keyDevelopments: ["Opposition forces gaining ground", "Military junta losing control", "ASEAN mediation attempts"]
    }
  ];
};