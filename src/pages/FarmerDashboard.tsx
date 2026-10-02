import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, MapPin, Zap, Cloud, Package, Users,
  ArrowRight, Sprout, Store, BarChart3, Sun, CloudRain
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, StatCard, Button, Badge } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { mockPriceHistory, mockDemandAlerts } from '@/lib/mockData';
import { getGreeting, formatCurrency } from '@/lib/utils';
import type { CropListing, WeatherAlert } from '@/lib/types';

const highlights = [
  { crop: 'Tomato', price: 30, change: 3 },
  { crop: 'Onion', price: 38, change: 2 },
  { crop: 'Potato', price: 25, change: 1 },
  { crop: 'Paddy', price: 32, change: 0 },
];

export function FarmerDashboard() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<CropListing[]>([]);
  const [weather, setWeather] = useState<WeatherAlert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!profile) return;
      const [listingsRes, weatherRes] = await Promise.all([
        supabase.from('crop_listings').select('*').eq('farmer_id', profile.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('weather_alerts').select('*').eq('location', profile.location || 'Coimbatore').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      setListings((listingsRes.data as CropListing[]) || []);
      setWeather((weatherRes.data as WeatherAlert) || null);
      setLoading(false);
    })();
  }, [profile]);

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {profile?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your farm today.</p>
      </div>

      {/* Today's highlights */}
      <Card className="p-5 mb-6 bg-gradient-to-r from-green-700 to-green-800 text-white border-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today's Price Highlights</h2>
          <Link to="/price-discovery" className="text-green-100 text-sm hover:text-white flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {highlights.map((h) => (
            <div key={h.crop} className="bg-white/10 rounded-xl p-3 backdrop-blur">
              <p className="text-sm text-green-100">{h.crop}</p>
              <p className="text-xl font-bold">{formatCurrency(h.price)}/kg</p>
              {h.change > 0 ? (
                <p className="text-xs text-green-200 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +₹{h.change} today</p>
              ) : (
                <p className="text-xs text-green-200">Stable</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Best Price Today" value="₹32/kg" sublabel="Pollachi · Tomato" color="green" trend="up" />
        <StatCard icon={<MapPin className="w-5 h-5" />} label="Nearby Markets" value="5" sublabel="Within 55 km" color="blue" />
        <StatCard icon={<Zap className="w-5 h-5" />} label="Current Demand" value="High" sublabel="Tomato +18%" color="amber" trend="up" />
        <StatCard icon={<Cloud className="w-5 h-5" />} label="Weather Alert" value={weather ? weather.alert_type === 'rain' ? 'Rain' : weather.alert_type === 'heat' ? 'Heat' : 'OK' : '—'} sublabel={weather?.severity || 'No alerts'} color={weather?.severity === 'warning' ? 'amber' : 'blue'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Price trend chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tomato Price Trend</h2>
              <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Prices increased by ₹3/kg today
              </p>
            </div>
            <Link to="/price-discovery">
              <Button variant="ghost" size="sm">Details <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockPriceHistory.Tomato}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip formatter={(v: number) => [`₹${v}/kg`, 'Price']} />
              <Line type="monotone" dataKey="price" stroke="#166534" strokeWidth={3} dot={{ r: 4, fill: '#22C55E' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Demand alerts */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Demand Alerts</h2>
            <Link to="/demand-alerts">
              <Button variant="ghost" size="sm">All <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
          <div className="space-y-3">
            {mockDemandAlerts.slice(0, 4).map((alert) => (
              <div key={alert.crop} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{alert.crop}</p>
                  <p className="text-xs text-gray-500">{alert.location} · {alert.demandQty} kg demand</p>
                </div>
                <Badge variant={alert.level === 'high' ? 'red' : alert.level === 'increasing' ? 'amber' : 'green'}>
                  {alert.change > 0 ? '+' : ''}{alert.change}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My crop listings */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Crop Listings</h2>
            <Link to="/sell-crop">
              <Button variant="secondary" size="sm"><Package className="w-4 h-4" /> List Crop</Button>
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
          ) : listings.length === 0 ? (
            <div className="text-center py-8">
              <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No listings yet. Start selling your crops!</p>
              <Link to="/sell-crop" className="inline-block mt-3">
                <Button size="sm" variant="primary">List Your First Crop</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((l) => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{l.crop_name} · {l.quantity} {l.unit}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(l.expected_price)}/{l.unit} · Grade {l.quality_grade}</p>
                  </div>
                  <Badge variant={l.status === 'sold' ? 'green' : l.status === 'buyer_interested' ? 'amber' : 'blue'}>
                    {l.status === 'buyer_interested' ? 'Buyer Interested' : l.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Weather + buyer requests */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weather & Alerts</h2>
          {weather && (
            <div className={`p-4 rounded-xl mb-3 ${weather.severity === 'warning' ? 'bg-amber-50 border border-amber-100' : 'bg-sky-50 border border-sky-100'}`}>
              <div className="flex items-start gap-3">
                {weather.alert_type === 'rain' ? <CloudRain className="w-5 h-5 text-sky-600 flex-shrink-0" /> : <Sun className="w-5 h-5 text-amber-600 flex-shrink-0" />}
                <div>
                  <p className="font-semibold text-sm text-gray-900 capitalize">{weather.alert_type} Alert</p>
                  <p className="text-xs text-gray-600 mt-0.5">{weather.message}</p>
                  {weather.temperature && (
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>{weather.temperature}°C</span>
                      <span>Rain: {weather.rain_probability}%</span>
                      <span>Humidity: {weather.humidity}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <Link to="/find-buyers">
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3 cursor-pointer hover:bg-green-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">6 Active Buyers</p>
                <p className="text-xs text-gray-600">Looking for crops near you</p>
              </div>
              <ArrowRight className="w-4 h-4 text-green-700 ml-auto" />
            </div>
          </Link>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <Link to="/compare-markets"><Card className="p-4 items-center flex flex-col" hover><Store className="w-6 h-6 text-green-700 mb-2" /><span className="text-sm font-medium text-gray-700">Compare Markets</span></Card></Link>
        <Link to="/price-prediction"><Card className="p-4 items-center flex flex-col" hover><BarChart3 className="w-6 h-6 text-green-700 mb-2" /><span className="text-sm font-medium text-gray-700">Price Prediction</span></Card></Link>
        <Link to="/transport"><Card className="p-4 items-center flex flex-col" hover><Package className="w-6 h-6 text-green-700 mb-2" /><span className="text-sm font-medium text-gray-700">Transport Cost</span></Card></Link>
        <Link to="/profit-calculator"><Card className="p-4 items-center flex flex-col" hover><TrendingUp className="w-6 h-6 text-green-700 mb-2" /><span className="text-sm font-medium text-gray-700">Profit Calculator</span></Card></Link>
      </div>
    </DashboardLayout>
  );
}
