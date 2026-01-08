import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean; // default true
  closeOnEsc?: boolean; // default true
  className?: string;
};

export function Modal({
  open,
  title,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = "",
}: ModalProps) {
  // ESC fecha
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeOnEsc, onClose]);

  // trava scroll do body
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-black/60 cursor-default"
        onClick={() => {
          if (closeOnBackdrop) onClose();
        }}
      />

      {/* card */}
      <div
        className={`relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-2xl backdrop-blur ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-white text-lg font-semibold">{title}</h2>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
