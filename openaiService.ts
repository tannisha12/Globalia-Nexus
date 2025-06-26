import OpenAI from 'openai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
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
- Russia-Ukraine War
- India-Pakistan Kashmir tensions
- China-India border disputes
- North Korea nuclear program
- Iran-Israel shadow war
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

Keep responses informative, objective, and focused on geopolitical analysis. Use specific data points, casualty figures, and timeline information when available. Always consider multiple perspectives and regional implications.`;

// Initialize OpenAI client only when needed and API key is available
const getOpenAIClient = (): OpenAI | null => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    return null;
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
  });
};

export const getChatGPTResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    // Check if API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return "I apologize, but the OpenAI API is not configured. Please add your OpenAI API key to the environment variables to enable AI-powered responses. For now, I can provide basic geopolitical analysis based on my built-in knowledge base.";
    }

    const openai = getOpenAIClient();
    if (!openai) {
      return "I apologize, but the OpenAI API is not configured. Please add your OpenAI API key to the environment variables to enable AI-powered responses.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 800,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at this time. Please try again.";
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    if (error?.status === 401) {
      return "❌ **Authentication Error**: Your OpenAI API key is invalid or expired. Please check your API key configuration in the .env file.";
    } else if (error?.status === 429) {
      return "⚠️ **Quota Exceeded**: Your OpenAI account has reached its usage limit. Please check your billing details at https://platform.openai.com/account/billing/overview to upgrade your plan or add credits. I'll continue with built-in analysis capabilities.";
    } else if (error?.status === 500) {
      return "🔧 **Service Unavailable**: OpenAI's servers are temporarily experiencing issues. Please try again in a few moments.";
    } else if (error?.status === 503) {
      return "🚫 **Service Overloaded**: OpenAI's servers are currently overloaded. Please wait a moment and try again.";
    } else {
      return "⚡ **Technical Issue**: I'm experiencing connectivity issues with the OpenAI service. Let me provide analysis using my built-in geopolitical knowledge base instead.";
    }
  }
};

export const validateApiKey = (): boolean => {
  return !!import.meta.env.VITE_OPENAI_API_KEY;
};