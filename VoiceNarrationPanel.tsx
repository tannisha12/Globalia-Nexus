import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Play, Pause, RotateCcw, MessageCircle, Brain, Headphones, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceNarrationProps {
  isActive: boolean;
  currentScenario: string;
  currentRegion: string;
  onToggle: () => void;
  onQuestionAsked: (question: string) => void;
}

interface NarrationScenario {
  id: string;
  title: string;
  description: string;
  duration: number;
  regions: string[];
  keyPoints: string[];
  interactiveElements: string[];
}

interface VoiceSettings {
  speed: number;
  pitch: number;
  volume: number;
  voice: string;
  autoPlay: boolean;
  pauseOnQuestion: boolean;
}

const narrationScenarios: NarrationScenario[] = [
  {
    id: 'iran-israel-escalation',
    title: 'Iran-Israel-US Military Escalation',
    description: 'Real-time analysis of the current Middle East crisis with strategic implications',
    duration: 180,
    regions: ['Iran', 'Israel', 'United States', 'Lebanon', 'Syria'],
    keyPoints: [
      'Iran launches 200+ ballistic missiles at Israeli military targets',
      'Israel responds with massive airstrikes on Iranian nuclear facilities',
      'US deploys 3 carrier strike groups to Persian Gulf',
      'Hezbollah activates from Lebanon with 150,000+ rockets',
      'Oil prices surge 40% as Strait of Hormuz threatened'
    ],
    interactiveElements: [
      'Why did Iran choose this moment to escalate?',
      'What are the nuclear implications?',
      'How might this affect global oil markets?',
      'What role does China play in this conflict?'
    ]
  },
  {
    id: 'ukraine-war-analysis',
    title: 'Russia-Ukraine Conflict Deep Dive',
    description: 'Comprehensive analysis of the ongoing war and its global implications',
    duration: 240,
    regions: ['Ukraine', 'Russia', 'NATO', 'EU'],
    keyPoints: [
      'Winter campaign strategy and energy warfare',
      'Western military aid and weapons systems',
      'Economic impact of sanctions on Russia',
      'Humanitarian crisis and refugee situation',
      'Long-term implications for European security'
    ],
    interactiveElements: [
      'How effective are Western sanctions?',
      'What is Russia\'s endgame strategy?',
      'How has NATO unity been maintained?',
      'What are the reconstruction challenges?'
    ]
  },
  {
    id: 'kashmir-tensions',
    title: 'India-Pakistan Kashmir Crisis',
    description: 'Analysis of the world\'s most dangerous nuclear flashpoint',
    duration: 150,
    regions: ['India', 'Pakistan', 'Kashmir'],
    keyPoints: [
      'Cross-border shelling incidents increase 300%',
      'Military buildup along Line of Control',
      'Nuclear doctrine and escalation risks',
      'International mediation efforts',
      'Impact on regional stability'
    ],
    interactiveElements: [
      'Why is Kashmir so strategically important?',
      'How do nuclear weapons change the calculus?',
      'What role does China play in this dispute?',
      'How can this conflict be resolved?'
    ]
  },
  {
    id: 'taiwan-strait-crisis',
    title: 'Taiwan Strait Military Tensions',
    description: 'Analysis of potential conflict scenarios and global implications',
    duration: 200,
    regions: ['China', 'Taiwan', 'United States', 'Japan'],
    keyPoints: [
      'PLA military exercises and naval presence',
      'Taiwan\'s defensive capabilities and vulnerabilities',
      'US military commitments and strategic ambiguity',
      'Economic implications for global supply chains',
      'QUAD alliance coordination and response'
    ],
    interactiveElements: [
      'What would a Chinese blockade look like?',
      'How would the US respond to invasion?',
      'What are the semiconductor implications?',
      'How does this affect Japan and South Korea?'
    ]
  },
  {
    id: 'north-korea-nuclear',
    title: 'North Korea Nuclear Program Assessment',
    description: 'Deep dive into DPRK capabilities and regional security implications',
    duration: 120,
    regions: ['North Korea', 'South Korea', 'United States', 'China'],
    keyPoints: [
      'Estimated 70-100 nuclear warheads in arsenal',
      'ICBM testing program and delivery capabilities',
      'Submarine-launched ballistic missile development',
      'Regional arms race implications',
      'Diplomatic engagement possibilities'
    ],
    interactiveElements: [
      'How advanced is North Korea\'s nuclear program?',
      'What are Kim Jong-un\'s strategic objectives?',
      'How does China influence North Korea?',
      'What are the denuclearization prospects?'
    ]
  }
];

