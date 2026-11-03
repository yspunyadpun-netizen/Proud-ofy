import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  UtensilsCrossed,
  TrendingUp,
  ClipboardList,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import BrandLogo from "@/components/BrandLogo";
import useProfile from "@/hooks/useProfile";

const SIDEBAR_NAV = [
  { to: "/dashboard", label: "الرئيسية", icon: Home },
  { to: "/meals", label: "وجباتي", icon: UtensilsCrossed },
  { to: "/progress", label: "تقدمي", icon: TrendingUp },
  { to: "/report", label: "التقرير الأسبوعي", icon: ClipboardList },
  { to: "/coach", label: "المدرب الذكي", icon: MessageCircle },
];

const BOTTOM_NAV = SIDEBAR_NAV;

export default function AppLayout() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (!loading && !profile?.onboarding_complete) {
      navigate("/onboarding", { replace: true });
    }
  }, [loading, profile, navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-[#F4F7F5]">
        <div className="w-9 h-9 rounded-full border-[3px] border-[#0F9D58]/20 border-t-[#0F9D58] animate-spin" />
      </div>
    );
  }

  if (!profile?.onboarding_complete) return null;

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#0C2A1D]" dir="rtl">
      <aside className="hidden lg:flex fixed top-0 bottom-0 right-0 w-64 flex-col border-l border-black/5 bg-white/70 backdrop-blur-xl px-5 py-7">
        <BrandLogo to="/dashboard" />
        <nav className="mt-9 flex flex-col gap-1">
          {SIDEBAR_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#0F9D58] text-white shadow-[0_10px_24px_-12px_rgba(15,157,88,0.9)]"
                    : "text-[#0C2A1D]/60 hover:bg-[#0F9D58]/8 hover:text-[#0F9D58]"
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => base44.auth.logout()}
          className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0C2A1D]/45 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2.1} />
          تسجيل الخروج
        </button>
      </aside>

      <main className="lg:mr-64">
        <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-5 lg:px-8 lg:pb-14 lg:pt-10">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <BrandLogo size={34} />
            <button
              onClick={() => base44.auth.logout()}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0C2A1D]/45 shadow-sm"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-black/5 bg-white/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-2">
          {BOTTOM_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-bold transition-colors ${
                  isActive ? "text-[#0F9D58]" : "text-[#0C2A1D]/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid h-9 w-9 place-items-center rounded-xl transition ${isActive ? "bg-[#0F9D58]/12" : ""}`}>
                    <Icon className="h-[19px] w-[19px]" strokeWidth={2.1} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}