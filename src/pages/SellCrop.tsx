import { useState, useEffect } from 'react';
import { Package, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Button, Input, Select, Textarea, Badge, EmptyState } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { allCrops, tnLocations } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { CropListing } from '@/lib/types';

export function SellCropPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [form, setForm] = useState({
    cropName: '', quantity: '', unit: 'kg', expectedPrice: '', harvestDate: '', location: '', qualityGrade: 'B', description: ''
  });

  useEffect(() => {
    (async () => {
      if (!profile) return;
      const { data } = await supabase.from('crop_listings').select('*').eq('farmer_id', profile.id).order('created_at', { ascending: false });
      setListings((data as CropListing[]) || []);
      setLoading(false);
    })();
  }, [profile]);

  const update = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const { data, error } = await supabase.from('crop_listings').insert({
      farmer_id: profile.id,
      crop_name: form.cropName,
      quantity: Number(form.quantity),
      unit: form.unit,
      expected_price: Number(form.expectedPrice),
      quality_grade: form.qualityGrade,
      harvest_date: form.harvestDate || null,
      location: form.location || profile.location,
      description: form.description || null,
      status: 'active',
    }).select().single();

    if (error) {
      toast('error', 'Failed to list crop', error.message);
    } else {
      toast('success', 'Crop Listed!', 'Your crop has been listed successfully. Buyers can now find you.');
      setListings(prev => [data as CropListing, ...prev]);
      setForm({ cropName: '', quantity: '', unit: 'kg', expectedPrice: '', harvestDate: '', location: '', qualityGrade: 'B', description: '' });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sell Your Crop</h1>
        <p className="text-gray-500 mt-1">List your harvest for buyers to discover and connect with you</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        {showForm && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-green-700" />
              <h2 className="text-lg font-semibold text-gray-900">List Your Crop</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select label="Crop Name" value={form.cropName} onChange={(e) => update('cropName', e.target.value)} options={allCrops.map(c => ({ value: c, label: c }))} placeholder="Select crop" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} required placeholder="e.g. 500" min={1} />
                <Select label="Unit" value={form.unit} onChange={(e) => update('unit', e.target.value)} options={[{ value: 'kg', label: 'kg' }, { value: 'quintal', label: 'quintal' }, { value: 'ton', label: 'ton' }]} />
              </div>
              <Input label="Expected Price (per kg)" type="number" value={form.expectedPrice} onChange={(e) => update('expectedPrice', e.target.value)} required placeholder="e.g. 32" min={1} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Harvest Date" type="date" value={form.harvestDate} onChange={(e) => update('harvestDate', e.target.value)} />
                <Select label="Quality Grade" value={form.qualityGrade} onChange={(e) => update('qualityGrade', e.target.value)} options={[{ value: 'A', label: 'Grade A (Premium)' }, { value: 'B', label: 'Grade B (Standard)' }, { value: 'C', label: 'Grade C (Lower)' }]} />
              </div>
              <Select label="Location" value={form.location} onChange={(e) => update('location', e.target.value)} options={tnLocations.map(l => ({ value: l, label: l }))} placeholder="Select location" />
              <Textarea label="Description" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe your crop quality, freshness, etc." rows={3} />
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Upload crop image</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB (demo — not stored)</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
              <Button type="submit" fullWidth size="lg"><CheckCircle2 className="w-4 h-4" /> List My Crop</Button>
            </form>
          </Card>
        )}

        {/* Listings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Listings ({listings.length})</h2>
          {loading ? (
            <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
          ) : listings.length === 0 ? (
            <Card className="p-6">
              <EmptyState icon={<Package className="w-8 h-8" />} title="No listings yet" message="Create your first listing to start receiving buyer requests." />
            </Card>
          ) : (
            <div className="space-y-3">
              {listings.map(l => (
                <Card key={l.id} className="p-4" hover>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{l.crop_name}</h3>
                      <p className="text-xs text-gray-500">{l.quantity} {l.unit} · Grade {l.quality_grade} · {l.location}</p>
                    </div>
                    <Badge variant={l.status === 'sold' ? 'green' : l.status === 'buyer_interested' ? 'amber' : 'blue'}>
                      {l.status === 'buyer_interested' ? 'Buyer Interested' : l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-green-700">{formatCurrency(l.expected_price)}/{l.unit}</p>
                    {l.harvest_date && <p className="text-xs text-gray-400">Harvest: {formatDate(l.harvest_date)}</p>}
                  </div>
                  {l.description && <p className="text-xs text-gray-500 mt-2">{l.description}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
