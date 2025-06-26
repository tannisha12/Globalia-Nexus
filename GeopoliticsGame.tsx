import React, { useState, useEffect } from 'react';
import { Gamepad2, Crown, Sword, DollarSign, Users, Zap, AlertTriangle, TrendingUp, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Country {
  id: string;
  name: string;
  flag: string;
  population: number;
  gdp: number;
  military: number;
  stability: number;
  resources: {
    oil: number;
    minerals: number;
    agriculture: number;
  };
  relationships: { [key: string]: number }; // -100 to 100
  isPlayer: boolean;
}

interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: {
    id: string;
    text: string;
    consequences: {
      gdp?: number;
      military?: number;
      stability?: number;
      relationships?: { [key: string]: number };
    };
  }[];
}

interface GameState {
  turn: number;
  playerCountry: Country;
  aiCountries: Country[];
  events: GameEvent[];
  gameLog: string[];
  score: number;
}

const initialCountries: Country[] = [
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    population: 331,
    gdp: 100,
    military: 95,
    stability: 85,
    resources: { oil: 70, minerals: 60, agriculture: 90 },
    relationships: { china: -20, russia: -30, india: 60, uk: 90 },
    isPlayer: false
  },
  {
    id: 'china',
    name: 'China',
    flag: '🇨🇳',
    population: 1440,
    gdp: 85,
    military: 90,
    stability: 80,
    resources: { oil: 40, minerals: 95, agriculture: 75 },
    relationships: { usa: -20, russia: 40, india: -40, pakistan: 70 },
    isPlayer: false
  },
  {
    id: 'russia',
    name: 'Russia',
    flag: '🇷🇺',
    population: 146,
    gdp: 45,
    military: 85,
    stability: 60,
    resources: { oil: 95, minerals: 90, agriculture: 60 },
    relationships: { usa: -30, china: 40, india: 50, ukraine: -80 },
    isPlayer: false
  },
  {
    id: 'india',
    name: 'India',
    flag: '🇮🇳',
    population: 1380,
    gdp: 60,
    military: 70,
    stability: 70,
    resources: { oil: 30, minerals: 70, agriculture: 80 },
    relationships: { usa: 60, china: -40, russia: 50, pakistan: -60 },
    isPlayer: false
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    flag: '🇵🇰',
    population: 225,
    gdp: 25,
    military: 60,
    stability: 45,
    resources: { oil: 20, minerals: 40, agriculture: 70 },
    relationships: { china: 70, india: -60, usa: 20, afghanistan: 30 },
    isPlayer: false
  }
];

const gameEvents: GameEvent[] = [
  {
    id: 'border_tension',
    title: 'Border Tensions Escalate',
    description: 'Military skirmishes have broken out along your border with a neighboring country. How do you respond?',
    choices: [
      {
        id: 'military_response',
        text: 'Deploy additional troops to the border',
        consequences: { military: -5, stability: -10, relationships: { neighbor: -20 } }
      },
      {
        id: 'diplomatic_solution',
        text: 'Seek diplomatic resolution through talks',
        consequences: { stability: 5, relationships: { neighbor: 10 } }
      },
      {
        id: 'international_mediation',
        text: 'Request international mediation',
        consequences: { relationships: { usa: 5, china: 5 } }
      }
    ]
  },
  {
    id: 'economic_crisis',
    title: 'Economic Downturn',
    description: 'Your country faces an economic recession. What measures do you implement?',
    choices: [
      {
        id: 'austerity',
        text: 'Implement austerity measures',
        consequences: { gdp: 5, stability: -15 }
      },
      {
        id: 'stimulus',
        text: 'Launch economic stimulus package',
        consequences: { gdp: -5, stability: 10 }
      },
      {
        id: 'foreign_aid',
        text: 'Seek international financial assistance',
        consequences: { gdp: 10, relationships: { usa: -5, china: -5 } }
      }
    ]
  },
  {
    id: 'nuclear_program',
    title: 'Nuclear Program Decision',
    description: 'Your scientists have developed nuclear capabilities. What is your policy?',
    choices: [
      {
        id: 'weapons_program',
        text: 'Develop nuclear weapons',
        consequences: { military: 20, stability: -10, relationships: { usa: -30, china: -20 } }
      },
      {
        id: 'peaceful_use',
        text: 'Focus on peaceful nuclear energy',
        consequences: { gdp: 10, relationships: { usa: 10 } }
      },
      {
        id: 'abandon_program',
        text: 'Abandon nuclear program entirely',
        consequences: { relationships: { usa: 20, china: 10 } }
      }
    ]
  }
];

