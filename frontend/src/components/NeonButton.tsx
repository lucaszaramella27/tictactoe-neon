import type { ButtonHTMLAttributes } from "react";

export function NeonButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={
        "focus-ring rounded-xl px-4 py-2 font-semibold text-white " +
        "bg-gradient-to-r from-cyan-500/70 to-indigo-500/70 " +
        "hover:from-cyan-400/80 hover:to-indigo-400/80 " +
        "transition duration-200 shadow-neon active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed " +
        className
      }
    />
  );
}
