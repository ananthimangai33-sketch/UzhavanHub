import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, MapPin, BadgeCheck, MessageSquare, Eye, Send } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Button, Input, Badge, Modal, Select } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { mockBuyers, allCrops } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

export function FindBuyersPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState<typeof mockBuyers[0] | null>(null);

  const filtered = mockBuyers.filter(b => {
    const matchesSearch = b.business_name.toLowerCase().includes(search.toLowerCase()) || b.buyer_name.toLowerCase().includes(search.toLowerCase());
    const matchesCrop = !cropFilter || b.crop_name === cropFilter;
    return matchesSearch && matchesCrop;
  });

  const sendRequest = async (buyer: typeof mockBuyers[0]) => {
    toast('success', 'Request Sent!', `Your crop request has been sent to ${buyer.business_name}.`);
    setSelectedBuyer(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Buyers</h1>
        <p className="text-gray-500 mt-1">Connect directly with verified buyers looking for your crops</p>
      </div>

      {/* Search & filter */}
      <Card className="p-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input placeholder="Search by buyer or business name..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
          <Select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} options={allCrops.map(c => ({ value: c, label: c }))} placeholder="All crops" />
        </div>
      </Card>

      {/* Buyer cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(buyer => (
          <Card key={buyer.id} className="p-5" hover>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold">
                  {buyer.business_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{buyer.business_name}</h3>
                  <p className="text-xs text-gray-500">{buyer.buyer_name}</p>
                </div>
              </div>
              {buyer.verification_status === 'verified' && (
                <Badge variant="green"><BadgeCheck className="w-3 h-3" /> Verified</Badge>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Looking for</span>
                <span className="font-medium text-gray-900">{buyer.crop_name} · {buyer.quantity} {buyer.unit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Offered Price</span>
                <span className="font-bold text-green-700">{formatCurrency(buyer.offered_price)}/{buyer.unit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-900 flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {buyer.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button size="sm" variant="primary" onClick={() => sendRequest(buyer)}><Send className="w-3.5 h-3.5" /> Request</Button>
              <Link to="/chat"><Button size="sm" variant="secondary"><MessageSquare className="w-3.5 h-3.5" /> Chat</Button></Link>
              <Button size="sm" variant="ghost" onClick={() => setSelectedBuyer(buyer)}><Eye className="w-3.5 h-3.5" /> Details</Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No buyers found. Try a different search.</p>
        </Card>
      )}

      {/* Buyer details modal */}
      <Modal open={!!selectedBuyer} onClose={() => setSelectedBuyer(null)} title="Buyer Details">
        {selectedBuyer && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
                {selectedBuyer.business_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selectedBuyer.business_name}</h3>
                <p className="text-sm text-gray-500">{selectedBuyer.buyer_name}</p>
                {selectedBuyer.verification_status === 'verified' && <Badge variant="green" className="mt-1"><BadgeCheck className="w-3 h-3" /> Verified Buyer</Badge>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500">Required Crop</p>
                <p className="font-semibold text-gray-900">{selectedBuyer.crop_name}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500">Required Quantity</p>
                <p className="font-semibold text-gray-900">{selectedBuyer.quantity} {selectedBuyer.unit}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <p className="text-xs text-gray-500">Offered Price</p>
                <p className="font-semibold text-green-700">{formatCurrency(selectedBuyer.offered_price)}/{selectedBuyer.unit}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-semibold text-gray-900">{selectedBuyer.location}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-xs text-gray-500">Also Requires</p>
              <p className="text-sm text-gray-700">{selectedBuyer.required_crops}</p>
            </div>
            <div className="flex gap-3">
              <Button fullWidth onClick={() => sendRequest(selectedBuyer)}><Send className="w-4 h-4" /> Send Request</Button>
              <Link to="/chat" className="flex-1"><Button fullWidth variant="secondary"><MessageSquare className="w-4 h-4" /> Start Chat</Button></Link>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
