const fs = require('fs');

const loginPath = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(loginPath, 'utf8');

const newRender =   return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden"
      style={{ background: 'var(--neu-bg)' }}
    >
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[var(--accent-primary)] opacity-10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[var(--accent-secondary)] opacity-10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl neu-flat flex flex-col md:flex-row overflow-hidden relative z-10 border-0" style={{ padding: 0 }}>
        
        {/* Left Side: Brand Showcase */}
        <div 
          className="hidden md:flex md:w-5/12 p-10 flex-col justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
        >
          <div className="relative z-10 text-white drop-shadow-lg">
            <Logo size="large" showText={false} />
            <h1 className="text-4xl font-extrabold mt-6 leading-tight tracking-tight">
              Mission<br />Control
            </h1>
            <p className="mt-4 text-white/90 text-sm font-medium leading-relaxed">
              Upper Air Sounding System.<br/>
              Advanced Real-Time Telemetry & Environmental Monitoring.
            </p>
          </div>
          
          <div className="relative z-10 text-white/70 text-[10px] font-bold uppercase tracking-widest mt-12">
            Secure Access Portal • v2.4.0
          </div>
          
          {/* Subtle Decorative Elements */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/4 -left-12 w-48 h-48 bg-black/10 rounded-full blur-xl"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-[var(--neu-surface)]">
          
          {/* Mobile Header (Only visible on small screens) */}
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
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className="neu-pressed w-full px-4 py-3.5 text-main text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
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
              className="neu-button w-full py-3.5 mt-6 text-sm font-bold text-white bg-[var(--accent-primary)] border-none rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--accent-primary)]/30"
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

content = content.replace(/return \([\s\S]*\}\;/m, newRender);
fs.writeFileSync(loginPath, content, 'utf8');
