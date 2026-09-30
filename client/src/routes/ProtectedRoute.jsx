// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Renders children/outlet only for authenticated users with an allowed role.
 * Redirects to /login if not authenticated.
 * Renders a 403 message if authenticated but unauthorized.
 */
export function ProtectedRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--neu-bg)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-primary)' }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-main" style={{ background: 'var(--neu-bg)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500">403</h1>
          <p className="mt-2 text-subtle">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
