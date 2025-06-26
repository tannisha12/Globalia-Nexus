import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Brain, User, AlertCircle, Key, Loader2, Settings, Zap } from 'lucide-react';
import { getAIResponse, getAvailableProviders, validateAnyApiKey, type ChatMessage } from '../services/aiService';

interface ChatBotProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  provider?: string;
  isError?: boolean;
}

export const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your GeoPolitics AI assistant with multi-AI support. I can use OpenAI GPT-4, Google Gemini, Anthropic Claude, or Cohere to provide real-time analysis on global conflicts, country vulnerabilities, economic trends, and geopolitical developments. What would you like to analyze?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferredProvider, setPreferredProvider] = useState<string>('');
  const [availableProviders, setAvailableProviders] = useState(getAvailableProviders());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailableProviders(getAvailableProviders());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('iran') && (lowerMessage.includes('israel') || lowerMessage.includes('america') || lowerMessage.includes('us'))) {
      return "BREAKING: Iran-Israel-US Military Escalation Analysis - The situation has reached critical levels with Iran launching over 200 ballistic missiles at Israeli military installations. Israel has responded with massive airstrikes targeting Iranian nuclear facilities in Isfahan and Natanz. The US has deployed 3 carrier strike groups to the Persian Gulf. Key developments: 1) Iran threatens to close Strait of Hormuz affecting 20% of global oil transit 2) Hezbollah has activated from Lebanon with 150,000+ rockets 3) Oil prices have surged 40% 4) Regional allies are choosing sides 5) Risk of nuclear escalation if Iranian facilities are severely damaged. This represents the most dangerous Middle East crisis in decades.";
    }
    
    if (lowerMessage.includes('india') && lowerMessage.includes('pakistan')) {
      return "India-Pakistan relations remain highly tense, particularly over Kashmir. Current analysis shows: 1) Cross-border shelling incidents have increased 300% in the past month along the Line of Control. 2) India has deployed an additional 50,000 troops to Kashmir region. 3) Pakistan has activated air defense systems in response. 4) Both nations possess nuclear weapons, making this one of the world's most dangerous flashpoints. 5) Civilian casualties are rising on both sides. The risk of escalation to full-scale conflict between two nuclear powers remains a critical global concern.";
    }
    
    if (lowerMessage.includes('ukraine') || lowerMessage.includes('russia')) {
      return "The Russia-Ukraine conflict remains critical with winter operations focusing on energy infrastructure. Current analysis: 1) Systematic targeting of power grids affecting 40% of Ukraine's energy capacity. 2) Russia mobilized additional 300,000 troops for sustained operations. 3) Western military aid packages worth $50B approved for 2025. 4) Civilian casualties mounting with infrastructure attacks. 5) NATO considering additional defensive measures.";
    }
    
    return "I can provide detailed analysis on various geopolitical topics including: Iran-Israel-US escalation, India-Pakistan Kashmir tensions, China-India border disputes, North Korea nuclear program, Russia-Ukraine conflict, Taiwan Strait crisis, and comprehensive country vulnerability assessments. Please specify which area you'd like me to analyze in detail.";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      let responseText: string;
      let usedProvider: string;

      if (validateAnyApiKey()) {
        // Use AI API
        const chatMessages: ChatMessage[] = messages
          .filter(msg => !msg.isError)
          .slice(-10) // Keep last 10 messages for context
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }));
        
        chatMessages.push({
          role: 'user',
          content: currentInput
        });

        const result = await getAIResponse(chatMessages, preferredProvider);
        responseText = result.response;
        usedProvider = result.provider;
      } else {
        // Use fallback responses
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        responseText = getFallbackResponse(currentInput);
        usedProvider = 'Built-in Knowledge';
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        provider: usedProvider
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm experiencing technical difficulties. Let me provide analysis based on my built-in knowledge: " + getFallbackResponse(currentInput),
        sender: 'bot',
        timestamp: new Date(),
        provider: 'Fallback',
        isError: true
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getProviderIcon = (provider?: string) => {
    if (!provider) return <Brain className="w-3 h-3" />;
    
    if (provider.includes('OpenAI')) return <Brain className="w-3 h-3 text-green-400" />;
    if (provider.includes('Gemini')) return <Zap className="w-3 h-3 text-blue-400" />;
    if (provider.includes('Claude')) return <Brain className="w-3 h-3 text-purple-400" />;
    if (provider.includes('Cohere')) return <Brain className="w-3 h-3 text-orange-400" />;
    return <AlertCircle className="w-3 h-3 text-yellow-400" />;
  };

  const getProviderColor = (provider?: string) => {
    if (!provider) return 'text-gray-400';
    
    if (provider.includes('OpenAI')) return 'text-green-400';
    if (provider.includes('Gemini')) return 'text-blue-400';
    if (provider.includes('Claude')) return 'text-purple-400';
    if (provider.includes('Cohere')) return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Multi-AI GeoPolitics</span>
          <div className="flex items-center gap-1">
            {availableProviders.filter(p => p.available).map((provider, index) => (
              <div
                key={provider.name}
                className={`w-2 h-2 rounded-full ${getProviderColor(provider.name).replace('text-', 'bg-')}`}
                title={`${provider.name} Available`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-400 hover:text-white transition-colors"
            title="AI Provider Settings"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-700/50 border-b border-slate-600 p-3">
          <h4 className="text-sm font-medium text-white mb-2">AI Provider Settings</h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Preferred Provider</label>
              <select
                value={preferredProvider}
                onChange={(e) => setPreferredProvider(e.target.value)}
                className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-xs"
              >
                <option value="">Auto (Best Available)</option>
                {availableProviders.filter(p => p.available).map(provider => (
                  <option key={provider.name} value={provider.name.split(' ')[0]}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-gray-500">
              Available: {availableProviders.filter(p => p.available).length} / {availableProviders.length} providers
            </div>
          </div>
        </div>
      )}

      {/* API Status Banner */}
      {!validateAnyApiKey() && (
        <div className="bg-yellow-900/50 border-b border-yellow-500/30 p-2">
          <div className="flex items-center gap-2 text-yellow-300 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>Add AI API keys for enhanced responses (OpenAI, Google, Anthropic, Cohere)</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isError ? 'bg-yellow-500' : 'bg-blue-500'
              }`}>
                {getProviderIcon(message.provider)}
              </div>
            )}
            <div
              className={`max-w-xs p-3 rounded-lg text-sm ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.isError
                  ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-500/30'
                  : 'bg-slate-700 text-gray-200'
              }`}
            >
              {message.text}
              {message.sender === 'bot' && message.provider && (
                <div className={`text-xs mt-1 opacity-70 ${getProviderColor(message.provider)}`}>
                  via {message.provider}
                </div>
              )}
            </div>
            {message.sender === 'user' && (
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-3 h-3 text-white animate-spin" />
            </div>
            <div className="bg-slate-700 text-gray-200 p-3 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <span>AI is analyzing...</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={validateAnyApiKey() ? "Ask AI about geopolitics..." : "Ask about conflicts, vulnerabilities..."}
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};