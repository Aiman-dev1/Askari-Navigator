import { FiAlertTriangle, FiX } from "react-icons/fi";

function DeleteConfirmModal({ isOpen, onConfirm, onCancel, title, message, previewLabel = "Target", previewText }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-600" />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
          aria-label="Close"
        >
          <FiX size={15} />
        </button>

        <div className="p-7">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
            <FiAlertTriangle size={26} className="text-red-500" />
          </div>

          {/* Heading */}
          <h3 className="text-xl font-serif font-bold text-slate-900 text-center uppercase tracking-wide mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 text-center mb-4 leading-relaxed">
            {message}
          </p>

          {/* Optional detail block */}
          {previewText && (
            <div className="bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">{previewLabel}</p>
              <p className="text-sm text-slate-700 font-semibold leading-snug line-clamp-2">
                {previewText}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-2.5 rounded-lg border border-gray-200 text-slate-700 text-sm font-semibold uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold uppercase tracking-wider transition-all shadow cursor-pointer hover:shadow-md"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
