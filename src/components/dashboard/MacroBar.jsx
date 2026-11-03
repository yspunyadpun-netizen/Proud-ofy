export default function MacroBar({ label, value, target, barClass = "bg-[#0F9D58]" }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-[11px]">
        <span className="font-semibold text-[#0C2A1D]/50">{label}</span>
        <span className="font-heading font-bold text-[#0C2A1D]">
          {Math.round(value)}
          <span className="text-[#0C2A1D]/35"> / {Math.round(target)}جم</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#EEF3EF]">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}