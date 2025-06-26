# Globalia-Nexus
# Globalia-Nexus - Deep Analysis Bot
where nations, data, and decisions converge.
An advanced AI-powered geopolitical analysis platform providing real-time insights on global conflicts, country vulnerabilities, economic trends, and security threats.

## Features

### 🧠 AI-Powered Analysis
- *ChatGPT Integration*: Real-time AI responses for geopolitical queries
- *Deep Analysis Engine*: Comprehensive conflict and vulnerability assessments
- *Smart Search*: Intelligent filtering across all data categories
- *Real-time Updates*: Live monitoring of global situations

### 🌍 Global Coverage
- *Active Conflicts*: 10+ ongoing conflicts with detailed tracking
- *Vulnerability Assessment*: 10 countries analyzed across 8 dimensions
- *Regional Analysis*: Coverage of all major geopolitical regions
- *Economic Intelligence*: Trade wars, sanctions, and market impacts

### 🔍 Analysis Categories
- Military tensions and conflicts
- Economic vulnerabilities and sanctions
- Energy security and supply chains
- Food security and climate impacts
- Cyber warfare and digital threats
- Political stability and governance
- Social unrest and demographic challenges

## Setup Instructions

### 1. Clone and Install
bash
git clone <repository-url>
cd geopolitics-ai-bot
npm install


### 2. Configure OpenAI API (Optional but Recommended)
1. Copy the environment file:
   bash
   cp .env.example .env
   

2. Get your OpenAI API key:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key

3. Add your API key to .env:
   
   VITE_OPENAI_API_KEY=your_actual_api_key_here
   

4. Restart the development server

### 3. Start Development Server
bash
npm run dev


## ChatGPT Integration

The GeoPolitics AI chatbot now features ChatGPT integration for enhanced responses:

### With API Key Configured:
- ✅ Real-time ChatGPT responses
- ✅ Context-aware conversations
- ✅ Advanced geopolitical analysis
- ✅ Up-to-date information synthesis

### Without API Key (Fallback Mode):
- ✅ Built-in knowledge base responses
- ✅ Comprehensive conflict analysis
- ✅ Vulnerability assessments
- ✅ Regional expertise

### Security Note
The current implementation uses browser-based API calls for development. In production:
- Move API calls to your backend server
- Implement proper authentication
- Add rate limiting and usage monitoring
- Secure API keys server-side

## Key Features

### 🎯 Smart Search & Filtering
- Search across conflicts, countries, and analyses
- Multi-dimensional filtering (region, severity, type)
- Real-time results with counters
- No-results states with helpful guidance

### 📊 Comprehensive Data
- *Conflicts*: Russia-Ukraine, India-Pakistan, China-India, North Korea, Iran-Israel, and more
- *Vulnerabilities*: Military, Economic, Energy, Food, Cyber, Climate, Social, Political
- *Regions*: South Asia, East Asia, Middle East, Eastern Europe, Africa, Southeast Asia

### 🤖 AI Assistant
- Powered by ChatGPT-4 for advanced analysis
- Specialized in geopolitical intelligence
- Context-aware conversations
- Fallback knowledge base for reliability

## Technology Stack

- *Frontend*: React 18 + TypeScript
- *Styling*: Tailwind CSS
- *Icons*: Lucide React
- *AI*: OpenAI GPT-4 API
- *Build Tool*: Vite
- *Routing*: React Router DOM

## Usage Examples

### Chat with AI Assistant
- "Analyze the current India-Pakistan tensions"
- "What are North Korea's nuclear capabilities?"
- "Assess Taiwan's vulnerability to blockade"
- "Compare economic risks in South Asia"

### Search & Filter
- Search: "Kashmir", "nuclear", "energy crisis"
- Filter by region: South Asia, Middle East, etc.
- Filter by severity: Critical, High, Medium, Low
- Combine filters for precise results

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This application is for educational and research purposes. Geopolitical analysis should be verified with multiple sources and official intelligence reports.
