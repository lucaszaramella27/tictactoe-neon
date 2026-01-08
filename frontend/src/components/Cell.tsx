import type { Symbol } from "../utils/types";

export function Cell({
  value,
  onClick,
  disabled,
  index
}: {
  value: Symbol | null;
  onClick: () => void;
  disabled: boolean;
  index: number;
}) {
  const glow =
    value === "X"
      ? "text-cyan-300 drop-shadow-[0_0_22px_rgba(34,211,238,.55)]"
      : value === "O"
      ? "text-pink-300 drop-shadow-[0_0_22px_rgba(236,72,153,.45)]"
      : "text-white/60";

  return (
    <button
      className={
        "focus-ring glass neon-outline rounded-2xl h-20 w-20 sm:h-24 sm:w-24 " +
        "grid place-items-center text-4xl font-black " +
        "transition duration-200 hover:scale-[1.02] active:scale-[0.99]"
      }
      aria-label={`Célula ${index + 1}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <span className={glow}>{value ?? "·"}</span>
    </button>
  );
}
