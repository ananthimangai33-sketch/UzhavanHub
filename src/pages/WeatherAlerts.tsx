import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, Select } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { tnLocations } from '@/lib/mockData';
import type { WeatherAlert } from '@/lib/types';

export function WeatherPage() {
  const [location, setLocation] = useState('Coimbatore');
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('weather_alerts').select('*').eq('location', location).order('created_at', { ascending: false });
      setAlerts((data as WeatherAlert[]) || []);
      setLoading(false);
    })();
  }, [location]);

  const current = alerts[0];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Weather & Farm Alerts</h1>
        <p className="text-gray-500 mt-1">Stay ahead with weather forecasts that affect your harvest and transport</p>
      </div>

      <Card className="p-4 mb-6">
        <Select label="Select Location" value={location} onChange={(e) => setLocation(e.target.value)} options={tnLocations.map(l => ({ value: l, label: l }))} className="max-w-xs" />
      </Card>

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading weather data...</p>
      ) : current ? (
        <>
          {/* Current weather */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-sky-500 to-sky-600 text-white border-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sky-100 text-sm">Current Weather · {location}</p>
                <p className="text-4xl font-bold mt-1">{current.temperature}°C</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                {current.alert_type === 'rain' ? <CloudRain className="w-8 h-8" /> : <Sun className="w-8 h-8" />}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-xl p-3">
                <Droplets className="w-5 h-5 mb-1" />
                <p className="text-xs text-sky-100">Rain Chance</p>
                <p className="text-lg font-bold">{current.rain_probability}%</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <Wind className="w-5 h-5 mb-1" />
                <p className="text-xs text-sky-100">Wind</p>
                <p className="text-lg font-bold">{current.wind_speed} km/h</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <Thermometer className="w-5 h-5 mb-1" />
                <p className="text-xs text-sky-100">Humidity</p>
                <p className="text-lg font-bold">{current.humidity}%</p>
              </div>
            </div>
          </Card>

          {/* Alerts */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
            {alerts.map(alert => (
              <Card key={alert.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'warning' ? 'bg-amber-100' : alert.severity === 'critical' ? 'bg-red-100' : 'bg-sky-100'
                  }`}>
                    {alert.alert_type === 'rain' ? <CloudRain className={`w-6 h-6 ${alert.severity === 'warning' ? 'text-amber-600' : 'text-sky-600'}`} /> :
                     alert.alert_type === 'heat' ? <Sun className="w-6 h-6 text-amber-600" /> :
                     alert.alert_type === 'wind' ? <Wind className="w-6 h-6 text-amber-600" /> :
                     <Cloud className="w-6 h-6 text-sky-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 capitalize">{alert.alert_type} Alert</h3>
                      <Badge variant={alert.severity === 'warning' ? 'amber' : alert.severity === 'critical' ? 'red' : 'blue'}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{alert.location} · {new Date(alert.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="p-8 text-center">
          <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No weather data for {location}. Demo data available for Coimbatore, Pollachi, Erode, Mettupalayam.</p>
        </Card>
      )}
    </DashboardLayout>
  );
}
