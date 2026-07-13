import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Calendar, MapPin, Users, Compass } from 'lucide-react';
import Button from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = (score: number) => {
    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Moderate';
    return 'Strong';
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        full_name: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const passwordScore = passwordStrength(formData.password);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      <div className="lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-700 flex items-center justify-center p-8">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8 text-white">
            <Compass size={40} className="text-indigo-300" />
            <span className="text-3xl font-bold">TripForge</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Create Your Account
          </h1>

          <p className="text-lg text-indigo-100/90 mb-8">
            Start planning your next adventure with us
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-indigo-100/90">
              <Calendar size={24} className="mt-1 text-indigo-300" />
              <span className="text-lg">Plan Your Entire Journey</span>
            </div>
            <div className="flex items-start gap-3 text-indigo-100/90">
              <MapPin size={24} className="mt-1 text-indigo-300" />
              <span className="text-lg">Track All Your Expenses</span>
            </div>
            <div className="flex items-start gap-3 text-indigo-100/90">
              <Users size={24} className="mt-1 text-indigo-300" />
              <span className="text-lg">Share With Travel Companions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-2/5 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-slate-400 mb-8">Start planning your next adventure</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400" size={18} />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-slate-600 hover:border-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400" size={18} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Choose a username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-slate-600 hover:border-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-slate-600 hover:border-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-slate-600 hover:border-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8-3.582-8-8a9.96 9.96 0 011.723-5.647" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.382 14.382l3.264 3.264m-3.264-3.264l-3.264-3.264m-3.264 3.264l-3.264 3.264m3.264-3.264l3.264 3.264" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-slate-400">Strength:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            i <= passwordScore ? getStrengthColor(passwordScore) : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-medium ml-2 ${
                      passwordScore <= 1 ? 'text-red-500' :
                      passwordScore <= 3 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {getStrengthLabel(passwordScore)}
                    </span>
                  </div>

                  <ul className="space-y-1 text-xs">
                    <li className={`flex items-center gap-2 ${
                      formData.password.length >= 8 ? 'text-emerald-500' : 'text-slate-500'
                    }`}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                        {formData.password.length >= 8 && '✓'}
                      </span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${
                      /[A-Z]/.test(formData.password) ? 'text-emerald-500' : 'text-slate-500'
                    }`}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                        {/[A-Z]/.test(formData.password) && '✓'}
                      </span>
                      One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${
                      /[a-z]/.test(formData.password) ? 'text-emerald-500' : 'text-slate-500'
                    }`}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                        {/[a-z]/.test(formData.password) && '✓'}
                      </span>
                      One lowercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${
                      /[0-9]/.test(formData.password) ? 'text-emerald-500' : 'text-slate-500'
                    }`}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                        {/[0-9]/.test(formData.password) && '✓'}
                      </span>
                      One number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-lg border bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-slate-600 hover:border-slate-500"
                required
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 w-4 h-4"
                required
              />
              <span className="text-sm text-slate-300">
                I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
              </span>
            </label>

            <Button type="submit" className="w-full" disabled={!acceptedTerms} isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center mt-6 text-slate-300">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
