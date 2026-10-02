import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2, Languages, Sparkles, Zap } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Button, Badge } from '@/components/ui';
import { voiceResponses } from '@/lib/mockData';

interface ChatEntry {
  id: string;
  question: string;
  response: string;
  lang: 'ta' | 'en';
}

const exampleQueries = [
  { ta: 'இன்று தக்காளி விலை எவ்வளவு?', en: 'What is the tomato price today?', key: 'tomato_price' },
  { ta: 'எந்த மார்க்கெட்டில் அதிக விலை கிடைக்கும்?', en: 'Which market gives the best price?', key: 'best_market' },
  { ta: 'என்னுடைய 500 கிலோ தக்காளியை யாரிடம் விற்கலாம்?', en: 'Who can I sell my 500kg tomatoes to?', key: 'sell_tomato' },
  { ta: 'இன்று மழை வருமா?', en: 'Will it rain today?', key: 'rain' },
  { ta: 'வெங்காயத்துக்கு டிமாண்ட் இருக்கா?', en: 'Is there demand for onion?', key: 'onion_demand' },
];

export function VoiceAssistantPage() {
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState<'ta' | 'en'>('ta');
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        processQuery(transcript);
      };
      recognition.onerror = () => {
        setListening(false);
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognitionRef.current = recognition;
    }
  }, [language]);

  const processQuery = (text: string) => {
    const lower = text.toLowerCase();
    let key = 'default';

    if (lower.includes('tomato') || lower.includes('தக்காளி') || lower.includes('price') || lower.includes('விலை')) {
      if (lower.includes('market') || lower.includes('best') || lower.includes('மார்க்கெட்') || lower.includes('அதிக')) {
        key = 'best_market';
      } else if (lower.includes('sell') || lower.includes('விற்க') || lower.includes('who') || lower.includes('யார்')) {
        key = 'sell_tomato';
      } else {
        key = 'tomato_price';
      }
    } else if (lower.includes('rain') || lower.includes('மழை') || lower.includes('weather')) {
      key = 'rain';
    } else if (lower.includes('onion') || lower.includes('வெங்காய') || lower.includes('demand') || lower.includes('டிமாண்ட்')) {
      key = 'onion_demand';
    }

    const response = voiceResponses[key] || voiceResponses.default;
    const responseText = response[language];
    setCurrentResponse(responseText);

    // Try TTS
    try {
      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    } catch {
      // TTS not available
    }

    setHistory(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      question: text,
      response: responseText,
      lang: language,
    }]);
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      setRecognizedText('');
      setCurrentResponse(null);
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch {
        // Fallback: use a demo query
        const demo = exampleQueries[0];
        processQuery(language === 'ta' ? demo.ta : demo.en);
      }
    }
  };

  const useExampleQuery = (q: typeof exampleQueries[0]) => {
    setRecognizedText(language === 'ta' ? q.ta : q.en);
    processQuery(language === 'ta' ? q.ta : q.en);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Uzhavan Voice</h1>
        <p className="text-gray-500 mt-1">AI Voice Assistant for farmers — supports Tamil and English</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Voice button */}
        <Card className="p-8 text-center mb-6">
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setLanguage('ta')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${language === 'ta' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${language === 'en' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              English
            </button>
          </div>

          <button
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg ${
              listening ? 'bg-red-500 animate-pulse shadow-red-200' : 'bg-green-700 hover:bg-green-800 shadow-green-200'
            }`}
          >
            {listening ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-10 h-10 text-white" />}
          </button>

          <p className="mt-4 text-sm font-medium text-gray-700">
            {listening ? (language === 'ta' ? 'கேட்கிறேன்...' : 'Listening...') : (language === 'ta' ? 'பேச பொத்தானை அழுத்துங்கள்' : 'Tap the button to speak')}
          </p>

          {recognizedText && (
            <div className="mt-4 p-3 rounded-xl bg-gray-50">
              <p className="text-xs text-gray-400 mb-1">You said:</p>
              <p className="text-sm text-gray-900">{recognizedText}</p>
            </div>
          )}
        </Card>

        {/* Response */}
        {currentResponse && (
          <Card className="p-5 mb-6 bg-green-50 border-green-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-green-800">Uzhavan Voice</span>
                  <Badge variant="green">AI Response</Badge>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{currentResponse}</p>
                <button
                  onClick={() => {
                    try {
                      const utterance = new SpeechSynthesisUtterance(currentResponse);
                      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
                      window.speechSynthesis.speak(utterance);
                    } catch {}
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-green-700 font-medium hover:underline"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Play again
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Example queries */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            {language === 'ta' ? 'உதாரண கேள்விகள்' : 'Example Queries'}
          </h3>
          <div className="space-y-2">
            {exampleQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => useExampleQuery(q)}
                className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors text-sm text-gray-700"
              >
                {language === 'ta' ? q.ta : q.en}
              </button>
            ))}
          </div>
        </Card>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Conversation History</h3>
            <div className="space-y-2">
              {history.slice(-5).reverse().map(h => (
                <Card key={h.id} className="p-3">
                  <p className="text-xs text-gray-400">You: {h.question}</p>
                  <p className="text-sm text-gray-700 mt-1">AI: {h.response}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-xs text-amber-700">
            <Languages className="w-4 h-4 inline mr-1" />
            Demo mode: Uses predefined responses. Architecture supports integration with real speech-to-text (Google Speech API) and AI (OpenAI/Gemini) services.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
