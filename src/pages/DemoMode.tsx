import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Pause, ChevronRight, Sprout, TrendingUp, Scale, BarChart3,
  Cloud, Users, MessageSquare, Package, Mic, CheckCircle2, ArrowRight
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Button, Badge } from '@/components/ui';

const demoSteps = [
  { title: 'Farmer Dashboard', desc: 'Personalized greeting, price highlights, demand alerts', icon: <Sprout className="w-5 h-5" />, path: '/dashboard', color: 'bg-green-100 text-green-700' },
  { title: 'Tomato Price Discovery', desc: 'Compare tomato prices across 5 Tamil Nadu markets', icon: <TrendingUp className="w-5 h-5" />, path: '/price-discovery', color: 'bg-green-100 text-green-700' },
  { title: 'Market Comparison', desc: 'Find the most profitable market with transport costs', icon: <Scale className="w-5 h-5" />, path: '/compare-markets', color: 'bg-sky-100 text-sky-700' },
  { title: 'Best Market Recommendation', desc: 'Pollachi Market recommended for tomato — ₹16,000 profit', icon: <CheckCircle2 className="w-5 h-5" />, path: '/compare-markets', color: 'bg-green-100 text-green-700' },
  { title: 'Price Prediction', desc: 'AI-style prediction: Tomato may reach ₹33/kg in 3 days', icon: <BarChart3 className="w-5 h-5" />, path: '/price-prediction', color: 'bg-green-100 text-green-700' },
  { title: 'Weather Alert', desc: 'Heavy rain alert for Coimbatore — harvest advisory', icon: <Cloud className="w-5 h-5" />, path: '/weather', color: 'bg-sky-100 text-sky-700' },
  { title: 'Buyer Connection', desc: '6 verified buyers looking for tomatoes near you', icon: <Users className="w-5 h-5" />, path: '/find-buyers', color: 'bg-amber-100 text-amber-700' },
  { title: 'Direct Chat', desc: 'Negotiate price with ABC Vegetables — accept/counter offers', icon: <MessageSquare className="w-5 h-5" />, path: '/chat', color: 'bg-green-100 text-green-700' },
  { title: 'Crop Listing', desc: 'List your tomato harvest for buyers to discover', icon: <Package className="w-5 h-5" />, path: '/sell-crop', color: 'bg-amber-900/10 text-amber-800' },
  { title: 'Voice Assistant', desc: 'Ask "இன்று தக்காளி விலை எவ்வளவு?" in Tamil', icon: <Mic className="w-5 h-5" />, path: '/voice-assistant', color: 'bg-green-100 text-green-700' },
];

export function DemoModePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setPlaying(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [playing, currentStep]);

  const togglePlay = () => {
    if (currentStep === demoSteps.length - 1) setCurrentStep(0);
    setPlaying(!playing);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="amber"><Play className="w-3 h-3" /> For Judges</Badge>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Demo Mode — Guided Tour</h1>
        <p className="text-gray-500 mt-1">A 10-step walkthrough showcasing the entire UzhavanHub platform</p>
      </div>

      {/* Player controls */}
      <Card className="p-5 mb-6 bg-gradient-to-r from-green-700 to-green-800 text-white border-0">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-white text-green-700 flex items-center justify-center hover:bg-green-50 transition-all shadow-lg"
          >
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <div className="flex-1">
            <p className="text-green-100 text-xs">Step {currentStep + 1} of {demoSteps.length}</p>
            <p className="text-lg font-bold">{demoSteps[currentStep].title}</p>
            <p className="text-sm text-green-100">{demoSteps[currentStep].desc}</p>
          </div>
          <Link to={demoSteps[currentStep].path}>
            <button className="px-4 py-2 bg-white/20 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all flex items-center gap-1">
              Open <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Steps grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoSteps.map((step, i) => (
          <Card
            key={i}
            className={`p-4 ${i === currentStep ? 'border-2 border-green-600 shadow-md' : ''}`}
            hover
            onClick={() => setCurrentStep(i)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${step.color}`}>
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                  {i === currentStep && <Badge variant="green">Now</Badge>}
                  {i < currentStep && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mt-1">{step.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
            <Link to={step.path} className="mt-3 flex items-center justify-end text-xs text-green-700 font-medium hover:underline">
              Visit <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
