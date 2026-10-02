import { useEffect, useState } from 'react';
import { Sprout, TrendingUp, Calendar, Package } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, EmptyState, Button } from '@/components/ui';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { CropListing } from '@/lib/types';

export function MyCropsPage() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!profile) return;
      const { data } = await supabase.from('crop_listings').select('*').eq('farmer_id', profile.id).order('created_at', { ascending: false });
      setListings((data as CropListing[]) || []);
      setLoading(false);
    })();
  }, [profile]);

  const activeCount = listings.filter(l => l.status === 'active').length;
  const interestedCount = listings.filter(l => l.status === 'buyer_interested').length;
  const soldCount = listings.filter(l => l.status === 'sold').length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Crop Portfolio</h1>
        <p className="text-gray-500 mt-1">Track all your crop listings and their status</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{activeCount}</p><p className="text-xs text-gray-500 mt-1">Active</p></Card>
        <Card className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{interestedCount}</p><p className="text-xs text-gray-500 mt-1">Buyer Interested</p></Card>
        <Card className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{soldCount}</p><p className="text-xs text-gray-500 mt-1">Sold</p></Card>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : listings.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<Sprout className="w-8 h-8" />}
            title="No crops listed yet"
            message="Start listing your harvest to track your portfolio and connect with buyers."
            action={<Link to="/sell-crop"><Button size="sm"><Package className="w-4 h-4" /> List Your Crop</Button></Link>}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(l => (
            <Card key={l.id} className="p-5" hover>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-green-700" />
                </div>
                <Badge variant={l.status === 'sold' ? 'green' : l.status === 'buyer_interested' ? 'amber' : 'blue'}>
                  {l.status === 'buyer_interested' ? 'Buyer Interested' : l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                </Badge>
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{l.crop_name}</h3>
              <p className="text-sm text-gray-500">{l.quantity} {l.unit} · Grade {l.quality_grade}</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Expected Price</span>
                  <span className="font-semibold text-green-700">{formatCurrency(l.expected_price)}/{l.unit}</span>
                </div>
                {l.harvest_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Harvest</span>
                    <span className="font-medium text-gray-700">{formatDate(l.harvest_date)}</span>
                  </div>
                )}
                {l.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium text-gray-700">{l.location}</span>
                  </div>
                )}
              </div>
              {l.description && <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">{l.description}</p>}
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
