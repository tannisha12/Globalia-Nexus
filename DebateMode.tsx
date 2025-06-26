import React, { useState } from 'react';
import { MessageSquare, Users, Zap, Brain, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DebateMessage {
  id: string;
  side: 'pro' | 'con';
  message: string;
  timestamp: Date;
  strength: number;
}

interface DebateTopic {
  id: string;
  title: string;
  description: string;
  proPosition: string;
  conPosition: string;
  complexity: 'Beginner' | 'Intermediate' | 'Expert';
}

const debateTopics: DebateTopic[] = [
  {
    id: '1',
    title: 'NATO Expansion vs. Russian Security',
    description: 'Should NATO continue eastward expansion despite Russian security concerns?',
    proPosition: 'NATO expansion promotes democracy and security',
    conPosition: 'NATO expansion threatens Russian security and stability',
    complexity: 'Expert'
  },
  {
    id: '2',
    title: 'China\'s Taiwan Policy',
    description: 'Is China\'s approach to Taiwan reunification justified?',
    proPosition: 'Taiwan is historically part of China and should reunify',
    conPosition: 'Taiwan has the right to self-determination and independence',
    complexity: 'Expert'
  },
  {
    id: '3',
    title: 'Economic Sanctions Effectiveness',
    description: 'Are economic sanctions an effective tool for international diplomacy?',
    proPosition: 'Sanctions are effective non-violent diplomatic tools',
    conPosition: 'Sanctions harm civilians and rarely achieve political goals',
    complexity: 'Intermediate'
  },
  {
    id: '4',
    title: 'Nuclear Deterrence Strategy',
    description: 'Does nuclear deterrence make the world safer or more dangerous?',
    proPosition: 'Nuclear deterrence prevents major wars and maintains stability',
    conPosition: 'Nuclear weapons increase risks and should be eliminated',
    complexity: 'Expert'
  },
  {
    id: '5',
    title: 'Humanitarian Intervention',
    description: 'When is military intervention justified for humanitarian reasons?',
    proPosition: 'International community has responsibility to protect civilians',
    conPosition: 'Military intervention violates sovereignty and often backfires',
    complexity: 'Intermediate'
  }
];

const DebateTopicCard = ({ topic, onSelect }: { topic: DebateTopic; onSelect: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 cursor-pointer hover:border-blue-500/50 transition-all"
    onClick={onSelect}
  >
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-xl font-semibold text-white">{topic.title}</h3>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        topic.complexity === 'Expert' ? 'bg-red-500/20 text-red-400' :
        topic.complexity === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-green-500/20 text-green-400'
      }`}>
        {topic.complexity}
      </span>
    </div>
    
    <p className="text-gray-300 mb-4">{topic.description}</p>
    
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-3 h-3 bg-green-400 rounded-full mt-1.5"></div>
        <div>
          <p className="text-sm font-medium text-green-400">Pro Position</p>
          <p className="text-sm text-gray-400">{topic.proPosition}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="w-3 h-3 bg-red-400 rounded-full mt-1.5"></div>
        <div>
          <p className="text-sm font-medium text-red-400">Con Position</p>
          <p className="text-sm text-gray-400">{topic.conPosition}</p>
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-end mt-4">
      <span className="text-blue-400 text-sm flex items-center gap-1">
        Start Debate <ArrowRight size={16} />
      </span>
    </div>
  </motion.div>
);

const DebateInterface = ({ topic, onBack }: { topic: DebateTopic; onBack: () => void }) => {
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [userSide, setUserSide] = useState<'pro' | 'con' | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const [round, setRound] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const generateAIResponse = (userMessage: string, side: 'pro' | 'con'): string => {
    const aiSide = side === 'pro' ? 'con' : 'pro';
    
    if (topic.id === '1') { // NATO Expansion
      if (aiSide === 'pro') {
        return "NATO expansion has been crucial for European security and democracy. Countries like Poland, Estonia, and Latvia have flourished under NATO protection, developing stronger democratic institutions and economic growth. The alliance operates on voluntary membership - no country is forced to join. Russia's concerns about security are often used to mask its imperial ambitions to control neighboring states.";
      } else {
        return "NATO expansion has systematically violated promises made to Russia after the Cold War and created unnecessary tensions. The alliance's eastward movement has encircled Russia, forcing it into a defensive posture. This has destabilized European security architecture and contributed to conflicts in Georgia, Ukraine, and other regions. A neutral buffer zone would have been more conducive to peace.";
      }
    }
    
    if (topic.id === '2') { // Taiwan
      if (aiSide === 'pro') {
        return "Taiwan has been separated from mainland China since 1949 and has developed its own democratic government, economy, and identity. The principle of self-determination, enshrined in international law, supports Taiwan's right to choose its future. Forced reunification would violate the will of 23 million Taiwanese people who have built a free society.";
      } else {
        return "Taiwan is an inalienable part of China's territory, recognized by the UN and most countries under the One China policy. Historical, cultural, and legal ties bind Taiwan to the mainland. The island's separation was caused by civil war, not legitimate independence. Peaceful reunification under 'One Country, Two Systems' offers the best path forward for all Chinese people.";
      }
    }
    
    // Default responses for other topics
    if (aiSide === 'pro') {
      return "Your argument raises valid concerns, but we must consider the broader strategic implications and historical precedents that support this position. The evidence suggests that this approach, while not perfect, offers the most viable path forward for international stability and security.";
    } else {
      return "While that perspective has merit, it overlooks significant risks and unintended consequences. Historical examples show that such approaches often backfire, creating more problems than they solve. We need to prioritize long-term stability over short-term gains.";
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !userSide) return;

    const userMessage: DebateMessage = {
      id: Date.now().toString(),
      side: userSide,
      message: userInput,
      timestamp: new Date(),
      strength: Math.floor(Math.random() * 20) + 80 // 80-100 for user messages
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsAITyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: DebateMessage = {
        id: (Date.now() + 1).toString(),
        side: userSide === 'pro' ? 'con' : 'pro',
        message: generateAIResponse(userInput, userSide),
        timestamp: new Date(),
        strength: Math.floor(Math.random() * 25) + 75 // 75-100 for AI
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsAITyping(false);
      setRound(prev => prev + 1);
    }, 2000);
  };

  const selectSide = (side: 'pro' | 'con') => {
    setUserSide(side);
    
    // AI opens with initial argument
    const aiSide = side === 'pro' ? 'con' : 'pro';
    const openingMessage: DebateMessage = {
      id: Date.now().toString(),
      side: aiSide,
      message: `I'll argue the ${aiSide === 'pro' ? 'pro' : 'con'} position. ${generateAIResponse('', side)}`,
      timestamp: new Date(),
      strength: 85
    };
    
    setMessages([openingMessage]);
  };

  if (!userSide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Topics
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">{topic.title}</h2>
            <p className="text-gray-400 text-lg">{topic.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 cursor-pointer"
              onClick={() => selectSide('pro')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-3">Argue PRO</h3>
                <p className="text-gray-300">{topic.proPosition}</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 cursor-pointer"
              onClick={() => selectSide('con')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-400 mb-3">Argue CON</h3>
                <p className="text-gray-300">{topic.conPosition}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">{topic.title}</h2>
              <p className="text-gray-400 text-sm">Round {round} • AI Debate Mode</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">You:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                userSide === 'pro' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {userSide?.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-lg bg-slate-700 text-gray-400 hover:text-white transition-colors"
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.side === userSide ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl p-4 rounded-xl ${
                  message.side === userSide
                    ? userSide === 'pro'
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-red-500/20 border border-red-500/30'
                    : message.side === 'pro'
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-medium ${
                      message.side === 'pro' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {message.side === userSide ? 'You' : 'AI'} ({message.side.toUpperCase()})
                    </span>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">{message.strength}%</span>
                    </div>
                  </div>
                  <p className="text-gray-200">{message.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isAITyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className={`p-4 rounded-xl ${
                userSide === 'pro'
                  ? 'bg-red-500/10 border border-red-500/20'
                  : 'bg-green-500/10 border border-green-500/20'
              }`}>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span className="text-gray-400">AI is formulating response...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Present your argument..."
            className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            disabled={isAITyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isAITyping}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Argue
          </button>
        </div>
      </div>
    </div>
  );
};

export const DebateMode: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(null);

  if (selectedTopic) {
    return (
      <DebateInterface
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-10 h-10 text-orange-400" />
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-400 via-red-300 to-orange-500 bg-clip-text">
              AI Debate Mode
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Engage in structured debates on complex geopolitical issues. AI argues both sides with sophisticated reasoning.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
            <Brain className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Opponent</h3>
            <p className="text-gray-400 text-sm">Advanced AI that argues with nuanced reasoning and historical context</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Both Sides</h3>
            <p className="text-gray-400 text-sm">Choose your position and let AI argue the opposing viewpoint</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Strength Scoring</h3>
            <p className="text-gray-400 text-sm">Real-time analysis of argument strength and persuasiveness</p>
          </div>
        </div>

        {/* Debate Topics */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Choose a Debate Topic</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {debateTopics.map((topic) => (
              <DebateTopicCard
                key={topic.id}
                topic={topic}
                onSelect={() => setSelectedTopic(topic)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};