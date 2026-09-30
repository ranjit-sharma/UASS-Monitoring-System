const fs = require('fs');
let sidebar = fs.readFileSync('client/src/components/layout/Sidebar.jsx', 'utf8');

sidebar = sidebar.replace(/\{\/\* Fixed Bottom Controls: Theme Switcher \+ User Info \*\/\}[\s\S]*?<\/aside>/, `{/* Fixed Bottom Controls */}
      <div className="shrink-0 flex flex-col gap-3">
        <ThemeSwitcher />
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
    </aside>`);
fs.writeFileSync('client/src/components/layout/Sidebar.jsx', sidebar, 'utf8');
