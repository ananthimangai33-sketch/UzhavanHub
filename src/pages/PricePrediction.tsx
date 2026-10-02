import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Area, AreaChart } from 'recharts';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, Select } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { mockPredictionHistory, allCrops } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import type { PricePrediction } from '@/lib/types';

const factors = [
  { name: 'Historical Price', weight: '35%', icon: '📈' },
  { name: 'Demand', weight: '25%', icon: '🔥' },
  { name: 'Supply', weight: '20%', icon: '📦' },
  { name: 'Market Trend', weight: '12%', icon: '📊' },
  { name: 'Seasonal Trend', weight: '8%', icon: '🌱' },
];

export function PricePredictionPage() {
  const [crop, setCrop] = useState('Tomato');
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('price_predictions').select('*').eq('crop_name', crop).limit(1).maybeSingle();
      setPrediction((data as PricePrediction) || null);
      setLoading(false);
    })();
  }, [crop]);

  const chartData = mockPredictionHistory[crop] || mockPredictionHistory.Tomato;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Price Prediction</h1>
        <p className="text-gray-500 mt-1">AI-style predictions based on historical trends and market factors</p>
      </div>

      <Card className="p-4 mb-6">
        <Select label="Select Crop" value={crop} onChange={(e) => setCrop(e.target.value)} options={allCrops.map(c => ({ value: c, label: c }))} className="max-w-xs" />
      </Card>

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading prediction...</p>
      ) : prediction ? (
        <>
          {/* Current vs Predicted */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card className="p-6">
              <p className="text-sm text-gray-500">Current Price</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(prediction.current_price)}/kg</p>
              <p className="text-xs text-gray-400 mt-2">Today's average market price</p>
            </Card>
            <Card className={`p-6 ${prediction.trend === 'up' ? 'bg-green-50 border-green-100' : prediction.trend === 'down' ? 'bg-red-50 border-red-100' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Predicted Price (3 days)</p>
                  <p className={`text-3xl font-bold mt-1 ${prediction.trend === 'up' ? 'text-green-700' : prediction.trend === 'down' ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(prediction.predicted_price)}/kg
                  </p>
                </div>
                {prediction.trend === 'up' ? <TrendingUp className="w-10 h-10 text-green-600" /> :
                 prediction.trend === 'down' ? <TrendingDown className="w-10 h-10 text-red-500" /> :
                 <Minus className="w-10 h-10 text-gray-400" />}
              </div>
              <div className="mt-3">
                <Badge variant={prediction.trend === 'up' ? 'green' : prediction.trend === 'down' ? 'red' : 'gray'}>
                  {prediction.trend === 'up' ? 'Price may increase' : prediction.trend === 'down' ? 'Price may decrease' : 'Price likely stable'}
                </Badge>
                <p className="text-xs text-gray-500 mt-2">Confidence: {Math.round(prediction.confidence * 100)}%</p>
              </div>
            </Card>
          </div>

          {/* Prediction chart */}
          <Card className="p-5 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical → Predicted Price</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#999" />
                <YAxis tick={{ fontSize: 11 }} stroke="#999" domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip formatter={(v: number) => [`₹${v}/kg`, 'Price']} />
                <ReferenceLine x="Day 7" stroke="#999" strokeDasharray="3 3" label={{ value: 'Today', position: 'top', fontSize: 10, fill: '#999' }} />
                <Area type="monotone" dataKey="price" stroke="#166534" strokeWidth={3} fill="url(#colorPrice)" />
                <Line type="monotone" dataKey="price" stroke="#166534" strokeWidth={3} dot={({ payload }) => <circle cx={0} cy={0} r={4} fill={payload.predicted ? '#F59E0B' : '#22C55E'} />} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500" /> Historical</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="w-3 h-3 rounded-full bg-amber-500" /> Predicted</span>
            </div>
          </Card>

          {/* Factors */}
          <Card className="p-5 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Factors</h3>
            <div className="space-y-3">
              {factors.map(f => (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="text-xl">{f.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{f.name}</span>
                      <span className="text-sm text-gray-500">{f.weight}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: f.weight }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              <span className="font-semibold">Disclaimer:</span> Predictions are estimates based on available market trends and should not be treated as guaranteed prices. Always verify current prices before making selling decisions.
            </p>
          </div>
        </>
      ) : (
        <Card className="p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No prediction data available for {crop}.</p>
        </Card>
      )}
    </DashboardLayout>
  );
}
