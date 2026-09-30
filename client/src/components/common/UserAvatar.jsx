// src/components/common/UserAvatar.jsx
export function UserAvatar({ user, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const name = user?.name || 'User';
  const initial = name[0]?.toUpperCase() || 'U';
  const isVerified = user?.isEmailVerified ?? true;

  // Generate a deterministic gradient color based on user name
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
  ];
  const charCodeSum = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const selectedGradient = gradients[charCodeSum % gradients.length];

  return (
    <div className={`relative inline-flex shrink-0 items-center justify-center select-none ${className}`}>
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={name}
          className={`rounded-full object-cover neu-flat ${sizeClasses[size]}`}
        />
      ) : (
        <div
          className={`rounded-full flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-br ${selectedGradient} ${sizeClasses[size]}`}
        >
          {initial}
        </div>
      )}

      {/* Verified Email Badge */}
      {isVerified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
          style={{ borderColor: 'var(--neu-surface)' }}
          title="Email Verified"
        >
          ✓
        </span>
      )}
    </div>
  );
}
