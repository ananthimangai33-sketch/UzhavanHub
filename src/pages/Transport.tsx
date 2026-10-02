import { useState } from 'react';
import { Truck, Calculator, MapPin, Package } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Button, Input, Select } from '@/components/ui';
import { mockNearbyMarkets, mockTransportRates } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

export function TransportPage() {
  const [quantity, setQuantity] = useState(500);
  const [market, setMarket] = useState(mockNearbyMarkets[0].name);
  const [distance, setDistance] = useState(mockNearbyMarkets[0].distance);
  const [vehicle, setVehicle] = useState('Mini Truck');
  const [pricePerKg, setPricePerKg] = useState(30);

  const handleMarketChange = (name: string) => {
    setMarket(name);
    const m = mockNearbyMarkets.find(m => m.name === name);
    if (m) {
      setDistance(m.distance);
      setPricePerKg(m.price);
    }
  };

  const ratePerKm = mockTransportRates[vehicle];
  const transportCost = Math.round(distance * ratePerKg);
  const grossRevenue = quantity * pricePerKg;
  const netRevenue = grossRevenue - transportCost;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transport Cost Estimator</h1>
        <p className="text-gray-500 mt-1">Calculate actual profit by including transportation costs</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-green-700" />
            <h2 className="text-lg font-semibold text-gray-900">Transport Details</h2>
          </div>
          <div className="space-y-4">
            <Input label="Crop Quantity (kg)" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} />
            <Select label="Market" value={market} onChange={(e) => handleMarketChange(e.target.value)} options={mockNearbyMarkets.map(m => ({ value: m.name, label: m.name }))} />
            <Input label="Distance (km)" type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} min={1} />
            <Select label="Vehicle Type" value={vehicle} onChange={(e) => setVehicle(e.target.value)} options={Object.keys(mockTransportRates).map(v => ({ value: v, label: `${v} (₹${mockTransportRates[v]}/km)` }))} />
            <Input label="Selling Price (per kg)" type="number" value={pricePerKg} onChange={(e) => setPricePerKg(Number(e.target.value))} min={1} />
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-green-700 to-green-800 text-white border-0">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Estimate Results</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-green-200" />
                  <span className="text-sm text-green-100">Gross Revenue</span>
                </div>
                <span className="text-xl font-bold">{formatCurrency(grossRevenue)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-200" />
                  <span className="text-sm text-green-100">Transport Cost</span>
                </div>
                <span className="text-xl font-bold text-amber-300">- {formatCurrency(transportCost)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-green-100 font-semibold">Net Expected Revenue</span>
                <span className="text-2xl font-bold">{formatCurrency(netRevenue)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Distance</span><span className="font-medium text-gray-900">{distance} km</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Vehicle Rate</span><span className="font-medium text-gray-900">₹{ratePerKm}/km</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Transport Cost</span><span className="font-medium text-gray-900">{formatCurrency(transportCost)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Price per kg</span><span className="font-medium text-gray-900">{formatCurrency(pricePerKg)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-medium text-gray-900">{quantity} kg</span></div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs text-amber-700">
                <MapPin className="w-4 h-4 inline mr-1" />
                Tip: Sometimes a farther market with higher prices yields more profit than a closer one. Always compare net revenue, not just selling price.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