const VoiceControls = ({ 
  isPlaying, 
  onPlayPause, 
  onRestart, 
  settings, 
  onSettingsChange,
  progress,
  speechSupported,
  voicesAvailable,
  audioStatus
}: any) => (
  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-medium text-white flex items-center gap-2">
        <Headphones className="w-4 h-4 text-purple-400" />
        Voice Controls
        {!speechSupported && (
          <span className="text-xs text-red-400">(Speech not supported)</span>
        )}
        {audioStatus && (
          <div className={`w-2 h-2 rounded-full ${
            audioStatus === 'playing' ? 'bg-green-400 animate-pulse' :
            audioStatus === 'loading' ? 'bg-yellow-400 animate-spin' :
            audioStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
          }`} />
        )}
      </h4>
      <div className="flex items-center gap-2">
        <button
          onClick={onPlayPause}
          disabled={!speechSupported}
          className={`p-2 rounded-lg transition-all ${
            !speechSupported ? 'opacity-50 cursor-not-allowed' :
            isPlaying 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={onRestart}
          disabled={!speechSupported}
          className={`p-2 rounded-lg transition-colors ${
            !speechSupported ? 'opacity-50 cursor-not-allowed' :
            'bg-slate-600 text-gray-400 hover:text-orange-400'
          }`}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>

    {/* Audio Status */}
    {audioStatus && (
      <div className="mb-3 text-xs">
        <span className="text-gray-400">Audio Status: </span>
        <span className={`font-medium ${
          audioStatus === 'playing' ? 'text-green-400' :
          audioStatus === 'loading' ? 'text-yellow-400' :
          audioStatus === 'error' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {audioStatus.charAt(0).toUpperCase() + audioStatus.slice(1)}
        </span>
      </div>
    )}

    {/* Progress Bar */}
    <div className="mb-4">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-2">
        <div 
          className="bg-purple-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>

    {/* Voice Settings */}
    {speechSupported && (
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Speed (Optimized for clarity)</label>
          <input
            type="range"
            min="0.7"
            max="1.3"
            step="0.1"
            value={settings.speed}
            onChange={(e) => onSettingsChange({ ...settings, speed: parseFloat(e.target.value) })}
            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-gray-500 text-center">{settings.speed}x</div>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Volume</label>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={(e) => onSettingsChange({ ...settings, volume: parseFloat(e.target.value) })}
            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-gray-500 text-center">{Math.round(settings.volume * 100)}%</div>
        </div>

        {voicesAvailable.length > 0 && (
          <div>
            <label className="text-xs text-gray-400 block mb-1">Voice (High Quality)</label>
            <select
              value={settings.voice}
              onChange={(e) => onSettingsChange({ ...settings, voice: e.target.value })}
              className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-xs"
            >
              {voicesAvailable
                .filter((voice: any) => voice.lang.startsWith('en'))
                .map((voice: any, index: number) => (
                <option key={index} value={voice.name}>
                  {voice.name} ({voice.lang}) {voice.default ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Smooth playback</span>
          <button
            onClick={() => onSettingsChange({ ...settings, autoPlay: !settings.autoPlay })}
            className={`w-8 h-4 rounded-full transition-all ${
              settings.autoPlay ? 'bg-purple-500' : 'bg-slate-600'
            }`}
          >
            <div className={`w-3 h-3 bg-white rounded-full transition-all ${
              settings.autoPlay ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>
    )}

    {!speechSupported && (
      <div className="bg-yellow-900/50 border border-yellow-500/30 rounded-lg p-3 mt-3">
        <p className="text-yellow-300 text-xs">
          Speech synthesis not supported in this browser. Try Chrome, Firefox, or Safari for voice features.
        </p>
      </div>
    )}
  </div>
);

const ScenarioSelector = ({ 
  scenarios, 
  selectedScenario, 
  onScenarioChange,
  isPlaying 
}: any) => (
  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
      <Brain className="w-4 h-4 text-blue-400" />
      Narration Scenarios
    </h4>
    <div className="space-y-2">
      {scenarios.map((scenario: NarrationScenario) => (
        <motion.button
          key={scenario.id}
          onClick={() => !isPlaying && onScenarioChange(scenario)}
          disabled={isPlaying}
          whileHover={{ scale: isPlaying ? 1 : 1.02 }}
          className={`w-full p-3 rounded-lg border text-left transition-all ${
            selectedScenario?.id === scenario.id
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
              : isPlaying
              ? 'bg-slate-600/50 border-slate-600 text-gray-500 cursor-not-allowed'
              : 'bg-slate-600/50 border-slate-600 text-gray-300 hover:border-slate-500 hover:bg-slate-600/70'
          }`}
        >
          <h5 className="font-medium mb-1">{scenario.title}</h5>
          <p className="text-xs text-gray-400 mb-2">{scenario.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{scenario.duration}s duration</span>
            <span className="text-gray-500">{scenario.regions.length} regions</span>
          </div>
        </motion.button>
      ))}
    </div>
  </div>
);

const InteractiveQA = ({ 
  scenario, 
  isListening, 
  onToggleListening, 
  onQuestionSubmit,
  recentQuestions,
  speechRecognitionSupported
}: any) => {
  const [textQuestion, setTextQuestion] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSubmit = (question: string) => {
    if (question.trim()) {
      onQuestionSubmit(question.trim());
      setTextQuestion('');
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-green-400" />
        Interactive Q&A
        {!speechRecognitionSupported && (
          <span className="text-xs text-yellow-400">(Voice input not available)</span>
        )}
      </h4>

      {/* Voice Input */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={onToggleListening}
          disabled={!speechRecognitionSupported}
          className={`p-2 rounded-lg transition-all ${
            !speechRecognitionSupported ? 'opacity-50 cursor-not-allowed' :
            isListening
              ? 'bg-red-500/20 text-red-400 animate-pulse'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
          title={
            !speechRecognitionSupported ? 'Voice input not supported' :
            isListening ? 'Stop listening' : 'Start voice input'
          }
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        <input
          type="text"
          value={textQuestion}
          onChange={(e) => setTextQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(textQuestion)}
          placeholder={isListening ? 'Listening...' : 'Ask about this scenario...'}
          className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 text-sm"
          disabled={isListening}
        />
        <button
          onClick={() => handleSubmit(textQuestion)}
          disabled={!textQuestion.trim()}
          className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Ask
        </button>
      </div>

      {/* Suggested Questions */}
      {showSuggestions && scenario && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
          <div className="space-y-1">
            {scenario.interactiveElements.slice(0, 3).map((question: string, index: number) => (
              <button
                key={index}
                onClick={() => handleSubmit(question)}
                className="w-full text-left p-2 bg-slate-600/50 hover:bg-slate-600 rounded text-xs text-gray-300 transition-colors"
              >
                "{question}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Questions */}
      {recentQuestions.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Recent questions:</p>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {recentQuestions.slice(-3).map((q: any, index: number) => (
              <div key={index} className="text-xs text-gray-500 p-1">
                Q: {q.question}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NarrationTranscript = ({ 
  currentText, 
  isActive, 
  scenario 
}: { 
  currentText: string; 
  isActive: boolean; 
  scenario: NarrationScenario | null;
}) => (
  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-medium text-white flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-purple-400" />
        Live Transcript
      </h4>
      {isActive && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400">Live</span>
        </div>
      )}
    </div>

    <div className="bg-slate-800/50 rounded-lg p-3 min-h-24 max-h-32 overflow-y-auto">
      {scenario && (
        <div className="mb-2 pb-2 border-b border-slate-600">
          <h5 className="text-sm font-medium text-blue-400">{scenario.title}</h5>
          <p className="text-xs text-gray-400">{scenario.description}</p>
        </div>
      )}
      
      <div className="text-sm text-gray-300 leading-relaxed">
        {currentText || (
          <span className="text-gray-500 italic">
            {isActive ? 'Narration will appear here...' : 'Select a scenario to begin narration'}
          </span>
        )}
      </div>
    </div>

    {scenario && (
      <div className="mt-3 text-xs text-gray-500">
        Regions covered: {scenario.regions.join(', ')}
      </div>
    )}
  </div>
);

export const VoiceNarrationPanel: React.FC<VoiceNarrationProps> = ({
  isActive,
  currentScenario,
  currentRegion,
  onToggle,
  onQuestionAsked
}) => {
  const [selectedScenario, setSelectedScenario] = useState<NarrationScenario | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentNarrationText, setCurrentNarrationText] = useState('');
  const [recentQuestions, setRecentQuestions] = useState<any[]>([]);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [voicesAvailable, setVoicesAvailable] = useState<any[]>([]);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const [settings, setSettings] = useState<VoiceSettings>({
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8,
    voice: 'default',
    autoPlay: true,
    pauseOnQuestion: true
  });

  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isProcessingAudioRef = useRef(false);

  // Initialize speech capabilities with better error handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check speech synthesis support
      if ('speechSynthesis' in window) {
        speechSynthesisRef.current = window.speechSynthesis;
        setSpeechSupported(true);
        
        // Load available voices with retry mechanism
        const loadVoices = () => {
          const voices = speechSynthesisRef.current?.getVoices() || [];
          if (voices.length > 0) {
            // Filter for high-quality English voices
            const englishVoices = voices.filter(voice => 
              voice.lang.startsWith('en') && 
              (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.default)
            );
            setVoicesAvailable(englishVoices.length > 0 ? englishVoices : voices);
            
            if (voices.length > 0 && settings.voice === 'default') {
              const preferredVoice = englishVoices.find(v => v.default) || englishVoices[0] || voices[0];
              setSettings(prev => ({ ...prev, voice: preferredVoice.name }));
            }
          }
        };
        
        // Try loading voices immediately
        loadVoices();
        
        // Set up voice change listener with timeout
        if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
          speechSynthesisRef.current.onvoiceschanged = loadVoices;
        }
        
        // Fallback: try loading voices after a delay
        setTimeout(loadVoices, 1000);
      }

      // Check speech recognition support
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        setSpeechRecognitionSupported(true);
        speechRecognitionRef.current = new SpeechRecognition();
        speechRecognitionRef.current.continuous = false;
        speechRecognitionRef.current.interimResults = false;
        speechRecognitionRef.current.lang = 'en-US';
        speechRecognitionRef.current.maxAlternatives = 1;
      }
    }
  }, []);

  // Auto-select scenario based on current region
  useEffect(() => {
    if (currentRegion && !selectedScenario) {
      const matchingScenario = narrationScenarios.find(scenario =>
        scenario.regions.some(region => 
          region.toLowerCase().includes(currentRegion.toLowerCase()) ||
          currentRegion.toLowerCase().includes(region.toLowerCase())
        )
      );
      if (matchingScenario) {
        setSelectedScenario(matchingScenario);
      }
    }
  }, [currentRegion, selectedScenario]);

  // Progress timer with better performance
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedScenario) {
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / selectedScenario.duration;
          const newProgress = prev + increment;
          if (newProgress >= 100) {
            setIsPlaying(false);
            setAudioStatus('idle');
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedScenario]);

  // Optimized text generation
  const generateNarrationText = useCallback((scenario: NarrationScenario, progressPercent: number): string => {
    const keyPointIndex = Math.floor((progressPercent / 100) * scenario.keyPoints.length);
    const currentKeyPoint = scenario.keyPoints[keyPointIndex];
    
    if (progressPercent < 10) {
      return `Welcome to our analysis of ${scenario.title}. ${scenario.description}`;
    } else if (progressPercent < 30) {
      return `Current situation: ${currentKeyPoint || scenario.keyPoints[0]}`;
    } else if (progressPercent < 60) {
      return `Key development: ${currentKeyPoint || scenario.keyPoints[1]}`;
    } else if (progressPercent < 90) {
      return `Strategic implications: ${currentKeyPoint || scenario.keyPoints[2]}`;
    } else {
      return `Conclusion: ${scenario.title.toLowerCase()} represents a critical situation requiring continued monitoring.`;
    }
  }, []);

  // Optimized speech synthesis with queue management
  const speakText = useCallback(async (text: string) => {
    if (!speechSynthesisRef.current || !speechSupported || !text.trim()) return;

    try {
      setAudioStatus('loading');
      
      // Cancel any existing speech
      speechSynthesisRef.current.cancel();
      
      // Create optimized utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find and set the selected voice
      const voices = speechSynthesisRef.current.getVoices();
      const selectedVoice = voices.find(voice => voice.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Optimize settings for smooth playback
      utterance.rate = Math.max(0.7, Math.min(1.3, settings.speed)); // Clamp speed for stability
      utterance.pitch = 1.0; // Keep pitch stable
      utterance.volume = settings.volume;
      
      // Set up event handlers
      utterance.onstart = () => {
        setAudioStatus('playing');
        currentUtteranceRef.current = utterance;
      };
      
      utterance.onend = () => {
        setAudioStatus('idle');
        currentUtteranceRef.current = null;
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setAudioStatus('error');
        currentUtteranceRef.current = null;
        
        // Retry with fallback settings
        setTimeout(() => {
          if (speechSynthesisRef.current && isPlaying) {
            const fallbackUtterance = new SpeechSynthesisUtterance(text);
            fallbackUtterance.rate = 1.0;
            fallbackUtterance.volume = 0.8;
            speechSynthesisRef.current.speak(fallbackUtterance);
          }
        }, 500);
      };
      
      // Speak with small delay to prevent browser issues
      setTimeout(() => {
        if (speechSynthesisRef.current && isPlaying) {
          speechSynthesisRef.current.speak(utterance);
        }
      }, 100);
      
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setAudioStatus('error');
    }
  }, [speechSupported, settings, isPlaying]);

  // Update narration text and speech
  useEffect(() => {
    if (isPlaying && selectedScenario) {
      const newText = generateNarrationText(selectedScenario, progress);
      
      // Only update if text has changed significantly
      if (newText !== currentNarrationText && newText.length > 10) {
        setCurrentNarrationText(newText);
        
        // Debounce speech to prevent overlapping
        if (!isProcessingAudioRef.current) {
          isProcessingAudioRef.current = true;
          speakText(newText).finally(() => {
            setTimeout(() => {
              isProcessingAudioRef.current = false;
            }, 1000);
          });
        }
      }
    }
  }, [progress, isPlaying, selectedScenario, generateNarrationText, currentNarrationText, speakText]);

  const handlePlayPause = useCallback(() => {
    if (!selectedScenario) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      setAudioStatus('idle');
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      if (currentUtteranceRef.current) {
        currentUtteranceRef.current = null;
      }
    } else {
      if (progress >= 100) {
        setProgress(0);
        setCurrentNarrationText('');
      }
      setIsPlaying(true);
    }
  }, [selectedScenario, isPlaying, progress]);

  const handleRestart = useCallback(() => {
    setProgress(0);
    setIsPlaying(false);
    setCurrentNarrationText('');
    setAudioStatus('idle');
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    if (currentUtteranceRef.current) {
      currentUtteranceRef.current = null;
    }
  }, []);

  const handleScenarioChange = useCallback((scenario: NarrationScenario) => {
    setSelectedScenario(scenario);
    setProgress(0);
    setIsPlaying(false);
    setCurrentNarrationText('');
    setAudioStatus('idle');
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
  }, []);

  const handleQuestionSubmit = useCallback((question: string) => {
    const newQuestion = {
      id: Date.now(),
      question,
      timestamp: new Date(),
      scenario: selectedScenario?.id
    };
    
    setRecentQuestions(prev => [...prev, newQuestion]);
    onQuestionAsked(question);
    
    // Pause narration if setting is enabled
    if (settings.pauseOnQuestion && isPlaying) {
      setIsPlaying(false);
      setAudioStatus('idle');
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    }
  }, [selectedScenario, onQuestionAsked, settings.pauseOnQuestion, isPlaying]);

  const handleToggleListening = useCallback(() => {
    if (!speechRecognitionRef.current || !speechRecognitionSupported) return;

    if (!isListening) {
      try {
        speechRecognitionRef.current.onstart = () => setIsListening(true);
        speechRecognitionRef.current.onend = () => setIsListening(false);
        speechRecognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event);
          setIsListening(false);
        };
        speechRecognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleQuestionSubmit(transcript);
        };
        
        speechRecognitionRef.current.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
        setIsListening(false);
      }
    } else {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening, speechRecognitionSupported, handleQuestionSubmit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      if (speechRecognitionRef.current && isListening) {
        speechRecognitionRef.current.stop();
      }
    };
  }, [isListening]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-4 right-4 w-80 max-h-[90vh] bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Voice Narration</h3>
              <p className="text-sm text-gray-400">Enhanced Audio Experience</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            {isActive ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
        {/* Scenario Selection */}
        <ScenarioSelector
          scenarios={narrationScenarios}
          selectedScenario={selectedScenario}
          onScenarioChange={handleScenarioChange}
          isPlaying={isPlaying}
        />

        {/* Voice Controls */}
        <VoiceControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onRestart={handleRestart}
          settings={settings}
          onSettingsChange={setSettings}
          progress={progress}
          speechSupported={speechSupported}
          voicesAvailable={voicesAvailable}
          audioStatus={audioStatus}
        />

        {/* Live Transcript */}
        <NarrationTranscript
          currentText={currentNarrationText}
          isActive={isPlaying}
          scenario={selectedScenario}
        />

        {/* Interactive Q&A */}
        <InteractiveQA
          scenario={selectedScenario}
          isListening={isListening}
          onToggleListening={handleToggleListening}
          onQuestionSubmit={handleQuestionSubmit}
          recentQuestions={recentQuestions}
          speechRecognitionSupported={speechRecognitionSupported}
        />
      </div>
    </motion.div>
  );
};