export default function AnalyzedItemRow({ item, calories, onChangeGrams }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2">
      <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#0C2A1D]">{item.name}</span>
      <span className="flex shrink-0 items-center gap-1 rounded-lg bg-[#F4F7F5] px-1.5 py-1">
        <input
          type="number"
          inputMode="numeric"
          min="0"
          value={item.grams ?? ""}
          onChange={(event) => onChangeGrams(event.target.value)}
          className="w-11 bg-transparent text-center text-[12px] font-bold text-[#0C2A1D] outline-none"
          aria-label={`وزن ${item.name} بالجرام`}
        />
        <span className="text-[10px] font-semibold text-[#0C2A1D]/35">جم</span>
      </span>
      <span className="w-14 shrink-0 text-left text-[11px] font-bold text-[#0C2A1D]/60">{calories} سعرة</span>
    </div>
  );
}