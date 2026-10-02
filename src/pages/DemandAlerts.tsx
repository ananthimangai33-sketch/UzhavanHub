import { Flame, TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge } from '@/components/ui';
import { mockDemandAlerts } from '@/lib/mockData';

export function DemandAlertsPage() {
  const getIcon = (level: string) => {
    if (level === 'high') return <Flame className="w-5 h-5 text-red-600" />;
    if (level === 'increasing') return <TrendingUp className="w-5 h-5 text-amber-600" />;
    if (level === 'stable') return <Minus className="w-5 h-5 text-green-600" />;
    return <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getBadge = (level: string) => {
    if (level === 'high') return <Badge variant="red">High Demand</Badge>;
    if (level === 'increasing') return <Badge variant="amber">Increasing</Badge>;
    if (level === 'stable') return <Badge variant="green">Stable</Badge>;
    return <Badge variant="gray">Declining</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Demand Alerts</h1>
        <p className="text-gray-500 mt-1">Track crop demand trends and get recommendations on when to sell</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDemandAlerts.map(alert => (
          <Card key={alert.crop} className="p-5" hover>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  {getIcon(alert.level)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{alert.crop}</h3>
                  <p className="text-xs text-gray-500">{alert.location}</p>
                </div>
              </div>
              {getBadge(alert.level)}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">Change</p>
                <p className={`font-bold text-sm ${alert.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {alert.change > 0 ? '+' : ''}{alert.change}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">Buyer Demand</p>
                <p className="font-bold text-sm text-gray-900">{alert.demandQty.toLocaleString('en-IN')} kg</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{alert.action}</p>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
