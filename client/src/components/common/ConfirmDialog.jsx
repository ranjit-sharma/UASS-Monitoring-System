// src/components/common/ConfirmDialog.jsx
export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="neu-flat rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-[var(--border-subtle)] relative overflow-hidden">
        {/* Subtle top border accent */}
        <div className={`absolute top-0 left-0 w-full h-1 ${danger ? 'bg-red-500' : 'bg-emerald-500'}`}></div>

        <h2 className="text-main font-bold text-lg mt-1">{title}</h2>
        <p className="text-subtle text-sm mt-2">{message}</p>
        
        <div className="mt-8 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="neu-button px-5 py-2 text-sm text-subtle font-semibold hover:text-main transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-sm rounded-xl font-bold transition-all hover:scale-105 shadow-md ${
              danger
                ? 'text-white'
                : 'text-white'
            }`}
            style={{ background: danger ? 'linear-gradient(135deg, #ff6b6b, #fa5252)' : 'linear-gradient(135deg, #51cf66, #40c057)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
