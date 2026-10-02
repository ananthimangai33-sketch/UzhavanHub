import { useEffect, useState } from 'react';
import { Bell, Check, Trash2, TrendingUp, Users, Zap, Cloud, Package, Info, Settings } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Button, Badge, EmptyState } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { formatTime } from '@/lib/utils';
import type { Notification } from '@/lib/types';

const typeIcons: Record<string, typeof TrendingUp> = {
  price: TrendingUp,
  buyer: Users,
  demand: Zap,
  weather: Cloud,
  listing: Package,
  info: Info,
};

const typeColors: Record<string, string> = {
  price: 'bg-green-100 text-green-700',
  buyer: 'bg-sky-100 text-sky-700',
  demand: 'bg-amber-100 text-amber-700',
  weather: 'bg-sky-100 text-sky-700',
  listing: 'bg-green-100 text-green-700',
  info: 'bg-gray-100 text-gray-600',
};

export function NotificationsPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrefs, setShowPrefs] = useState(false);

  useEffect(() => {
    (async () => {
      if (!profile) return;
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      setNotifications((data as Notification[]) || []);
      setLoading(false);
    })();
  }, [profile]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast('info', 'Notification deleted');
  };

  const markAllRead = async () => {
    if (!profile) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id).eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast('success', 'All marked as read');
  };

  const seedDemoNotifications = async () => {
    if (!profile) return;
    const demos = [
      { title: 'Tomato price increased', message: 'Tomato price increased by ₹3/kg in Coimbatore Market.', type: 'price' },
      { title: 'New buyer request', message: 'ABC Vegetables Pvt Ltd is looking for 500 kg of tomatoes near you.', type: 'buyer' },
      { title: 'High demand detected', message: 'High demand detected for onion in Coimbatore. Demand up by 12%.', type: 'demand' },
      { title: 'Weather alert', message: 'Heavy rain expected tomorrow in Coimbatore. Consider harvesting today.', type: 'weather' },
      { title: 'Buyer interested', message: 'Your tomato listing received a buyer request from Fresh Foods Export Co.', type: 'listing' },
    ];
    for (const d of demos) {
      await supabase.from('notifications').insert({
        user_id: profile.id,
        title: d.title,
        message: d.message,
        type: d.type,
      });
    }
    const { data } = await supabase.from('notifications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
    setNotifications((data as Notification[]) || []);
    toast('success', 'Demo notifications added');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">{unreadCount} unread of {notifications.length} total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowPrefs(!showPrefs)}><Settings className="w-4 h-4" /> Preferences</Button>
          {notifications.length > 0 && <Button variant="secondary" size="sm" onClick={markAllRead}><Check className="w-4 h-4" /> Mark all read</Button>}
        </div>
      </div>

      {showPrefs && (
        <Card className="p-5 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Notification Preferences</h3>
          <div className="space-y-2">
            {['Price Alerts', 'Buyer Requests', 'Demand Alerts', 'Weather Alerts', 'Listing Updates'].map(p => (
              <label key={p} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 cursor-pointer">
                <span className="text-sm text-gray-700">{p}</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-green-700" />
              </label>
            ))}
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : notifications.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<Bell className="w-8 h-8" />}
            title="No notifications yet"
            message="You'll see price alerts, buyer requests, weather warnings, and demand updates here."
            action={<Button size="sm" onClick={seedDemoNotifications}>Load Demo Notifications</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const Icon = typeIcons[n.type] || Info;
            return (
              <Card key={n.id} className={`p-4 ${!n.is_read ? 'border-green-100 bg-green-50/30' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[n.type] || typeColors.info}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{n.title}</h3>
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTime(n.created_at)}</p>
                  </div>
                  <div className="flex gap-1">
                    {!n.is_read && (
                      <button onClick={() => markAsRead(n.id)} className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50" title="Mark as read">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
