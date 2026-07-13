import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Calendar, DollarSign, Users, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';
import type { RegisterData } from '@/types';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.met).length;
  const color = score <= 1 ? 'var(--color-error)' : score <= 2 ? 'var(--color-warning)' : score <= 3 ? '#FBBF24' : 'var(--color-success)';

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= score ? color : 'var(--color-border)', transition: 'background-color 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {checks.map((check, i) => (
          <span key={i} style={{ fontSize: 11, color: check.met ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
            {check.met ? '✓' : '○'} {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const data: RegisterData = { email, username, password, full_name: fullName };
      await register(data);
      navigate('/dashboard', { replace: true });
      toast.success('Account created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 32 }}>Start Your Journey</h2>
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
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>Start planning your next adventure</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required prefix={<User size={16} />} placeholder="John Doe" />
            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="johndoe" />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required prefix={<Mail size={16} />} placeholder="you@example.com" />
            <div>
              <Input label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required prefix={<Lock size={16} />} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: 36, background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', zIndex: 1 }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <PasswordStrength password={password} />
            </div>
            <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
            <Button type="submit" fullWidth isLoading={isLoading}>Create Account</Button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
