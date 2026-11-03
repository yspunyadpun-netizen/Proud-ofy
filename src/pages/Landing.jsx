import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flame, Camera, Sparkles, TrendingUp, ArrowLeft, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import BrandLogo from "@/components/BrandLogo";
import { Image } from "@/components/ui/image";

const HERO_IMG =
  "https://media.base44.com/images/public/6ae7860a6c7f5d7e8051fbef/1dece3e2a_generated_image.png";

const FEATURES = [
  {
    icon: Flame,
    title: "احسب سعراتك بدقة",
    text: "أدخل وزنك وهدفك، ونحسب لك احتياجك اليومي من السعرات والماكروز فوراً.",
  },
  {
    icon: Camera,
    title: "صوّر طعامك",
    text: "التقط صورة لوجبتك والذكاء الاصطناعي يحلل الأطباق والكميات والسعرات.",
  },
  {
    icon: Sparkles,
    title: "اكتب وجبتك بجملة",
    text: "صف ما أكلته بالكلمات، ونحلل المكونات والسعرات مع إمكانية تعديل الأوزان قبل الحفظ.",
  },
  {
    icon: TrendingUp,
    title: "تابع تقدمك",
    text: "سجّل وزنك وماءك يومياً وشاهد رسم بياني يوضح رحلتك نحو هدفك.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth
      .isAuthenticated()
      .then((ok) => {
        if (ok) navigate("/dashboard", { replace: true });
      })
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#07130D] text-white" dir="rtl">
      <div className="relative overflow-hidden">
        <Image
          src={HERO_IMG}
          alt="صالة رياضية"
          fittingType="fill"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#07130D]/95 via-[#07130D]/80 to-[#07130D]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07130D] via-transparent to-[#07130D]/70" />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-7 lg:px-10">
          <div className="flex items-center justify-between">
            <BrandLogo light />
            <Link
              to="/login"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
            >
              تسجيل الدخول
            </Link>
          </div>

          <div className="mt-20 max-w-xl lg:mt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#12B268]/30 bg-[#12B268]/12 px-4 py-1.5 text-[11px] font-bold tracking-wide text-[#8BE8B6]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#12B268]" />
              مدربك الذكي للتغذية واللياقة
            </span>

            <h1 className="mt-6 font-heading text-[38px] font-black leading-[1.12] tracking-tight lg:text-[62px]">
              أنت تستحق أن تكون
              <br />
              <span className="bg-gradient-to-l from-[#3FE08E] to-[#0F9D58] bg-clip-text text-transparent">
                فخوراً بنفسك
              </span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65 lg:text-base">
              سعراتك، وجباتك، ماءك، ووزنك — كل شيء في مكان واحد. ابدأ اليوم ورحلتك نحو جسم أفضل تبدأ بخطوة واحدة.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F9D58] px-7 py-4 text-[15px] font-bold text-white shadow-[0_20px_40px_-18px_rgba(15,157,88,0.9)] transition hover:bg-[#0C8650]"
              >
                ابدأ الآن مجاناً
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                لدي حساب بالفعل
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/45">
              {["بدون بطاقة بنكية", "تحليل صور بالذكاء الاصطناعي", "واجهة عربية بالكامل"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#3FE08E]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-[#F4F7F5] px-5 py-16 text-[#0C2A1D] lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="font-heading text-[26px] font-black tracking-tight lg:text-[34px]">
            كل ما تحتاجه في تطبيق واحد
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#0C2A1D]/55">
            صُمم ليُستخدم يومياً في أقل من دقيقة: سجّل، تابع، وتقدم.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[26px] bg-white p-6 shadow-[0_20px_50px_-35px_rgba(12,42,29,0.6)] ring-1 ring-black/[0.03] transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0F9D58]/10 text-[#0F9D58]">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
                </span>
                <h3 className="mt-5 font-heading text-[16px] font-bold">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#0C2A1D]/55">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 overflow-hidden rounded-[30px] bg-gradient-to-l from-[#0B7A45] to-[#0F9D58] p-8 text-white lg:p-12">
            <h3 className="font-heading text-[24px] font-black leading-snug lg:text-[30px]">
              تقرير أسبوعي يخبرك بالحقيقة
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">
              متوسط سعراتك مقابل هدفك، متوسط الماء باللتر، وتغير وزنك — كل أسبوع في صفحة واحدة.
            </p>
            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#0B7A45] transition hover:bg-white/90"
            >
              ابدأ الآن
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-12 text-center text-[11px] text-[#0C2A1D]/35">
            I PROUD OF YOU — مدربك الذكي للتغذية واللياقة وبناء العضلات
          </p>
        </div>
      </div>
    </div>
  );
}