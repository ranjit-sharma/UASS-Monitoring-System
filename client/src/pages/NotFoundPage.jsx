// src/pages/NotFoundPage.jsx â€” MVC View Layer
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center text-center p-8 select-none"
      style={{ background: 'var(--neu-bg)' }}
    >
      <div>
        <div
          className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl neu-flat"
        >
          ðŸ›¸
        </div>
        <h1 className="text-8xl font-bold grad-text-primary">404</h1>
        <p className="text-main text-2xl font-semibold mt-4">Page not found</p>
        <p className="text-subtle mt-2">The page you're looking for doesn't exist.</p>
        <Link
          to="/dashboard"
          className="btn-accent inline-block mt-6 px-6 py-3 text-sm font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

