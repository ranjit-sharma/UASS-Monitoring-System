import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ThemeSwitcher } from '../common/ThemeSwitcher.jsx';
import { Logo } from '../common/Logo.jsx';
import { UserAvatar } from '../common/UserAvatar.jsx';
import { cn } from '../../utils/cn.js';
import { useDataSource } from '../../context/DataSourceContext.jsx';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',     icon: String.fromCodePoint(0x1F30D), roles: ['admin', 'operator', 'viewer'] },
  { to: '/monitoring',   label: 'Live Monitor',  icon: String.fromCodePoint(0x1F4E1), roles: ['admin', 'operator', 'viewer'] },
  { to: '/tracking',     label: 'Flight Track',  icon: String.fromCodePoint(0x1F5FA, 0xFE0F), roles: ['admin', 'operator', 'viewer'] },
  { to: '/observations', label: 'Observations',  icon: String.fromCodePoint(0x1F5C2, 0xFE0F), roles: ['admin', 'operator', 'viewer'] },
  { to: '/collections',  label: 'Data Collect',  icon: String.fromCodePoint(0x26A1),  roles: ['admin', 'operator'] },
  { to: '/users',        label: 'Users',         icon: String.fromCodePoint(0x1F465),  roles: ['admin'] },
  { to: '/audit-logs',   label: 'Audit Logs',    icon: String.fromCodePoint(0x1F50D),  roles: ['admin'] },
];

export function Sidebar({ onOpenAlerts, unreadAlerts, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { dataSourceMode } = useDataSource();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter(item => !item.roles || item.roles.includes(user?.role));

  function handleLogout() { logout(); navigate('/login'); }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[999] md:hidden" 
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-[1000] h-screen w-64 shrink-0 p-4 flex flex-col justify-between select-none transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: 'var(--neu-bg)' }}
      >
        {/* Brand Area */}
        <div className="flex items-center justify-center pt-2 pb-4">
          <Logo size="medium" showText={true} />
        </div>

        {/* Header Controls: Mode + Theme */}
        <div className="mb-4 flex justify-center items-center gap-2">
          <div className="neu-pressed px-3 py-1.5 rounded-full flex items-center gap-2" title={`Currently viewing ${dataSourceMode} data`}>
            <span className="text-[10px] uppercase font-bold tracking-widest text-subtle">Mode</span>
            <span className="text-subtle text-[10px]">&bull;</span>
            {dataSourceMode === 'instrument' ? (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">🔌 LIVE</span>
            ) : (
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">🧪 DUMMY</span>
            )}
          </div>
          <div className="w-10 h-8"><ThemeSwitcher /></div>
        </div>

      {/* Scrollable Navigation Items */}
      <nav className="flex-1 flex flex-col gap-2 mb-3 overflow-y-auto min-h-0 pr-1 mt-2 no-scrollbar">
        {visibleItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-semibold text-sm', isActive ? 'shadow-md scale-[1.02]' : 'neu-flat text-subtle hover:text-main')} style={({ isActive }) => (isActive ? { background: 'var(--accent-primary)', color: 'var(--neu-bg)' } : {})}
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}

        <button onClick={onOpenAlerts} className="flex items-center justify-between px-3 py-2 rounded-xl transition-all font-semibold text-sm neu-flat text-subtle hover:text-main">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔔</span>
            <span>Alerts</span>
          </div>
          {unreadAlerts > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{unreadAlerts}</span>}
        </button>
      </nav>

      {/* Fixed Bottom Controls */}
      <div className="shrink-0 flex flex-col gap-3">
        <div className="neu-flat p-3 rounded-xl">
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

