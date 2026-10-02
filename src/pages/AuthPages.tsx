import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase';

export function LoginPage() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast('error', 'Login Failed', error);
    } else {
      toast('success', 'Welcome back!', 'You have been logged in successfully.');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-green-800">UzhavanHub</span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1 text-sm">Login to access your dashboard</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@example.com"
              required
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              icon={<Lock className="w-4 h-4" />}
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-green-700 font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">Demo: Create an account or use any registered email.</p>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-700 font-semibold hover:underline">Register here</Link>
          </p>
        </div>

        <Link to="/" className="flex items-center justify-center gap-1 mt-6 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', location: '', district: '', state: 'Tamil Nadu', mainCrop: '', businessName: '', requiredCrops: ''
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(form.email, form.password, {
      name: form.name,
      phone: form.phone,
      role,
      location: form.location,
      district: form.district,
      state: form.state,
      mainCrop: role === 'farmer' ? form.mainCrop : undefined,
      businessName: role === 'buyer' ? form.businessName : undefined,
      requiredCrops: role === 'buyer' ? form.requiredCrops : undefined,
    });
    setLoading(false);
    if (error) {
      toast('error', 'Registration Failed', error);
    } else {
      toast('success', 'Account Created!', 'Please check your email and login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] py-8 px-4">
      <div className="w-full max-w-lg mx-auto">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-green-800">UzhavanHub</span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join UzhavanHub as a farmer or buyer</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`p-3 rounded-xl border-2 text-center transition-all ${role === 'farmer' ? 'border-green-700 bg-green-50 text-green-800' : 'border-gray-200 text-gray-500'}`}
            >
              <Sprout className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm font-semibold">Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`p-3 rounded-xl border-2 text-center transition-all ${role === 'buyer' ? 'border-green-700 bg-green-50 text-green-800' : 'border-gray-200 text-gray-500'}`}
            >
              <span className="text-sm font-semibold">Buyer</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {role === 'farmer' ? (
              <Input label="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="e.g. Ramesh Kumar" />
            ) : (
              <>
                <Input label="Business Name" value={form.businessName} onChange={(e) => update('businessName', e.target.value)} required placeholder="e.g. ABC Vegetables Pvt Ltd" />
                <Input label="Contact Person Name" value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="e.g. Rajesh Kumar" />
              </>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Mobile Number" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required placeholder="98765 43210" />
              <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required placeholder="you@example.com" />
            </div>
            <Input label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required placeholder="Min 6 characters" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Location" value={form.location} onChange={(e) => update('location', e.target.value)} required placeholder="e.g. Coimbatore" />
              <Input label="District" value={form.district} onChange={(e) => update('district', e.target.value)} required placeholder="e.g. Coimbatore" />
            </div>
            {role === 'farmer' ? (
              <Input label="Main Crop" value={form.mainCrop} onChange={(e) => update('mainCrop', e.target.value)} placeholder="e.g. Tomato" />
            ) : (
              <Input label="Required Crops" value={form.requiredCrops} onChange={(e) => update('requiredCrops', e.target.value)} placeholder="e.g. Tomato, Onion, Potato" />
            )}
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      toast('error', 'Error', error.message);
    } else {
      toast('success', 'Reset Link Sent', 'Check your email for password reset instructions.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-green-800">UzhavanHub</span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-500 mt-1 text-sm">Enter your email to receive a reset link</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              icon={<Mail className="w-4 h-4" />}
            />
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <Link to="/login" className="flex items-center justify-center gap-1 mt-6 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
