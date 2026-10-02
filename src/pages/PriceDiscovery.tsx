import { useState, useEffect } from 'react';
import { Search, TrendingUp, MapPin, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, Input, Select } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { mockPriceHistory, allCrops, cropCategories } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import type { MarketPrice } from '@/lib/types';

export function PriceDiscoveryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('market_prices')
        .select('*')
        .eq('crop_name', selectedCrop)
        .order('price', { ascending: false });
      setPrices((data as MarketPrice[]) || []);
      setLoading(false);
    })();
  }, [selectedCrop]);

  const filteredCrops = allCrops.filter(c => c.toLowerCase().includes(search.toLowerCase()));
  const bestPrice = prices.length > 0 ? prices[0] : null;
  const avgPrice = prices.length > 0 ? prices.reduce((sum, p) => sum + p.price, 0) / prices.length : 0;
  const lowPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0;
  const highPrice = prices.length > 0 ? Math.max(...prices.map(p => p.price)) : 0;
  const yesterdayAvg = prices.length > 0 ? prices.reduce((sum, p) => sum + (p.price_yesterday || p.price), 0) / prices.length : 0;
  const priceChange = avgPrice - yesterdayAvg;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crop Price Discovery</h1>
        <p className="text-gray-500 mt-1">Search and compare crop prices across Tamil Nadu markets</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Crop list */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-20">
            <Input placeholder="Search your crop..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button onClick={() => setCategory('')} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${!category ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}>All</button>
              {cropCategories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${category === c ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}>{c}</button>
              ))}
            </div>
            <div className="mt-3 space-y-1 max-h-96 overflow-y-auto">
              {filteredCrops.map(crop => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCrop === crop ? 'bg-green-700 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Price details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCrop}</h2>
                <p className="text-sm text-gray-500">Today's market prices · Demo data</p>
              </div>
              {priceChange !== 0 && (
                <Badge variant={priceChange > 0 ? 'green' : 'red'}>
                  {priceChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {priceChange > 0 ? '+' : ''}{formatCurrency(Math.round(priceChange))} vs yesterday
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-green-50">
                <p className="text-xs text-gray-500">Today's Avg</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(Math.round(avgPrice))}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500">Yesterday</p>
                <p className="text-xl font-bold text-gray-700">{formatCurrency(Math.round(yesterdayAvg))}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <p className="text-xs text-gray-500">Highest</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(highPrice)}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50">
                <p className="text-xs text-gray-500">Lowest</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(lowPrice)}</p>
              </div>
            </div>
          </Card>

          {/* Price trend chart */}
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Price Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockPriceHistory[selectedCrop] || mockPriceHistory.Tomato}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip formatter={(v: number) => [`₹${v}/kg`, 'Price']} />
                <Line type="monotone" dataKey="price" stroke="#166534" strokeWidth={3} dot={{ r: 4, fill: '#22C55E' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Market comparison table */}
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Comparison</h3>
            {loading ? (
              <p className="text-sm text-gray-400 py-8 text-center">Loading prices...</p>
            ) : prices.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No price data available for {selectedCrop}</p>
            ) : (
              <>
                {bestPrice && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100 mb-4 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-700" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">Best Price: {bestPrice.market_name}</p>
                      <p className="text-xs text-green-600">{formatCurrency(bestPrice.price)}/kg · {bestPrice.distance_km} km away</p>
                    </div>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                        <th className="pb-2 font-medium">Market</th>
                        <th className="pb-2 font-medium">Price</th>
                        <th className="pb-2 font-medium">Distance</th>
                        <th className="pb-2 font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((p) => {
                        const change = p.price - (p.price_yesterday || p.price);
                        return (
                          <tr key={p.id} className="border-b border-gray-50">
                            <td className="py-3">
                              <p className="font-medium text-gray-900">{p.market_name}</p>
                              <p className="text-xs text-gray-400 flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {p.location}</p>
                            </td>
                            <td className="py-3 font-bold text-gray-900">{formatCurrency(p.price)}/kg</td>
                            <td className="py-3 text-gray-600">{p.distance_km} km</td>
                            <td className="py-3">
                              {change > 0 ? <span className="text-green-600 text-xs font-medium flex items-center gap-0.5"><ArrowUp className="w-3 h-3" /> +₹{change}</span> :
                               change < 0 ? <span className="text-red-600 text-xs font-medium flex items-center gap-0.5"><ArrowDown className="w-3 h-3" /> ₹{change}</span> :
                               <span className="text-gray-400 text-xs flex items-center gap-0.5"><Minus className="w-3 h-3" /> No change</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
