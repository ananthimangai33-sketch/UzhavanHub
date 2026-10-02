import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Package, Users, MessageSquare, TrendingUp, ShoppingCart,
  ArrowRight, Sprout, Store, Bell
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, StatCard, Button, Badge, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { mockBuyers, mockPriceHistory } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import type { CropListing, BuyerRequest } from '@/lib/types';

export function BuyerDashboard() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<CropListing[]>([]);
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!profile) return;
      const [listingsRes, requestsRes] = await Promise.all([
        supabase.from('crop_listings').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('buyer_requests').select('*').eq('buyer_id', profile.id).order('created_at', { ascending: false }),
      ]);
      setListings((listingsRes.data as CropListing[]) || []);
      setRequests((requestsRes.data as BuyerRequest[]) || []);
      setLoading(false);
    })();
  }, [profile]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {profile?.name}. Find the best crops from farmers near you.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Package className="w-5 h-5" />} label="Available Listings" value={listings.length} color="green" />
        <StatCard icon={<ShoppingCart className="w-5 h-5" />} label="My Requests" value={requests.length} color="amber" />
        <StatCard icon={<Users className="w-5 h-5" />} label="Active Farmers" value="12" color="blue" />
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Chat Requests" value="3" color="green" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent listings */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Crop Listings</h2>
            <Link to="/buyer-listings"><Button variant="ghost" size="sm">View all <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
          </div>
          {loading ? (
            <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>
          ) : listings.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No listings available yet.</p>
          ) : (
            <div className="space-y-2">
              {listings.slice(0, 4).map(l => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{l.crop_name} · {l.quantity} {l.unit}</p>
                    <p className="text-xs text-gray-500">Grade {l.quality_grade} · {l.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700 text-sm">{formatCurrency(l.expected_price)}/{l.unit}</p>
                    <Badge variant={l.status === 'sold' ? 'green' : l.status === 'buyer_interested' ? 'amber' : 'blue'}>
                      {l.status === 'buyer_interested' ? 'Interested' : l.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* My requests + quick actions */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Requests</h2>
              <Link to="/buyer-requests"><Button variant="ghost" size="sm">Manage <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
            </div>
            {requests.length === 0 ? (
              <div className="text-center py-6">
                <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No requests yet. Start by searching for crops!</p>
                <Link to="/buyer-crops"><Button size="sm" className="mt-3">Search Crops</Button></Link>
              </div>
            ) : (
              <div className="space-y-2">
                {requests.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{r.crop_name} · {r.quantity} {r.unit}</p>
                      <p className="text-xs text-gray-500">Offer: {formatCurrency(r.offered_price)}/{r.unit}</p>
                    </div>
                    <Badge variant={r.status === 'accepted' ? 'green' : r.status === 'negotiating' ? 'amber' : 'blue'}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/buyer-crops"><Card className="p-3 flex flex-col items-center text-center" hover><Search className="w-5 h-5 text-green-700 mb-1" /><span className="text-xs font-medium text-gray-700">Search Crops</span></Card></Link>
              <Link to="/buyer-listings"><Card className="p-3 flex flex-col items-center text-center" hover><Package className="w-5 h-5 text-green-700 mb-1" /><span className="text-xs font-medium text-gray-700">View Listings</span></Card></Link>
              <Link to="/chat"><Card className="p-3 flex flex-col items-center text-center" hover><MessageSquare className="w-5 h-5 text-green-700 mb-1" /><span className="text-xs font-medium text-gray-700">Chat</span></Card></Link>
              <Link to="/price-discovery"><Card className="p-3 flex flex-col items-center text-center" hover><TrendingUp className="w-5 h-5 text-green-700 mb-1" /><span className="text-xs font-medium text-gray-700">Prices</span></Card></Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export function BuyerCropsPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('crop_listings').select('*').order('created_at', { ascending: false });
      setListings((data as CropListing[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = listings.filter(l => l.crop_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search Crops</h1>
        <p className="text-gray-500 mt-1">Find crops from farmers across Tamil Nadu</p>
      </div>

      <Card className="p-4 mb-6">
        <Input placeholder="Search by crop name..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
      </Card>

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No listings found. Try a different search.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(l => (
            <Card key={l.id} className="p-5" hover>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{l.crop_name}</h3>
                    <p className="text-xs text-gray-500">{l.quantity} {l.unit} · Grade {l.quality_grade}</p>
                  </div>
                </div>
                <Badge variant={l.status === 'sold' ? 'green' : l.status === 'buyer_interested' ? 'amber' : 'blue'}>{l.status}</Badge>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-lg font-bold text-green-700">{formatCurrency(l.expected_price)}/{l.unit}</p>
                <p className="text-xs text-gray-400">{l.location}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="primary" onClick={() => toast('success', 'Offer Sent!', 'Your price offer has been sent to the farmer.')}>Send Offer</Button>
                <Link to="/chat"><Button size="sm" variant="secondary"><MessageSquare className="w-3.5 h-3.5" /> Chat</Button></Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export function BuyerListingsPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Farmer Listings</h1>
        <p className="text-gray-500 mt-1">Browse all crop listings from farmers</p>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : listings.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No farmer listings available yet.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                <th className="pb-2 font-medium">Crop</th>
                <th className="pb-2 font-medium">Quantity</th>
                <th className="pb-2 font-medium">Price</th>
                <th className="pb-2 font-medium">Grade</th>
                <th className="pb-2 font-medium">Location</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id} className="border-b border-gray-50">
                  <td className="py-3 font-medium text-gray-900">{l.crop_name}</td>
                  <td className="py-3 text-gray-600">{l.quantity} {l.unit}</td>
                  <td className="py-3 font-bold text-green-700">{formatCurrency(l.expected_price)}/{l.unit}</td>
                  <td className="py-3"><Badge variant={l.quality_grade === 'A' ? 'green' : l.quality_grade === 'B' ? 'amber' : 'red'}>Grade {l.quality_grade}</Badge></td>
                  <td className="py-3 text-gray-600">{l.location}</td>
                  <td className="py-3"><Badge variant={l.status === 'sold' ? 'green' : l.status === 'buyer_interested' ? 'amber' : 'blue'}>{l.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export function BuyerRequestsPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ crop: 'Tomato', quantity: '500', price: '31', location: 'Coimbatore' });

  useEffect(() => {
    (async () => {
      if (!profile) return;
      const { data } = await supabase.from('buyer_requests').select('*').eq('buyer_id', profile.id).order('created_at', { ascending: false });
      setRequests((data as BuyerRequest[]) || []);
      setLoading(false);
    })();
  }, [profile]);

  const createRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const { data, error } = await supabase.from('buyer_requests').insert({
      buyer_id: profile.id,
      crop_name: form.crop,
      quantity: Number(form.quantity),
      offered_price: Number(form.price),
      location: form.location,
      status: 'open',
    }).select().single();
    if (error) {
      toast('error', 'Failed to create request', error.message);
    } else {
      setRequests(prev => [data as BuyerRequest, ...prev]);
      toast('success', 'Request Created!', 'Your crop request is now visible to farmers.');
      setShowForm(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-500 mt-1">Manage your crop requests and offers</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><ShoppingCart className="w-4 h-4" /> New Request</Button>
      </div>

      {showForm && (
        <Card className="p-5 mb-6">
          <form onSubmit={createRequest} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Crop</label>
              <select value={form.crop} onChange={(e) => setForm(p => ({ ...p, crop: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500">
                {['Tomato', 'Onion', 'Potato', 'Paddy', 'Banana', 'Turmeric'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Quantity (kg)" type="number" value={form.quantity} onChange={(e) => setForm(p => ({ ...p, quantity: e.target.value }))} required />
            <Input label="Offered Price (per kg)" type="number" value={form.price} onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))} required />
            <Input label="Location" value={form.location} onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))} required />
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit">Create Request</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : requests.length === 0 ? (
        <Card className="p-8 text-center">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No requests yet. Create one to find farmers!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{r.crop_name} · {r.quantity} {r.unit}</p>
                  <p className="text-xs text-gray-500">Offer: {formatCurrency(r.offered_price)}/{r.unit} · {r.location}</p>
                </div>
                <Badge variant={r.status === 'accepted' ? 'green' : r.status === 'negotiating' ? 'amber' : r.status === 'rejected' ? 'red' : 'blue'}>{r.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}


