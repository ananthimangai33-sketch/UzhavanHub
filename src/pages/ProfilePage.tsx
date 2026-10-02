import { useState } from 'react';
import { User, MapPin, Mail, Phone, Sprout, Building2, LogOut, Settings } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

export function ProfilePage() {
  const { profile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    district: profile?.district || '',
  });

  const saveProfile = async () => {
    const { error } = await supabase.from('profiles').update({
      name: form.name,
      phone: form.phone,
      location: form.location,
      district: form.district,
    }).eq('id', profile?.id);
    if (error) {
      toast('error', 'Update failed', error.message);
    } else {
      await refreshProfile();
      toast('success', 'Profile updated', 'Your changes have been saved.');
      setEditing(false);
    }
  };

  if (!profile) return null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="p-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-3xl mx-auto mb-4">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <Badge variant="green" className="mt-2 capitalize">{profile.role}</Badge>
          <p className="text-xs text-gray-400 mt-3">Member since {formatDate(profile.created_at)}</p>
          <Button variant="danger" className="mt-4 w-full" onClick={() => signOut()}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
              <Button variant={editing ? 'ghost' : 'secondary'} size="sm" onClick={() => setEditing(!editing)}>
                <Settings className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <Input label="Full Name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
                <Input label="Phone" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
                <Input label="Location" value={form.location} onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))} />
                <Input label="District" value={form.district} onChange={(e) => setForm(p => ({ ...p, district: e.target.value }))} />
                <Button onClick={saveProfile}>Save Changes</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{profile.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{profile.location || 'Not set'} · {profile.district || ''} · {profile.state || 'Tamil Nadu'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  {profile.role === 'farmer' ? <Sprout className="w-5 h-5 text-gray-400" /> : <Building2 className="w-5 h-5 text-gray-400" />}
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="font-medium text-gray-900 capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
