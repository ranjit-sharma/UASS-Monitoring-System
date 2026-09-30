const fs = require('fs');
let content = fs.readFileSync('client/src/views/LoginPage.jsx', 'utf8');

const regex = /<form onSubmit=\{handleSubmit\(onSubmit\)\} noValidate className="space-y-5">[\s\S]*?<\/form>/;

const newForm = <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
          </form>;

content = content.replace(regex, newForm);
fs.writeFileSync('client/src/views/LoginPage.jsx', content, 'utf8');
