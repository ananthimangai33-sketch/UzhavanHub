import { useState } from 'react';
import { MapPin, Clock, TrendingUp, Filter, Store } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, Select, Input } from '@/components/ui';
import { mockNearbyMarkets, mockPriceHistory } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

export function NearbyMarketsPage() {
  const [sortBy, setSortBy] = useState('distance');
  const [cropFilter, setCropFilter] = useState('');

  let markets = [...mockNearbyMarkets];
  if (cropFilter) markets = markets.filter(m => m.crops.some(c => c.toLowerCase().includes(cropFilter.toLowerCase())));
  if (sortBy === 'distance') markets.sort((a, b) => a.distance - b.distance);
  if (sortBy === 'price') markets.sort((a, b) => b.price - a.price);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nearby Markets</h1>
        <p className="text-gray-500 mt-1">Find markets close to you with the best prices</p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input placeholder="Filter by crop..." value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} icon={<Filter className="w-4 h-4" />} />
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={[
            { value: 'distance', label: 'Sort by Distance' },
            { value: 'price', label: 'Sort by Highest Price' },
          ]} />
        </div>
      </Card>

      {/* Map placeholder */}
      <Card className="p-0 mb-6 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #166534 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="text-center relative z-10">
            <MapPin className="w-12 h-12 text-green-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Map View (Demo)</p>
            <p className="text-xs text-gray-400">Interactive map will be integrated with Google Maps API</p>
          </div>
        </div>
      </Card>

      {/* Market cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map(m => (
          <Card key={m.name} className="p-5" hover>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Store className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{m.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {m.distance} km away</p>
                </div>
              </div>
              <Badge variant="green">{formatCurrency(m.price)}/{m.crop}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <Clock className="w-3.5 h-3.5" /> {m.hours}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Available Crops</p>
              <div className="flex flex-wrap gap-1">
                {m.crops.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-lg bg-gray-100 text-xs text-gray-600">{c}</span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
