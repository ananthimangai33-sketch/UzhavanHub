import { useEffect, useState } from 'react';
import {
  Sprout, Users, Package, ShoppingCart, Store, Bell,
  TrendingUp, BarChart3, BadgeCheck, CheckCircle2, XCircle
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, StatCard, Badge, Button, Modal } from '@/components/ui';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { mockPriceHistory } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Profile, CropListing, BuyerRequest, MarketPrice } from '@/lib/types';

const pieColors = ['#166534', '#22C55E', '#F59E0B', '#0EA5E9', '#92400E', '#EF4444'];

export function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState({ farmers: 0, buyers: 0, listings: 0, requests: 0 });
  const [recentListings, setRecentListings] = useState<CropListing[]>([]);
  const [recentBuyers, setRecentBuyers] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyModal, setVerifyModal] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const [farmersRes, buyersRes, listingsRes, requestsRes, recentListingsRes, buyersDataRes, pricesRes] = await Promise.all([
        supabase.from('farmers').select('id', { count: 'exact' }),
        supabase.from('buyers').select('id', { count: 'exact' }),
        supabase.from('crop_listings').select('id', { count: 'exact' }),
        supabase.from('buyer_requests').select('id', { count: 'exact' }),
        supabase.from('crop_listings').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('buyers').select('*, profiles(name, email, phone)').order('created_at', { ascending: false }).limit(5),
        supabase.from('market_prices').select('*').order('price', { ascending: false }).limit(10),
      ]);
      setStats({
        farmers: farmersRes.count || 0,
        buyers: buyersRes.count || 0,
        listings: listingsRes.count || 0,
        requests: requestsRes.count || 0,
      });
      setRecentListings((recentListingsRes.data as CropListing[]) || []);
      setRecentBuyers((buyersDataRes.data as any[]) || []);
      setMarketPrices((pricesRes.data as MarketPrice[]) || []);
      setLoading(false);
    })();
  }, []);

  const verifyBuyer = async (id: string, status: 'verified' | 'rejected') => {
    await supabase.from('buyers').update({ verification_status: status }).eq('id', id);
    setRecentBuyers(prev => prev.map(b => b.id === id ? { ...b, verification_status: status } : b));
    setVerifyModal(null);
    toast('success', `Buyer ${status}`, `Buyer has been ${status}.`);
  };

  const cropDistribution = [
    { name: 'Tomato', value: 35 },
    { name: 'Onion', value: 25 },
    { name: 'Paddy', value: 20 },
    { name: 'Banana', value: 12 },
    { name: 'Turmeric', value: 8 },
  ];

  const demandData = [
    { name: 'Tomato', demand: 2500 },
    { name: 'Onion', demand: 1800 },
    { name: 'Paddy', demand: 3200 },
    { name: 'Banana', demand: 1200 },
    { name: 'Turmeric', demand: 800 },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and management</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<Sprout className="w-5 h-5" />} label="Total Farmers" value={stats.farmers} color="green" />
            <StatCard icon={<Users className="w-5 h-5" />} label="Total Buyers" value={stats.buyers} color="blue" />
            <StatCard icon={<Package className="w-5 h-5" />} label="Active Listings" value={stats.listings} color="amber" />
            <StatCard icon={<ShoppingCart className="w-5 h-5" />} label="Buyer Requests" value={stats.requests} color="green" />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Listed Crops</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={cropDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }: any) => name}>
                    {cropDistribution.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Demanded Crops (kg)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#999" />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-5 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Trends (Tomato - This Week)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockPriceHistory.Tomato}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#166534" strokeWidth={3} dot={{ r: 4, fill: '#22C55E' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent listings + buyer verification */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Crop Listings</h3>
              {recentListings.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No listings yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentListings.map(l => (
                    <div key={l.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{l.crop_name} · {l.quantity} {l.unit}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(l.expected_price)}/{l.unit} · {formatDate(l.created_at)}</p>
                      </div>
                      <Badge variant={l.status === 'sold' ? 'green' : l.status === 'buyer_interested' ? 'amber' : 'blue'}>{l.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Verification</h3>
              {recentBuyers.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No buyers registered yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentBuyers.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{b.business_name}</p>
                        <p className="text-xs text-gray-500">{b.profiles?.name} · {b.profiles?.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={b.verification_status === 'verified' ? 'green' : b.verification_status === 'rejected' ? 'red' : 'amber'}>
                          {b.verification_status}
                        </Badge>
                        {b.verification_status === 'pending' && (
                          <Button size="sm" variant="primary" onClick={() => setVerifyModal(b)}>Review</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Market prices table */}
          <Card className="p-5 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Price Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                    <th className="pb-2 font-medium">Crop</th>
                    <th className="pb-2 font-medium">Market</th>
                    <th className="pb-2 font-medium">Price</th>
                    <th className="pb-2 font-medium">Yesterday</th>
                    <th className="pb-2 font-medium">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {marketPrices.map(p => (
                    <tr key={p.id} className="border-b border-gray-50">
                      <td className="py-2.5 font-medium text-gray-900">{p.crop_name}</td>
                      <td className="py-2.5 text-gray-600">{p.market_name}</td>
                      <td className="py-2.5 font-bold text-green-700">{formatCurrency(p.price)}/kg</td>
                      <td className="py-2.5 text-gray-600">{p.price_yesterday ? formatCurrency(p.price_yesterday) : '—'}</td>
                      <td className="py-2.5 text-gray-600">{p.distance_km} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Verify modal */}
      <Modal open={!!verifyModal} onClose={() => setVerifyModal(null)} title="Verify Buyer" size="sm">
        {verifyModal && (
          <div>
            <div className="mb-4">
              <p className="font-semibold text-gray-900">{verifyModal.business_name}</p>
              <p className="text-sm text-gray-500">{verifyModal.profiles?.name} · {verifyModal.profiles?.email}</p>
              <p className="text-sm text-gray-500 mt-1">Required crops: {verifyModal.required_crops || 'Not specified'}</p>
            </div>
            <div className="flex gap-3">
              <Button fullWidth onClick={() => verifyBuyer(verifyModal.id, 'verified')}><CheckCircle2 className="w-4 h-4" /> Verify</Button>
              <Button fullWidth variant="danger" onClick={() => verifyBuyer(verifyModal.id, 'rejected')}><XCircle className="w-4 h-4" /> Reject</Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('farmers').select('*, profiles(name, email, phone, location, district)').order('created_at', { ascending: false });
      setFarmers((data as any[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Farmers</h1>
        <p className="text-gray-500 mt-1">{farmers.length} registered farmers</p>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : farmers.length === 0 ? (
        <Card className="p-8 text-center">
          <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No farmers registered yet.</p>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Phone</th>
                  <th className="pb-2 font-medium">Main Crop</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map(f => (
                  <tr key={f.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-900">{f.profiles?.name}</td>
                    <td className="py-3 text-gray-600">{f.profiles?.email}</td>
                    <td className="py-3 text-gray-600">{f.profiles?.phone}</td>
                    <td className="py-3"><Badge variant="green">{f.main_crop || '—'}</Badge></td>
                    <td className="py-3 text-gray-600">{f.profiles?.location || '—'}</td>
                    <td className="py-3 text-gray-400 text-xs">{formatDate(f.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}

export function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('buyers').select('*, profiles(name, email, phone, location)').order('created_at', { ascending: false });
      setBuyers((data as any[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Buyers</h1>
        <p className="text-gray-500 mt-1">{buyers.length} registered buyers</p>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : buyers.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No buyers registered yet.</p>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                  <th className="pb-2 font-medium">Business</th>
                  <th className="pb-2 font-medium">Contact</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Crops</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map(b => (
                  <tr key={b.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-900">{b.business_name}</td>
                    <td className="py-3 text-gray-600">{b.profiles?.name}</td>
                    <td className="py-3 text-gray-600">{b.profiles?.email}</td>
                    <td className="py-3 text-gray-600">{b.required_crops || '—'}</td>
                    <td className="py-3"><Badge variant={b.verification_status === 'verified' ? 'green' : b.verification_status === 'rejected' ? 'red' : 'amber'}>{b.verification_status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}

export function AdminListingsPage() {
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('crop_listings').select('*').order('created_at', { ascending: false });
      setListings((data as CropListing[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Listings</h1>
        <p className="text-gray-500 mt-1">{listings.length} total crop listings</p>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : listings.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No listings yet.</p>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                  <th className="pb-2 font-medium">Crop</th>
                  <th className="pb-2 font-medium">Qty</th>
                  <th className="pb-2 font-medium">Price</th>
                  <th className="pb-2 font-medium">Grade</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-900">{l.crop_name}</td>
                    <td className="py-3 text-gray-600">{l.quantity} {l.unit}</td>
                    <td className="py-3 font-bold text-green-700">{formatCurrency(l.expected_price)}</td>
                    <td className="py-3"><Badge variant={l.quality_grade === 'A' ? 'green' : 'amber'}>{l.quality_grade}</Badge></td>
                    <td className="py-3 text-gray-600">{l.location}</td>
                    <td className="py-3"><Badge variant={l.status === 'sold' ? 'green' : l.status === 'buyer_interested' ? 'amber' : 'blue'}>{l.status}</Badge></td>
                    <td className="py-3 text-gray-400 text-xs">{formatDate(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}

export function AdminPricesPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('market_prices').select('*').order('crop_name').order('price', { ascending: false });
      setPrices((data as MarketPrice[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Market Price Data</h1>
        <p className="text-gray-500 mt-1">{prices.length} price entries across Tamil Nadu markets</p>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : (
        <Card className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                  <th className="pb-2 font-medium">Crop</th>
                  <th className="pb-2 font-medium">Market</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Price</th>
                  <th className="pb-2 font-medium">Yesterday</th>
                  <th className="pb-2 font-medium">High</th>
                  <th className="pb-2 font-medium">Low</th>
                  <th className="pb-2 font-medium">Distance</th>
                </tr>
              </thead>
              <tbody>
                {prices.map(p => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-900">{p.crop_name}</td>
                    <td className="py-3 text-gray-600">{p.market_name}</td>
                    <td className="py-3 text-gray-600">{p.location}</td>
                    <td className="py-3 font-bold text-green-700">{formatCurrency(p.price)}</td>
                    <td className="py-3 text-gray-600">{p.price_yesterday ? formatCurrency(p.price_yesterday) : '—'}</td>
                    <td className="py-3 text-green-600">{p.price_high ? formatCurrency(p.price_high) : '—'}</td>
                    <td className="py-3 text-red-600">{p.price_low ? formatCurrency(p.price_low) : '—'}</td>
                    <td className="py-3 text-gray-600">{p.distance_km} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}

export function AdminAnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500 mt-1">Key metrics and trends</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              { month: 'Mar', users: 5 }, { month: 'Apr', users: 12 }, { month: 'May', users: 25 },
              { month: 'Jun', users: 42 }, { month: 'Jul', users: 68 }, { month: 'Aug', users: 95 },
              { month: 'Sep', users: 120 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#166534" strokeWidth={3} dot={{ r: 4, fill: '#22C55E' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users by Role</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[{ name: 'Farmers', value: 80 }, { name: 'Buyers', value: 35 }, { name: 'Admins', value: 5 }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }: any) => `${name}: ${value}`}
              >
                <Cell fill="#166534" />
                <Cell fill="#F59E0B" />
                <Cell fill="#0EA5E9" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Listings by Crop</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: 'Tomato', count: 35 }, { name: 'Onion', count: 25 }, { name: 'Paddy', count: 20 },
              { name: 'Banana', count: 12 }, { name: 'Turmeric', count: 8 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis tick={{ fontSize: 11 }} stroke="#999" />
              <Tooltip />
              <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Trend (Tomato)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockPriceHistory.Tomato}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#166534" strokeWidth={3} dot={{ r: 4, fill: '#22C55E' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </DashboardLayout>
  );
}
