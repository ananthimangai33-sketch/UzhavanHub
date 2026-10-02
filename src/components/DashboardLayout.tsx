import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Store, Package, Users, Cloud, Bell,
  Calculator, Mic, LogOut, Menu, X, Sprout, Scale, Award, MapPin,
  ShoppingCart, MessageSquare, Search, Shield, Home, User, BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const farmerNav: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
  { label: 'Price Discovery', icon: <TrendingUp className="w-5 h-5" />, path: '/price-discovery' },
  { label: 'Compare Markets', icon: <Scale className="w-5 h-5" />, path: '/compare-markets' },
  { label: 'Sell Your Crop', icon: <Package className="w-5 h-5" />, path: '/sell-crop' },
  { label: 'My Crops', icon: <Sprout className="w-5 h-5" />, path: '/my-crops' },
  { label: 'Find Buyers', icon: <Users className="w-5 h-5" />, path: '/find-buyers' },
  { label: 'Chat', icon: <MessageSquare className="w-5 h-5" />, path: '/chat' },
  { label: 'Price Prediction', icon: <BarChart3 className="w-5 h-5" />, path: '/price-prediction' },
  { label: 'Demand Alerts', icon: <TrendingUp className="w-5 h-5" />, path: '/demand-alerts' },
  { label: 'Weather Alerts', icon: <Cloud className="w-5 h-5" />, path: '/weather' },
  { label: 'Nearby Markets', icon: <MapPin className="w-5 h-5" />, path: '/nearby-markets' },
  { label: 'Quality Guide', icon: <Award className="w-5 h-5" />, path: '/quality-guide' },
  { label: 'Transport Cost', icon: <ShoppingCart className="w-5 h-5" />, path: '/transport' },
  { label: 'Profit Calculator', icon: <Calculator className="w-5 h-5" />, path: '/profit-calculator' },
  { label: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/notifications' },
];

const buyerNav: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/buyer-dashboard' },
  { label: 'Search Crops', icon: <Search className="w-5 h-5" />, path: '/buyer-crops' },
  { label: 'Farmer Listings', icon: <Package className="w-5 h-5" />, path: '/buyer-listings' },
  { label: 'My Requests', icon: <ShoppingCart className="w-5 h-5" />, path: '/buyer-requests' },
  { label: 'Chat', icon: <MessageSquare className="w-5 h-5" />, path: '/chat' },
  { label: 'Price Discovery', icon: <TrendingUp className="w-5 h-5" />, path: '/price-discovery' },
  { label: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/notifications' },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin-dashboard' },
  { label: 'Farmers', icon: <Sprout className="w-5 h-5" />, path: '/admin-farmers' },
  { label: 'Buyers', icon: <Users className="w-5 h-5" />, path: '/admin-buyers' },
  { label: 'Listings', icon: <Package className="w-5 h-5" />, path: '/admin-listings' },
  { label: 'Market Prices', icon: <Store className="w-5 h-5" />, path: '/admin-prices' },
  { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/admin-analytics' },
];

const mobileBottomNav: NavItem[] = [
  { label: 'Home', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
  { label: 'Markets', icon: <Store className="w-5 h-5" />, path: '/price-discovery' },
  { label: 'Sell', icon: <Package className="w-5 h-5" />, path: '/sell-crop' },
  { label: 'Buyers', icon: <Users className="w-5 h-5" />, path: '/find-buyers' },
  { label: 'Profile', icon: <User className="w-5 h-5" />, path: '/profile' },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = profile?.role === 'admin' ? adminNav : profile?.role === 'buyer' ? buyerNav : farmerNav;
  const bottomNav = profile?.role === 'buyer'
    ? mobileBottomNav.map(n => n.path === '/dashboard' ? { ...n, path: '/buyer-dashboard' } : n)
    : profile?.role === 'admin'
    ? mobileBottomNav.map(n => n.path === '/dashboard' ? { ...n, path: '/admin-dashboard' } : n)
    : mobileBottomNav;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F7FAF5]">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-40 flex items-center px-4 lg:px-6">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-green-800">UzhavanHub</span>
            <p className="text-[10px] text-gray-500 -mt-0.5">Smart Farmer Platform</p>
          </div>
        </Link>
        <div className="flex-1" />
        <Link to="/voice-assistant" className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors" title="Uzhavan Voice">
          <Mic className="w-5 h-5" />
        </Link>
        <Link to="/notifications" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Link>
        <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{profile?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <button onClick={() => { signOut(); navigate('/'); }} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Logout">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 transform transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-green-800">UzhavanHub</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 overflow-y-auto h-[calc(100%-4rem)]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5',
                isActive(item.path)
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          {profile?.role !== 'admin' && (
            <Link
              to="/demo-mode"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all mt-2"
            >
              <Shield className="w-5 h-5" />
              <span>Demo Mode</span>
            </Link>
          )}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 pb-20 lg:pb-8 min-h-screen">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 z-40 flex items-center justify-around lg:hidden">
        {bottomNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors',
              isActive(item.path) ? 'text-green-700' : 'text-gray-500'
            )}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
