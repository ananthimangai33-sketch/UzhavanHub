import { Link } from 'react-router-dom';
import {
  Sprout, TrendingUp, Users, BarChart3, Cloud, Award,
  ArrowRight, MapPin, ShoppingBag, Mic, Scale, Calculator,
  CheckCircle2, Zap, Shield
} from 'lucide-react';

const features = [
  { icon: <TrendingUp className="w-6 h-6" />, title: 'Crop Price Discovery', desc: 'Real-time crop prices across multiple markets with trend analysis.', color: 'bg-green-100 text-green-700' },
  { icon: <Scale className="w-6 h-6" />, title: 'Market Comparison', desc: 'Compare markets side-by-side with transport cost and profit estimates.', color: 'bg-sky-100 text-sky-700' },
  { icon: <Users className="w-6 h-6" />, title: 'Direct Buyer Connection', desc: 'Connect directly with verified buyers and negotiate better prices.', color: 'bg-amber-100 text-amber-700' },
  { icon: <BarChart3 className="w-6 h-6" />, title: 'Price Prediction', desc: 'AI-style predictions based on historical trends to help you time your sale.', color: 'bg-green-100 text-green-700' },
  { icon: <Cloud className="w-6 h-6" />, title: 'Weather Alerts', desc: 'Stay ahead with weather forecasts that affect your harvest and transport.', color: 'bg-sky-100 text-sky-700' },
  { icon: <Award className="w-6 h-6" />, title: 'Quality Grading Tips', desc: 'Learn how crop quality affects pricing and get tips to improve your grade.', color: 'bg-amber-900/10 text-amber-800' },
];

const flowSteps = [
  { icon: <Sprout className="w-5 h-5" />, label: 'Farmer Login' },
  { icon: <TrendingUp className="w-5 h-5" />, label: 'Select Crop' },
  { icon: <Scale className="w-5 h-5" />, label: 'Compare Markets' },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Find Best Price' },
  { icon: <Users className="w-5 h-5" />, label: 'Connect With Buyer' },
  { icon: <ShoppingBag className="w-5 h-5" />, label: 'Sell Crop' },
];

const highlights = [
  { label: 'Markets Tracked', value: '8+' },
  { label: 'Crops Covered', value: '10+' },
  { label: 'Demo Buyers', value: '6+' },
  { label: 'Tamil Nadu', value: 'Wide' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7FAF5]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-green-800">UzhavanHub</span>
              <p className="text-[10px] text-gray-500 -mt-0.5">Smart Farmer Platform</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-green-700">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-green-700">How It Works</a>
            <a href="#demo" className="text-sm font-medium text-gray-600 hover:text-green-700">Demo Mode</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 rounded-xl transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-green-700 text-white hover:bg-green-800 rounded-xl transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-gradient-to-bl from-green-100/50 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5" />
              Smart India Hackathon Prototype
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Know Your Market.<br />
              Know Your Price.<br />
              <span className="text-green-700">Sell Smarter.</span>
            </h1>
            <p className="text-lg text-gray-600 mt-6 max-w-lg leading-relaxed">
              UzhavanHub connects farmers with markets and buyers, helping them discover better prices and make smarter selling decisions.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-all shadow-sm hover:shadow-md">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/price-discovery" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-green-700 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all">
                <TrendingUp className="w-4 h-4" /> Explore Market Prices
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all">
                Login
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-200/30 to-amber-200/30 rounded-3xl blur-2xl" />
            <img
              src="https://images.pexels.com/photos/11688197/pexels-photo-11688197.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Indian farmers harvesting crops"
              className="rounded-3xl shadow-xl w-full object-cover h-[420px] relative"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Tomato Price Trend</p>
                  <p className="text-xs text-green-600 font-medium">₹22 → ₹30/kg (+36% this week)</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-green-700">₹32</p>
                  <p className="text-[10px] text-gray-500">Best in Pollachi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-4 sm:px-6 py-8 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map((h) => (
            <div key={h.label} className="text-center">
              <p className="text-3xl font-bold text-green-700">{h.value}</p>
              <p className="text-sm text-gray-500 mt-1">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything a Farmer Needs</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">From price discovery to direct buyer connections — UzhavanHub covers the entire selling journey.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:border-gray-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.color}`}>{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">{f.title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-green-50/50 to-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How UzhavanHub Works</h2>
            <p className="text-gray-600 mt-3">From login to sale — a simple 6-step journey.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {flowSteps.map((step, i) => (
              <div key={step.label} className="relative">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-green-700 text-white flex items-center justify-center mx-auto mb-3">
                    {step.icon}
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{step.label}</p>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 text-green-300 text-xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo mode CTA */}
      <section id="demo" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-green-700 to-green-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-4">
              <Shield className="w-3.5 h-3.5" /> For Hackathon Judges
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Try Demo Mode</h2>
            <p className="text-green-50 mt-3 max-w-lg">Quickly showcase the entire platform — farmer dashboard, price discovery, market comparison, buyer chat, voice assistant, and more.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/demo-mode" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all">
                Launch Demo Mode <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/voice-assistant" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all">
                <Mic className="w-4 h-4" /> Try Uzhavan Voice
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">UzhavanHub</span>
            </div>
            <p className="text-sm">Smart Farmer Market & Price Discovery Platform for Tamil Nadu.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>Price Discovery</li>
              <li>Market Comparison</li>
              <li>Buyer Connection</li>
              <li>Voice Assistant</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">For Farmers</h4>
            <ul className="space-y-2 text-sm">
              <li>Sell Your Crop</li>
              <li>Weather Alerts</li>
              <li>Quality Guide</li>
              <li>Profit Calculator</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-sm">
              <li>Smart India Hackathon</li>
              <li>Demo Mode</li>
              <li>Tamil Nadu Focus</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800 text-sm text-center">
          <p>Built for Smart India Hackathon · Demo data shown · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
