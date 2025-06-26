// Multi-AI service supporting OpenAI, Anthropic Claude, Google Gemini, and Cohere
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProvider {
  name: string;
  apiKey: string | null;
  available: boolean;
}

const SYSTEM_PROMPT = `You are GeoPolitics AI, an advanced geopolitical analysis assistant specializing in:

1. Global conflicts and military tensions
2. Country vulnerability assessments
3. Economic and trade analysis
4. Nuclear proliferation and security threats
5. Regional power dynamics
6. Climate security and resource conflicts
7. Cyber warfare and hybrid threats
8. Diplomatic developments and peace processes

Your expertise covers current situations including:
- Iran-Israel-US escalation
- Russia-Ukraine War
- India-Pakistan Kashmir tensions
- China-India border disputes
- North Korea nuclear program
- Taiwan Strait crisis
- Middle East conflicts
- African civil wars
- Economic sanctions and trade wars

Provide detailed, analytical responses with:
- Current situation assessment
- Key threat indicators
- Risk levels and implications
- Historical context when relevant
- Potential escalation scenarios
- Diplomatic and military options

Keep responses informative, objective, and focused on geopolitical analysis.`;

// Check available AI providers
export const getAvailableProviders = (): AIProvider[] => {
  return [
    {
      name: 'OpenAI GPT-4',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || null,
      available: !!(import.meta.env.VITE_OPENAI_API_KEY)
    },
    {
      name: 'Google Gemini',
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY || null,
      available: !!(import.meta.env.VITE_GOOGLE_API_KEY)
    },
    {
      name: 'Anthropic Claude',
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || null,
      available: !!(import.meta.env.VITE_ANTHROPIC_API_KEY)
    },
    {
      name: 'Cohere',
      apiKey: import.meta.env.VITE_COHERE_API_KEY || null,
      available: !!(import.meta.env.VITE_COHERE_API_KEY)
    }
  ];
};

// OpenAI API call
const callOpenAI = async (messages: ChatMessage[]): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 800,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
};

// Google Gemini API call
const callGemini = async (messages: ChatMessage[]): Promise<string> => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) throw new Error('Google API key not configured');

  // Convert messages to Gemini format
  const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}\n\nassistant:`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
};

// Anthropic Claude API call
const callClaude = async (messages: ChatMessage[]): Promise<string> => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Anthropic API key not configured');

  // Convert messages to Claude format
  const prompt = messages.map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`).join('\n\n');
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}\n\nAssistant:`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 800,
      messages: [{ role: 'user', content: fullPrompt }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Claude API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'No response generated';
};

// Cohere API call
const callCohere = async (messages: ChatMessage[]): Promise<string> => {
  const apiKey = import.meta.env.VITE_COHERE_API_KEY;
  if (!apiKey) throw new Error('Cohere API key not configured');

  // Convert messages to Cohere format
  const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}\n\nresponse:`;

  const response = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'command',
      prompt: fullPrompt,
      max_tokens: 800,
      temperature: 0.7,
      stop_sequences: ['user:', 'system:']
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cohere API Error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return data.generations?.[0]?.text?.trim() || 'No response generated';
};

// Main AI response function with fallback logic
export const getAIResponse = async (messages: ChatMessage[], preferredProvider?: string): Promise<{ response: string; provider: string }> => {
  const providers = getAvailableProviders().filter(p => p.available);
  
  if (providers.length === 0) {
    return {
      response: "No AI providers are configured. Please add at least one API key (OpenAI, Google, Anthropic, or Cohere) to your environment variables.",
      provider: 'fallback'
    };
  }

  // Try preferred provider first, then fallback to others
  const orderedProviders = preferredProvider 
    ? [providers.find(p => p.name.includes(preferredProvider)), ...providers].filter(Boolean)
    : providers;

  for (const provider of orderedProviders) {
    try {
      let response: string;
      
      switch (provider.name) {
        case 'OpenAI GPT-4':
          response = await callOpenAI(messages);
          return { response, provider: 'OpenAI GPT-4' };
          
        case 'Google Gemini':
          response = await callGemini(messages);
          return { response, provider: 'Google Gemini' };
          
        case 'Anthropic Claude':
          response = await callClaude(messages);
          return { response, provider: 'Anthropic Claude' };
          
        case 'Cohere':
          response = await callCohere(messages);
          return { response, provider: 'Cohere' };
          
        default:
          continue;
      }
    } catch (error: any) {
      console.error(`${provider.name} failed:`, error);
      
      // If this is the last provider, return error with fallback
      if (provider === orderedProviders[orderedProviders.length - 1]) {
        return {
          response: `All AI providers failed. Last error: ${error.message}. Using built-in analysis: ${getFallbackResponse(messages)}`,
          provider: 'fallback'
        };
      }
      
      // Continue to next provider
      continue;
    }
  }

  return {
    response: getFallbackResponse(messages),
    provider: 'fallback'
  };
};

// Fallback response for when all AI providers fail
const getFallbackResponse = (messages: ChatMessage[]): string => {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
  if (lastMessage.includes('iran') && (lastMessage.includes('israel') || lastMessage.includes('us'))) {
    return "CRITICAL ANALYSIS: Iran-Israel-US escalation represents the most dangerous Middle East crisis in decades. Iran's ballistic missile strikes on Israeli military targets have triggered massive Israeli retaliation against Iranian nuclear facilities. US carrier deployment signals potential for wider regional war. Oil markets in panic as Strait of Hormuz closure threatened.";
  }
  
  if (lastMessage.includes('ukraine') || lastMessage.includes('russia')) {
    return "ONGOING CONFLICT: Russia-Ukraine war continues with systematic targeting of civilian infrastructure. Winter campaign focuses on energy warfare. Western military aid sustaining Ukrainian resistance while sanctions pressure Russian economy. Risk of NATO involvement remains if attacks spill beyond borders.";
  }
  
  if (lastMessage.includes('kashmir') || (lastMessage.includes('india') && lastMessage.includes('pakistan'))) {
    return "NUCLEAR FLASHPOINT: India-Pakistan tensions over Kashmir have escalated dramatically with 300% increase in cross-border incidents. Both nuclear powers have reinforced military positions along Line of Control. Risk of miscalculation extremely high given nuclear doctrines and domestic political pressures.";
  }
  
  if (lastMessage.includes('china') && lastMessage.includes('taiwan')) {
    return "STRATEGIC CRISIS: Taiwan Strait tensions at highest level since 1996. Chinese military exercises demonstrate invasion capabilities while Taiwan enhances defensive preparations. US strategic ambiguity tested as semiconductor supply chains face disruption risk. Economic implications global.";
  }
  
  return "I can provide analysis on current geopolitical situations including Iran-Israel tensions, Russia-Ukraine conflict, India-Pakistan Kashmir dispute, China-Taiwan crisis, North Korea nuclear program, and global economic security challenges. Please specify which area interests you most.";
};

export const validateAnyApiKey = (): boolean => {
  return getAvailableProviders().some(provider => provider.available);
};