import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/pages/AuthPages';
import { FarmerDashboard } from '@/pages/FarmerDashboard';
import { PriceDiscoveryPage } from '@/pages/PriceDiscovery';
import { CompareMarketsPage } from '@/pages/CompareMarkets';
import { SellCropPage } from '@/pages/SellCrop';
import { FindBuyersPage } from '@/pages/FindBuyers';
import { ChatPage } from '@/pages/ChatPage';
import { MyCropsPage } from '@/pages/MyCrops';
import { PricePredictionPage } from '@/pages/PricePrediction';
import { DemandAlertsPage } from '@/pages/DemandAlerts';
import { WeatherPage } from '@/pages/WeatherAlerts';
import { QualityGuidePage } from '@/pages/QualityGuide';
import { NearbyMarketsPage } from '@/pages/NearbyMarkets';
import { TransportPage } from '@/pages/Transport';
import { ProfitCalculatorPage } from '@/pages/ProfitCalculator';
import { NotificationsPage } from '@/pages/Notifications';
import { VoiceAssistantPage } from '@/pages/VoiceAssistant';
import { DemoModePage } from '@/pages/DemoMode';
import { ProfilePage } from '@/pages/ProfilePage';
import {
  BuyerDashboard, BuyerCropsPage, BuyerListingsPage, BuyerRequestsPage
} from '@/pages/BuyerPages';
import {
  AdminDashboard, AdminFarmersPage, AdminBuyersPage, AdminListingsPage,
  AdminPricesPage, AdminAnalyticsPage
} from '@/pages/AdminPages';
import type { ReactNode } from 'react';

function ProtectedRoute({ children, role }: { children: ReactNode; role?: string }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FAF5]">
        <div className="w-8 h-8 border-3 border-green-200 border-t-green-700 rounded-full animate-spin" style={{ borderWidth: '3px' }} />
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  if (role && profile?.role !== role) return <Navigate to={profile?.role === 'admin' ? '/admin-dashboard' : profile?.role === 'buyer' ? '/buyer-dashboard' : '/dashboard'} replace />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Farmer routes */}
      <Route path="/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/price-discovery" element={<ProtectedRoute><PriceDiscoveryPage /></ProtectedRoute>} />
      <Route path="/compare-markets" element={<ProtectedRoute><CompareMarketsPage /></ProtectedRoute>} />
      <Route path="/sell-crop" element={<ProtectedRoute><SellCropPage /></ProtectedRoute>} />
      <Route path="/my-crops" element={<ProtectedRoute><MyCropsPage /></ProtectedRoute>} />
      <Route path="/find-buyers" element={<ProtectedRoute><FindBuyersPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/price-prediction" element={<ProtectedRoute><PricePredictionPage /></ProtectedRoute>} />
      <Route path="/demand-alerts" element={<ProtectedRoute><DemandAlertsPage /></ProtectedRoute>} />
      <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
      <Route path="/quality-guide" element={<ProtectedRoute><QualityGuidePage /></ProtectedRoute>} />
      <Route path="/nearby-markets" element={<ProtectedRoute><NearbyMarketsPage /></ProtectedRoute>} />
      <Route path="/transport" element={<ProtectedRoute><TransportPage /></ProtectedRoute>} />
      <Route path="/profit-calculator" element={<ProtectedRoute><ProfitCalculatorPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/voice-assistant" element={<ProtectedRoute><VoiceAssistantPage /></ProtectedRoute>} />
      <Route path="/demo-mode" element={<ProtectedRoute><DemoModePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Buyer routes */}
      <Route path="/buyer-dashboard" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
      <Route path="/buyer-crops" element={<ProtectedRoute><BuyerCropsPage /></ProtectedRoute>} />
      <Route path="/buyer-listings" element={<ProtectedRoute><BuyerListingsPage /></ProtectedRoute>} />
      <Route path="/buyer-requests" element={<ProtectedRoute><BuyerRequestsPage /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin-farmers" element={<ProtectedRoute><AdminFarmersPage /></ProtectedRoute>} />
      <Route path="/admin-buyers" element={<ProtectedRoute><AdminBuyersPage /></ProtectedRoute>} />
      <Route path="/admin-listings" element={<ProtectedRoute><AdminListingsPage /></ProtectedRoute>} />
      <Route path="/admin-prices" element={<ProtectedRoute><AdminPricesPage /></ProtectedRoute>} />
      <Route path="/admin-analytics" element={<ProtectedRoute><AdminAnalyticsPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
