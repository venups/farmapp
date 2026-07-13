import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Compass, Calendar, DollarSign, Users, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
      toast.success('Welcome back!');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flex: '0 0 60%', background: 'linear-gradient(135deg, #6366F1, #EC4899, #8B5CF6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Compass size={40} style={{ color: 'white' }} />
            <span style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>TripForge</span>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 32 }}>Forge Your Perfect Journey</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <Calendar size={20} />, text: 'Plan Every Detail' },
              { icon: <DollarSign size={20} />, text: 'Track Expenses' },
              { icon: <Users size={20} />, text: 'Share With Friends' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', animation: 'pulse 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', animation: 'pulse 5s ease-in-out infinite 1s' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>Sign in to continue planning your adventures</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required prefix={<Mail size={16} />} placeholder="you@example.com" />
            <div>
              <Input label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required prefix={<Lock size={16} />} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: 36, background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', zIndex: 1 }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button type="submit" fullWidth isLoading={isLoading}>Sign In</Button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
