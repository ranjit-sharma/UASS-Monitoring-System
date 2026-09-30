// src/components/common/ErrorMessage.jsx
export function ErrorMessage({ message }) {
  return (
    <div className="rounded-lg bg-red-900/30 border border-red-700 p-4 text-red-300 text-sm">
      <strong>Error:</strong> {message}
    </div>
  );
}