const CountryCard = ({ country, isSelected, onClick }: { country: Country; isSelected: boolean; onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-xl border cursor-pointer transition-all ${
      isSelected
        ? 'bg-blue-500/20 border-blue-500/50'
        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
    }`}
    onClick={onClick}
  >
    <div className="text-center">
      <div className="text-4xl mb-3">{country.flag}</div>
      <h3 className="text-xl font-bold text-white mb-2">{country.name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-400">GDP:</span>
          <span className="text-green-400 ml-1">{country.gdp}</span>
        </div>
        <div>
          <span className="text-gray-400">Military:</span>
          <span className="text-red-400 ml-1">{country.military}</span>
        </div>
        <div>
          <span className="text-gray-400">Population:</span>
          <span className="text-blue-400 ml-1">{country.population}M</span>
        </div>
        <div>
          <span className="text-gray-400">Stability:</span>
          <span className="text-yellow-400 ml-1">{country.stability}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const GameDashboard = ({ gameState, onAction }: { gameState: GameState; onAction: (action: string) => void }) => {
  const { playerCountry, turn, score } = gameState;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Country Status */}
      <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{playerCountry.flag}</span>
          <div>
            <h2 className="text-2xl font-bold text-white">{playerCountry.name}</h2>
            <p className="text-gray-400">Turn {turn} • Score: {score}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-400">{playerCountry.gdp}</p>
            <p className="text-xs text-gray-400">GDP Index</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <Sword className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-400">{playerCountry.military}</p>
            <p className="text-xs text-gray-400">Military</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-400">{playerCountry.population}M</p>
            <p className="text-xs text-gray-400">Population</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-400">{playerCountry.stability}</p>
            <p className="text-xs text-gray-400">Stability</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Resources</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <p className="text-sm text-gray-400">Oil</p>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                <div
                  className="bg-orange-400 h-2 rounded-full"
                  style={{ width: `${playerCountry.resources.oil}%` }}
                />
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <p className="text-sm text-gray-400">Minerals</p>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                <div
                  className="bg-purple-400 h-2 rounded-full"
                  style={{ width: `${playerCountry.resources.minerals}%` }}
                />
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <p className="text-sm text-gray-400">Agriculture</p>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: `${playerCountry.resources.agriculture}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Available Actions</h3>
        <div className="space-y-3">
          <button
            onClick={() => onAction('diplomacy')}
            className="w-full p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all"
          >
            <Globe className="w-4 h-4 inline mr-2" />
            Diplomacy
          </button>
          <button
            onClick={() => onAction('military')}
            className="w-full p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
          >
            <Sword className="w-4 h-4 inline mr-2" />
            Military
          </button>
          <button
            onClick={() => onAction('economy')}
            className="w-full p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-all"
          >
            <DollarSign className="w-4 h-4 inline mr-2" />
            Economy
          </button>
          <button
            onClick={() => onAction('intelligence')}
            className="w-full p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all"
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Intelligence
          </button>
        </div>
      </div>
    </div>
  );
};

const EventModal = ({ event, onChoice }: { event: GameEvent; onChoice: (choiceId: string) => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">{event.title}</h3>
      </div>
      
      <p className="text-gray-300 mb-6">{event.description}</p>
      
      <div className="space-y-3">
        {event.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onChoice(choice.id)}
            className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-left hover:bg-slate-700 transition-all"
          >
            <p className="text-white font-medium">{choice.text}</p>
          </button>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export const GeopoliticsGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

  const startGame = () => {
    if (!selectedCountry) return;

    const playerCountry = { ...initialCountries.find(c => c.id === selectedCountry)!, isPlayer: true };
    const aiCountries = initialCountries.filter(c => c.id !== selectedCountry);

    setGameState({
      turn: 1,
      playerCountry,
      aiCountries,
      events: [...gameEvents],
      gameLog: [`Game started as ${playerCountry.name}`],
      score: 1000
    });
    setGameStarted(true);
  };

  const handleAction = (action: string) => {
    if (!gameState) return;

    // Trigger random event
    const randomEvent = gameEvents[Math.floor(Math.random() * gameEvents.length)];
    setCurrentEvent(randomEvent);
  };

  const handleEventChoice = (choiceId: string) => {
    if (!currentEvent || !gameState) return;

    const choice = currentEvent.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Apply consequences
    const updatedCountry = { ...gameState.playerCountry };
    if (choice.consequences.gdp) updatedCountry.gdp += choice.consequences.gdp;
    if (choice.consequences.military) updatedCountry.military += choice.consequences.military;
    if (choice.consequences.stability) updatedCountry.stability += choice.consequences.stability;

    setGameState({
      ...gameState,
      playerCountry: updatedCountry,
      turn: gameState.turn + 1,
      gameLog: [...gameState.gameLog, `${currentEvent.title}: ${choice.text}`],
      score: gameState.score + (choice.consequences.gdp || 0) * 10
    });

    setCurrentEvent(null);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gamepad2 className="w-10 h-10 text-purple-400" />
              <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 bg-clip-text">
                Geopolitics Strategy Game
              </h2>
            </div>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Take control of a nation and navigate complex international relations, economic challenges, and military conflicts
            </p>
          </div>

          {/* Game Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Lead a Nation</h3>
              <p className="text-gray-400 text-sm">Make strategic decisions as a world leader</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
              <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Diplomacy</h3>
              <p className="text-gray-400 text-sm">Build alliances and manage relationships</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
              <Sword className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Military</h3>
              <p className="text-gray-400 text-sm">Manage defense and resolve conflicts</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Consequences</h3>
              <p className="text-gray-400 text-sm">See real-world impacts of your decisions</p>
            </div>
          </div>

          {/* Country Selection */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Country</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialCountries.map((country) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  isSelected={selectedCountry === country.id}
                  onClick={() => setSelectedCountry(country.id)}
                />
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startGame}
              disabled={!selectedCountry}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {gameState && (
          <>
            <GameDashboard gameState={gameState} onAction={handleAction} />
            
            {/* Game Log */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Game Log</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {gameState.gameLog.map((log, index) => (
                  <p key={index} className="text-gray-400 text-sm">
                    Turn {index + 1}: {log}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Event Modal */}
        <AnimatePresence>
          {currentEvent && (
            <EventModal event={currentEvent} onChoice={handleEventChoice} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};