export function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="neon-grid" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20 bg-cyan-400 animate-[floaty_6s_ease-in-out_infinite]" />
      <div className="absolute top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-20 bg-indigo-500 animate-[floaty_7s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-15 bg-pink-500 animate-[floaty_8s_ease-in-out_infinite]" />
    </div>
  );
}
