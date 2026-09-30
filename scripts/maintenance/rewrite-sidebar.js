const fs = require('fs');
const path = 'client/src/components/layout/Sidebar.jsx';

const content = import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { ThemeSwitcher } from '../../../common/ThemeSwitcher.jsx';
import { Logo } from '../../../common/Logo.jsx';
import { UserAvatar } from '../../../common/UserAvatar.jsx';
import { cn } from '../../../../utils/cn.js';
import { useDataSource } from '../../../../context/DataSourceContext.jsx';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',     icon: '🌍', roles: ['admin', 'operator', 'viewer'] },
  { to: '/monitoring',   label: 'Live Monitor',  icon: '📡', roles: ['admin', 'operator', 'viewer'] },
  { to: '/tracking',     label: 'Flight Track',  icon: '🗺️', roles: ['admin', 'operator', 'viewer'] },
  { to: '/observations', label: 'Observations',  icon: '🗂️',  roles: ['admin', 'operator', 'viewer'] },
  { to: '/collections',  label: 'Data Collect',  icon: '⚡',  roles: ['admin', 'operator'] },
  { to: '/users',        label: 'Users',         icon: '👥',  roles: ['admin'] },
  { to: '/audit-logs',   label: 'Audit Logs',    icon: '🔍',  roles: ['admin'] },
];

export function Sidebar({ onOpenAlerts, unreadAlerts, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { dataSourceMode, setDataSourceMode } = useDataSource();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={\ixed inset-y-0 left-0 z-[1000] h-screen w-64 shrink-0 p-4 flex flex-col justify-between select-none transition-transform duration-300 md:relative md:translate-x-0 \\}
        style={{ background: 'var(--neu-surface)', boxShadow: '4px 0 20px var(--neu-shadow-dark)' }}
        aria-label="Main navigation"
      >
        {/* Fixed Header / Brand Logo Component */}
        <div className="neu-flat p-3.5 shrink-0 flex items-center justify-center relative">
          <Logo size="medium" showText={true} />
          <button onClick={onClose} className="absolute right-3 top-3 text-subtle md:hidden hover:text-main font-bold">X</button>
        </div>

      {/* Current Data Mode Indicator */}
      <div className="mt-4 mb-2 flex justify-center">
        <div className="neu-pressed px-4 py-1.5 rounded-full flex items-center gap-2" title={\Currently viewing \ data\}>
          <span className="text-[10px] uppercase font-bold tracking-widest text-subtle">Mode</span>
          <span className="text-subtle text-[10px]">•</span>
          {dataSourceMode === 'instrument' ? (
            <span className="text-xs font-bold text-emerald-500">🔌 LIVE</span>
          ) : (
            <span className="text-xs font-bold text-amber-500">🧪 DUMMY</span>
          )}
        </div>
      </div>

      {/* Scrollable Navigation Items */}
      <nav className="flex-1 flex flex-col gap-1 mb-3 overflow-y-auto min-h-0 pr-1">
        {visibleItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn('nav-item', isActive && 'active')}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}

        <button onClick={onOpenAlerts} className="nav-item flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔔</span>
            <span>Alerts</span>
          </div>
          {unreadAlerts > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{unreadAlerts}</span>}
        </button>
      </nav>

      {/* Fixed Bottom Controls: Theme Switcher + User Info */}
      <div className="shrink-0 flex flex-col gap-3">

        <ThemeSwitcher />

        <div className="neu-pressed p-3">
          <div className="flex items-center gap-3 mb-2.5">
            <UserAvatar user={user} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-main">{user?.name}</p>
              <p className="text-subtle text-[11px] truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full neu-button py-2 text-subtle hover:text-red-400 text-xs font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
\;

fs.writeFileSync(path, content, 'utf8');
