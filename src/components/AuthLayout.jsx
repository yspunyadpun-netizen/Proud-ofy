import React from "react";
import BrandLogo from "@/components/BrandLogo";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen bg-[#F4F7F5] px-4 py-10 text-[#0C2A1D]" dir="rtl">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        <div className="mb-7 mt-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F9D58]/10">
            <Icon className="h-6 w-6 text-[#0F9D58]" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-[26px] font-black tracking-tight text-[#0C2A1D]">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[13px] text-[#0C2A1D]/50">{subtitle}</p>}
        </div>

        <div className="rounded-[28px] border border-black/[0.03] bg-white p-6 shadow-[0_25px_60px_-40px_rgba(12,42,29,0.6)]">
          {children}
        </div>

        {footer && <div className="mt-5 text-center text-[13px] text-[#0C2A1D]/50">{footer}</div>}
      </div>
    </div>
  );
}