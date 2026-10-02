import { useState, useEffect } from 'react';
import { Scale, MapPin, TrendingUp, Truck, Award } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Button, Select, Input, Badge } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { allCrops, tnLocations, mockTransportRates } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import type { MarketPrice } from '@/lib/types';

export function CompareMarketsPage() {
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState(500);
  const [location, setLocation] = useState('Coimbatore');
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('market_prices')
        .select('*')
        .eq('crop_name', crop)
        .order('price', { ascending: false });
      setPrices((data as MarketPrice[]) || []);
      setLoading(false);
    })();
  }, [crop]);

  const transportRatePerKm = mockTransportRates['Mini Truck'];
  const comparisons = prices.map(p => {
    const revenue = p.price * quantity;
    const transportCost = Math.round((p.distance_km || 0) * transportRatePerKm);
    const profit = revenue - transportCost;
    return { ...p, revenue, transportCost, profit };
  });
  const best = comparisons.length > 0 ? comparisons.reduce((max, c) => c.profit > max.profit ? c : max) : null;

  const chartData = comparisons.map(c => ({
    name: c.market_name.replace(' Market', ''),
    Revenue: c.revenue,
    Profit: c.profit,
    Transport: c.transportCost,
  }));

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compare Markets</h1>
        <p className="text-gray-500 mt-1">Find the most profitable market by considering price, distance, and transport cost</p>
      </div>

      {/* Inputs */}
      <Card className="p-5 mb-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <Select label="Crop" value={crop} onChange={(e) => setCrop(e.target.value)} options={allCrops.map(c => ({ value: c, label: c }))} />
          <Input label="Quantity (kg)" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} />
          <Select label="Your Location" value={location} onChange={(e) => setLocation(e.target.value)} options={tnLocations.map(l => ({ value: l, label: l }))} />
        </div>
      </Card>

      {/* Recommendation */}
      {best && (
        <Card className="p-5 mb-6 bg-gradient-to-r from-green-700 to-green-800 text-white border-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-green-100 text-sm">Recommended Market</p>
              <p className="text-xl font-bold">{best.market_name}</p>
              <p className="text-sm text-green-100 mt-0.5">
                {formatCurrency(best.revenue)} revenue - {formatCurrency(best.transportCost)} transport = <span className="font-bold text-white">{formatCurrency(best.profit)} profit</span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="p-5 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Profit by Market</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis tick={{ fontSize: 11 }} stroke="#999" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="Revenue" fill="#86efac" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Profit" fill="#166534" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="w-3 h-3 rounded bg-[#86efac]" /> Revenue</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="w-3 h-3 rounded bg-[#166534]" /> Estimated Profit</span>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Comparison</h3>
        {loading ? (
          <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                  <th className="pb-2 font-medium">Market</th>
                  <th className="pb-2 font-medium">Price/kg</th>
                  <th className="pb-2 font-medium">Distance</th>
                  <th className="pb-2 font-medium">Revenue</th>
                  <th className="pb-2 font-medium">Transport</th>
                  <th className="pb-2 font-medium">Profit</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c) => (
                  <tr key={c.id} className={`border-b border-gray-50 ${best?.id === c.id ? 'bg-green-50' : ''}`}>
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{c.market_name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {c.location}</p>
                    </td>
                    <td className="py-3 font-bold text-gray-900">{formatCurrency(c.price)}</td>
                    <td className="py-3 text-gray-600">{c.distance_km} km</td>
                    <td className="py-3 text-gray-900 font-medium">{formatCurrency(c.revenue)}</td>
                    <td className="py-3 text-gray-600">{formatCurrency(c.transportCost)}</td>
                    <td className="py-3">
                      <span className="font-bold text-green-700">{formatCurrency(c.profit)}</span>
                      {best?.id === c.id && <Badge variant="green" className="ml-2">Best</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-xs text-amber-700">
            <Truck className="w-4 h-4 inline mr-1" />
            Transport cost estimated at ₹{transportRatePerKm}/km for mini truck. Actual costs may vary. Use the Transport Cost Estimator for detailed calculations.
          </p>
        </div>
      </Card>
    </DashboardLayout>
  );
}
