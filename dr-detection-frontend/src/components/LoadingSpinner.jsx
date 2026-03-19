export default function LoadingSpinner({ label = "Processing…" }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-t-brand-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-cyan-400 border-b-transparent border-l-transparent animate-spin [animation-direction:reverse] [animation-duration:0.6s]" />
      </div>
      <p className="text-slate-400 text-sm font-mono animate-pulse">{label}</p>
    </div>
  );
}