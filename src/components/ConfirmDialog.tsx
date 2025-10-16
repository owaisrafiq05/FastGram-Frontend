'use client';

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[420px] max-w-[95vw] bg-[#1e1e1e] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h4 className="text-white font-semibold">{title}</h4>
        </div>
        <div className="px-5 py-4 text-sm text-gray-300">
          {message}
        </div>
        <div className="px-5 py-3 border-t border-gray-800 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-md text-sm bg-gray-800 hover:bg-gray-700 text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-md text-sm bg-red-600 hover:bg-red-500 text-white font-semibold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
