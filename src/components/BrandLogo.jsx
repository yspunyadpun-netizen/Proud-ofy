import { Link } from "react-router-dom";

export default function BrandLogo({ size = 40, showText = true, light = false, to }) {
  const mark = (
    <span
      className="grid place-items-center rounded-2xl bg-gradient-to-br from-[#12B268] to-[#0B7A45] text-white shadow-[0_8px_24px_-8px_rgba(15,157,88,0.7)]"
      style={{ width: size, height: size }}
    >
      <span className="font-heading font-black tracking-tight" style={{ fontSize: size * 0.34 }}>
        IPY
      </span>
    </span>
  );

  const content = (
    <span className="flex items-center gap-3">
      {mark}
      {showText && (
        <span className="flex flex-col leading-tight">
          <span className={`font-heading text-[15px] font-extrabold tracking-wide ${light ? "text-white" : "text-[#0C2A1D]"}`}>
            I PROUD OF YOU
          </span>
          <span className={`text-[11px] ${light ? "text-white/60" : "text-[#0C2A1D]/45"}`}>
            مدربك الذكي للتغذية واللياقة
          </span>
        </span>
      )}
    </span>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return content;
}