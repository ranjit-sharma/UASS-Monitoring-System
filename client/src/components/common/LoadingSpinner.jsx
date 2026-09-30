// src/components/common/LoadingSpinner.jsx
export function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" aria-label="Loading" />
    </div>
  );
}
