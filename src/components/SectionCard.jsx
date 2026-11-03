export default function SectionCard({ children, className = "" }) {
  return (
    <section className={`rounded-[26px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03] ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({ icon: Icon, title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0F9D58]/10 text-[#0F9D58]">
            <Icon className="h-4 w-4" strokeWidth={2.2} />
          </span>
        )}
        <h2 className="font-heading text-[15px] font-bold text-[#0C2A1D]">{title}</h2>
      </div>
      {action}
    </div>
  );
}