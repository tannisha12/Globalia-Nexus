import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Line } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Eye, Globe, Zap, Play, Pause, RotateCcw, Maximize, Info, Brain, Database, Volume2, MessageCircle } from 'lucide-react';
import * as THREE from 'three';
import { KnowledgePanel } from '../components/KnowledgePanel';
import { VoiceNarrationPanel } from '../components/VoiceNarrationPanel';
import { ChatBot } from '../components/ChatBot';

// 3D Globe Component with Enhanced Interactivity
const InteractiveGlobe = ({ conflicts, onConflictClick, onRegionClick }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const conflictPositions = [
    { name: "Ukraine", position: [0.5, 0.8, 0.3], severity: "Critical", color: "#ef4444", country: "Ukraine" },
    { name: "Kashmir", position: [0.7, 0.2, 0.7], severity: "High", color: "#f97316", country: "India" },
    { name: "Taiwan", position: [0.9, 0.1, 0.4], severity: "High", color: "#f97316", country: "China" },
    { name: "Gaza", position: [-0.1, 0.3, 0.9], severity: "High", color: "#f97316", country: "Palestine" },
    { name: "Sudan", position: [-0.2, -0.1, 0.9], severity: "Critical", color: "#ef4444", country: "Sudan" },
    { name: "Iran", position: [0.2, 0.4, 0.8], severity: "Critical", color: "#ef4444", country: "Iran" },
    { name: "North Korea", position: [0.8, 0.5, 0.3], severity: "Critical", color: "#ef4444", country: "North Korea" },
    { name: "Russia", position: [0.3, 0.9, 0.1], severity: "Critical", color: "#ef4444", country: "Russia" }
  ];

  const regionPositions = [
    { name: "United States", position: [-1.2, 0.5, 0.5], color: "#3b82f6", country: "United States" },
    { name: "China", position: [0.9, 0.1, 0.4], color: "#dc2626", country: "China" },
    { name: "Russia", position: [0.3, 0.9, 0.1], color: "#059669", country: "Russia" },
    { name: "India", position: [0.7, 0.2, 0.7], color: "#d97706", country: "India" },
    { name: "Pakistan", position: [0.6, 0.3, 0.7], color: "#7c3aed", country: "Pakistan" },
    { name: "Iran", position: [0.2, 0.4, 0.8], color: "#dc2626", country: "Iran" },
    { name: "Israel", position: [-0.05, 0.35, 0.85], color: "#2563eb", country: "Israel" },
    { name: "Ukraine", position: [0.5, 0.8, 0.3], color: "#eab308", country: "Ukraine" }
  ];

  return (
    <group>
      {/* Main Globe */}
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1e293b"
          wireframe={false}
          transparent
          opacity={0.8}
          emissive="#0f172a"
        />
      </Sphere>

      {/* Country/Region Markers */}
      {regionPositions.map((region, index) => (
        <group key={region.name}>
          <Sphere
            args={[0.08, 16, 16]}
            position={[
              region.position[0] * 2.2,
              region.position[1] * 2.2,
              region.position[2] * 2.2
            ]}
            onClick={() => onRegionClick(region)}
            onPointerOver={() => setHovered(region.name)}
            onPointerOut={() => setHovered(null)}
          >
            <meshStandardMaterial
              color={region.color}
              emissive={region.color}
              emissiveIntensity={hovered === region.name ? 0.6 : 0.3}
            />
          </Sphere>
          
          {/* Info Icon */}
          <Box
            args={[0.04, 0.04, 0.04]}
            position={[
              region.position[0] * 2.4,
              region.position[1] * 2.4,
              region.position[2] * 2.4
            ]}
            onClick={() => onRegionClick(region)}
          >
            <meshBasicMaterial color="#ffffff" />
          </Box>

          {/* Label */}
          {hovered === region.name && (
            <Text
              position={[
                region.position[0] * 2.8,
                region.position[1] * 2.8,
                region.position[2] * 2.8
              ]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {region.name}
            </Text>
          )}
        </group>
      ))}

      {/* Conflict Markers */}
      {conflictPositions.map((conflict, index) => (
        <group key={conflict.name}>
          <Sphere
            args={[0.12, 16, 16]}
            position={[
              conflict.position[0] * 2.2,
              conflict.position[1] * 2.2,
              conflict.position[2] * 2.2
            ]}
            onClick={() => onConflictClick(conflict)}
            onPointerOver={() => setHovered(conflict.name)}
            onPointerOut={() => setHovered(null)}
          >
            <meshStandardMaterial
              color={conflict.color}
              emissive={conflict.color}
              emissiveIntensity={hovered === conflict.name ? 0.8 : 0.4}
            />
          </Sphere>
          
          {/* Pulsing Ring */}
          <mesh
            position={[
              conflict.position[0] * 2.2,
              conflict.position[1] * 2.2,
              conflict.position[2] * 2.2
            ]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.18, 0.25, 32]} />
            <meshBasicMaterial
              color={conflict.color}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Conflict Label */}
          {hovered === conflict.name && (
            <Text
              position={[
                conflict.position[0] * 2.8,
                conflict.position[1] * 2.8,
                conflict.position[2] * 2.8
              ]}
              fontSize={0.12}
              color="#ff4444"
              anchorX="center"
              anchorY="middle"
            >
              {conflict.name} - {conflict.severity}
            </Text>
          )}
        </group>
      ))}

      {/* Connection Lines between related conflicts */}
      <Line
        points={[
          [conflictPositions[0].position[0] * 2.2, conflictPositions[0].position[1] * 2.2, conflictPositions[0].position[2] * 2.2],
          [conflictPositions[7].position[0] * 2.2, conflictPositions[7].position[1] * 2.2, conflictPositions[7].position[2] * 2.2]
        ]}
        color="#ef4444"
        transparent
        opacity={0.3}
        lineWidth={2}
      />

      {/* Data flow visualization */}
      {regionPositions.map((region, index) => (
        <Line
          key={`data-${index}`}
          points={[
            [0, 0, 0],
            [region.position[0] * 2.2, region.position[1] * 2.2, region.position[2] * 2.2]
          ]}
          color="#3b82f6"
          transparent
          opacity={0.1}
          lineWidth={1}
        />
      ))}
    </group>
  );
};

