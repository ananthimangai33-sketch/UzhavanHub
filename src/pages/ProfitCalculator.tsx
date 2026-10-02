import { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Input, Select } from '@/components/ui';
import { allCrops } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

export function ProfitCalculatorPage() {
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState(500);
  const [sellingPrice, setSellingPrice] = useState(32);
  const [productionCost, setProductionCost] = useState(8000);
  const [transportCost, setTransportCost] = useState(1200);
  const [otherExpenses, setOtherExpenses] = useState(500);

  const totalRevenue = quantity * sellingPrice;
  const totalCost = productionCost + transportCost + otherExpenses;
  const profit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : '0';
  const isProfit = profit >= 0;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profit Calculator</h1>
        <p className="text-gray-500 mt-1">Calculate your estimated profit from crop sales</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-green-700" />
            <h2 className="text-lg font-semibold text-gray-900">Enter Details</h2>
          </div>
          <div className="space-y-4">
            <Select label="Crop" value={crop} onChange={(e) => setCrop(e.target.value)} options={allCrops.map(c => ({ value: c, label: c }))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity (kg)" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} />
              <Input label="Selling Price (per kg)" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} min={1} />
            </div>
            <Input label="Production Cost" type="number" value={productionCost} onChange={(e) => setProductionCost(Number(e.target.value))} min={0} />
            <Input label="Transport Cost" type="number" value={transportCost} onChange={(e) => setTransportCost(Number(e.target.value))} min={0} />
            <Input label="Other Expenses" type="number" value={otherExpenses} onChange={(e) => setOtherExpenses(Number(e.target.value))} min={0} />
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className={`p-6 border-2 ${isProfit ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <div className="flex items-center gap-2 mb-4">
              {isProfit ? <TrendingUp className="w-5 h-5 text-green-700" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
              <h2 className="text-lg font-semibold text-gray-900">Estimated Profit</h2>
            </div>
            <p className={`text-4xl font-bold ${isProfit ? 'text-green-700' : 'text-red-600'}`}>
              {isProfit ? '+' : ''}{formatCurrency(profit)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Profit Margin: {profitMargin}%</p>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-sm text-gray-500 flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-600" /> Total Revenue</span>
                <span className="text-lg font-bold text-green-700">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Production Cost</span>
                <span className="font-medium text-gray-900">- {formatCurrency(productionCost)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Transport Cost</span>
                <span className="font-medium text-gray-900">- {formatCurrency(transportCost)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Other Expenses</span>
                <span className="font-medium text-gray-900">- {formatCurrency(otherExpenses)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-semibold text-gray-700">Total Cost</span>
                <span className="font-bold text-gray-900">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`text-sm ${isProfit ? 'text-green-700' : 'text-red-600'}`}>
              {isProfit
                ? `You are making a profit of ${formatCurrency(profit)} on this sale. Your profit margin is ${profitMargin}%.`
                : `You are making a loss of ${formatCurrency(Math.abs(profit))}. Consider finding a better market price or reducing costs.`}
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
