const fs = require('fs');

const fileContent = 
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useDataSource } from '../../../context/DataSourceContext.jsx';
import { Logo } from '../../../components/common/Logo.jsx';
import toast from 'react-hot-toast';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  password: z.string().min(1, 'Password is required').max(128),
});

export function LoginPage() {
  const { login } = useAuth();
  const { dataSourceMode, setDataSourceMode } = useDataSource();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    setLoginError('');
    try {
      await login(data);
      toast.success('Successfully logged in!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password');
      toast.error(err.message || 'Login failed');
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden"
      style={{ background: 'var(--neu-bg)' }}
    >
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-500 opacity-10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl neu-flat flex flex-col md:flex-row overflow-hidden relative z-10 border-0" style={{ padding: 0 }}>
        
        <div 
          className="hidden md:flex md:w-5/12 p-10 flex-col justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}
        >
          <div className="relative z-10 text-white drop-shadow-lg">
            <Logo size="large" showText={false} />
            <h1 className="text-4xl font-extrabold mt-6 leading-tight tracking-tight text-white">
              Mission<br />Control
            </h1>
            <p className="mt-4 text-emerald-400 text-sm font-bold tracking-wide">
              Upper Air Sounding System
            </p>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Welcome to the central command hub. This advanced telemetry suite provides real-time atmospheric tracking, live environmental payload monitoring, and historical flight data analysis all in one seamless interface.
            </p>
          </div>
          
          <div className="relative z-10 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-12 flex items-center gap-2">
            Secure Access Portal <span>•</span> v2.4.0
          </div>
          
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -left-12 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl"></div>
        </div>

        <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-[var(--neu-surface)]">
          
          <div className="md:hidden flex flex-col items-center text-center mb-8">
            <Logo size="medium" showText={false} />
            <h1 className="text-2xl font-extrabold grad-text-primary mt-4 tracking-tight">Mission Control</h1>
            <p className="text-subtle text-xs mt-1">Upper Air Sounding System</p>
          </div>

          <div className="mb-8">
            <h2 className="text-main text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-subtle text-sm mt-1">Please enter your credentials to access the system.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {loginError && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-xl flex items-center gap-3 text-sm font-semibold border border-red-500/20">
                <AlertCircle size={18} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[11px] text-subtle uppercase tracking-wider mb-2 font-bold">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="neu-pressed w-full px-4 py-3.5 text-main text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
                placeholder="admin@uass.local"
              />
              {errors.email && (
                <p className="mt-1.5 text-red-500 text-xs font-semibold">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] text-subtle uppercase tracking-wider mb-2 font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className="neu-pressed w-full px-4 py-3.5 pr-12 text-main text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-main"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-red-500 text-xs font-semibold">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] text-subtle uppercase tracking-wider mb-2 font-bold">
                Initial Data Source Mode
              </label>
              <div className="flex gap-2 bg-[var(--neu-surface-raised)] p-1.5 rounded-xl border border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setDataSourceMode('instrument')}
                  className={\lex-1 py-2 text-xs font-bold rounded-lg transition-all \\}
                >
                  🔌 Live Mode
                </button>
                <button
                  type="button"
                  onClick={() => setDataSourceMode('simulated')}
                  className={\lex-1 py-2 text-xs font-bold rounded-lg transition-all \\}
                >
                  🧪 Dummy Data
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="neu-button w-full py-3.5 mt-6 text-sm font-bold text-white dark-active-text border-none rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--accent-primary)]/30"
              style={{ background: 'var(--accent-primary)' }}
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
;

fs.writeFileSync('client/src/views/LoginPage.jsx', fileContent, 'utf8');