// VR Controls Component - Fixed positioning and z-index
const VRControls = ({ 
  isVRMode, 
  onToggleVR, 
  onReset, 
  isPlaying, 
  onTogglePlay, 
  onToggleKnowledgeMode,
  onToggleVoiceNarration,
  onToggleChatBot,
  voiceNarrationActive,
  chatBotActive
}: any) => (
  <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
    <button
      onClick={onToggleVR}
      className={`p-3 rounded-lg backdrop-blur-sm border transition-all shadow-lg ${
        isVRMode
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          : 'bg-slate-800/50 text-gray-400 border-slate-700 hover:text-blue-400'
      }`}
      title="Toggle VR Mode"
    >
      {isVRMode ? <Eye size={20} /> : <Headphones size={20} />}
    </button>
    <button
      onClick={onTogglePlay}
      className="p-3 rounded-lg bg-slate-800/50 text-gray-400 border border-slate-700 hover:text-green-400 transition-all backdrop-blur-sm shadow-lg"
      title={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
    </button>
    <button
      onClick={onReset}
      className="p-3 rounded-lg bg-slate-800/50 text-gray-400 border border-slate-700 hover:text-orange-400 transition-all backdrop-blur-sm shadow-lg"
      title="Reset View"
    >
      <RotateCcw size={20} />
    </button>
    <button
      onClick={onToggleKnowledgeMode}
      className="p-3 rounded-lg bg-slate-800/50 text-gray-400 border border-slate-700 hover:text-purple-400 transition-all backdrop-blur-sm shadow-lg"
      title="Knowledge Panel Mode"
    >
      <Info size={20} />
    </button>
    <button
      onClick={onToggleVoiceNarration}
      className={`p-3 rounded-lg backdrop-blur-sm border transition-all shadow-lg ${
        voiceNarrationActive
          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
          : 'bg-slate-800/50 text-gray-400 border-slate-700 hover:text-purple-400'
      }`}
      title="Voice Narration"
    >
      <Volume2 size={20} />
    </button>
    <button
      onClick={onToggleChatBot}
      className={`p-3 rounded-lg backdrop-blur-sm border transition-all shadow-lg ${
        chatBotActive
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : 'bg-slate-800/50 text-gray-400 border-slate-700 hover:text-green-400'
      }`}
      title="AI Chat Assistant"
    >
      <MessageCircle size={20} />
    </button>
  </div>
);

// Conflict Info Panel - Fixed z-index
const ConflictInfoPanel = ({ selectedConflict, onClose }: any) => {
  if (!selectedConflict) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="absolute top-4 left-4 w-80 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 p-6 z-20 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{selectedConflict.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          selectedConflict.severity === 'Critical'
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
        }`}>
          {selectedConflict.severity} Risk
        </div>
        
        <div className="text-gray-300 text-sm">
          <p className="mb-2">Real-time conflict analysis and 3D visualization of global tensions.</p>
          <ul className="space-y-1">
            <li>• Interactive 3D mapping</li>
            <li>• Real-time data updates</li>
            <li>• VR/AR compatibility</li>
            <li>• AI voice narration available</li>
            <li>• Interactive Q&A support</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

// Data Sources Panel - Fixed z-index and positioning
const DataSourcesPanel = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-20 left-4 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 p-4 max-w-xs z-20 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-5 h-5 text-green-400" />
        <h4 className="font-semibold text-white">Live Data Sources</h4>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-300">CIA World Factbook</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-300">Wikipedia API</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-300">UN Peacekeeping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-gray-300">AI Analysis Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-gray-300">Voice Narration AI</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Last sync: {new Date().toLocaleTimeString()}
      </div>
    </motion.div>
  );
};

export const VRInterface: React.FC = () => {
  const [isVRMode, setIsVRMode] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [knowledgePanelOpen, setKnowledgePanelOpen] = useState(false);
  const [voiceNarrationActive, setVoiceNarrationActive] = useState(false);
  const [chatBotActive, setChatBotActive] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const handleConflictClick = (conflict: any) => {
    setSelectedConflict(conflict);
    setSelectedRegion(null);
    // Auto-start voice narration for conflicts
    if (!voiceNarrationActive) {
      setVoiceNarrationActive(true);
    }
  };

  const handleRegionClick = (region: any, event?: any) => {
    if (event) {
      setClickPosition({ x: event.clientX, y: event.clientY });
    }
    setSelectedRegion(region);
    setSelectedConflict(null);
    setKnowledgePanelOpen(true);
  };

  const handleReset = () => {
    setSelectedConflict(null);
    setSelectedRegion(null);
    setKnowledgePanelOpen(false);
    setVoiceNarrationActive(false);
    setChatBotActive(false);
  };

  const handleToggleKnowledgeMode = () => {
    setShowDataSources(!showDataSources);
  };

  const handleToggleVoiceNarration = () => {
    setVoiceNarrationActive(!voiceNarrationActive);
  };

  const handleToggleChatBot = () => {
    setChatBotActive(!chatBotActive);
  };

  const handleVoiceQuestion = (question: string) => {
    // Handle voice questions - could integrate with ChatBot or provide direct answers
    console.log('Voice question asked:', question);
    
    // Auto-open chat bot for follow-up
    if (!chatBotActive) {
      setChatBotActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Header - Fixed z-index */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Headphones className="w-10 h-10 text-purple-400" />
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 bg-clip-text">
              VR/AR Geopolitical Interface
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Immersive 3D visualization with AI voice narration, interactive Q&A, and real-time analysis
          </p>
        </div>
      </div>

      {/* 3D Canvas - Base layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
            
            <InteractiveGlobe
              conflicts={[]}
              onConflictClick={handleConflictClick}
              onRegionClick={handleRegionClick}
            />
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={isPlaying}
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* VR Controls - High z-index, positioned to avoid overlaps */}
      <VRControls
        isVRMode={isVRMode}
        onToggleVR={() => setIsVRMode(!isVRMode)}
        onReset={handleReset}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onToggleKnowledgeMode={handleToggleKnowledgeMode}
        onToggleVoiceNarration={handleToggleVoiceNarration}
        onToggleChatBot={handleToggleChatBot}
        voiceNarrationActive={voiceNarrationActive}
        chatBotActive={chatBotActive}
      />

      {/* Knowledge Panel - Highest z-index for modals */}
      <KnowledgePanel
        countryName={selectedRegion?.country || ''}
        isOpen={knowledgePanelOpen}
        onClose={() => {
          setKnowledgePanelOpen(false);
          setSelectedRegion(null);
        }}
        position={clickPosition}
      />

      {/* Voice Narration Panel - High z-index, positioned to avoid controls */}
      {voiceNarrationActive && (
        <div className="fixed top-4 right-80 z-40">
          <VoiceNarrationPanel
            isActive={voiceNarrationActive}
            currentScenario={selectedConflict?.name || ''}
            currentRegion={selectedRegion?.country || selectedConflict?.country || ''}
            onToggle={handleToggleVoiceNarration}
            onQuestionAsked={handleVoiceQuestion}
          />
        </div>
      )}

      {/* Chat Bot - High z-index, positioned to avoid other panels */}
      {chatBotActive && (
        <div className="fixed bottom-6 right-6 z-40">
          <ChatBot onClose={() => setChatBotActive(false)} />
        </div>
      )}

      {/* Conflict Info Panel */}
      <AnimatePresence>
        {selectedConflict && (
          <ConflictInfoPanel
            selectedConflict={selectedConflict}
            onClose={() => setSelectedConflict(null)}
          />
        )}
      </AnimatePresence>

      {/* Data Sources Panel */}
      <DataSourcesPanel isVisible={showDataSources} />

      {/* VR Features Panel - Fixed positioning to avoid overlaps */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="text-center">
              <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">3D Globe</h3>
              <p className="text-gray-400 text-xs">Interactive world map</p>
            </div>
            <div className="text-center">
              <Info className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Knowledge Panels</h3>
              <p className="text-gray-400 text-xs">Deep contextual info</p>
            </div>
            <div className="text-center">
              <Volume2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Voice Narration</h3>
              <p className="text-gray-400 text-xs">AI-guided scenarios</p>
            </div>
            <div className="text-center">
              <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Interactive Q&A</h3>
              <p className="text-gray-400 text-xs">Voice & text questions</p>
            </div>
            <div className="text-center">
              <Brain className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">AI Analysis</h3>
              <p className="text-gray-400 text-xs">Real-time insights</p>
            </div>
            <div className="text-center">
              <Maximize className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">VR Ready</h3>
              <p className="text-gray-400 text-xs">Immersive experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Instructions - Positioned to avoid overlaps */}
      <div className="absolute bottom-20 right-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-3 max-w-xs z-10">
        <h4 className="text-white font-medium mb-2">Enhanced Controls</h4>
        <ul className="text-gray-400 text-xs space-y-1">
          <li>• Click regions for knowledge panels</li>
          <li>• Click red markers for voice scenarios</li>
          <li>• Use voice button for AI narration</li>
          <li>• Ask questions via voice or text</li>
          <li>• Chat button for AI assistant</li>
          <li>• VR button for immersive mode</li>
        </ul>
      </div>
    </div>
  );
};