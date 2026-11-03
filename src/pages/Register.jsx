import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "تعذر إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "رمز التحقق غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({
        title: "تم إرسال الرمز",
        description: "تحقق من بريدك الإلكتروني للحصول على الرمز الجديد.",
      });
    } catch (err) {
      setError(err.message || "تعذر إعادة إرسال الرمز");
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", safeReturnTo());
  };

  if (showOtp) {
    return (
      <AuthLayout icon={Mail} title="تحقق من بريدك" subtitle={`أرسلنا رمزاً إلى ${email}`}>
        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-[13px] text-destructive">{error}</div>
        )}
        <div className="mb-6 flex justify-center">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup dir="ltr">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="h-12 w-full rounded-xl bg-[#0F9D58] font-bold hover:bg-[#0C8650]"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جارٍ التحقق...
            </>
          ) : (
            "تحقق"
          )}
        </Button>
        <p className="mt-4 text-center text-[12.5px] text-[#0C2A1D]/50">
          لم يصلك الرمز؟{" "}
          <button onClick={handleResend} className="font-bold text-[#0F9D58] hover:underline">
            إعادة الإرسال
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="أنشئ حسابك"
      subtitle="ابدأ رحلتك نحو جسم أفضل"
      footer={
        <>
          لديك حساب بالفعل؟{" "}
          <Link
            to={"/login" + (safeReturnTo() !== "/" ? "?returnTo=" + encodeURIComponent(safeReturnTo()) : "")}
            className="font-bold text-[#0F9D58] hover:underline"
          >
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <Button variant="outline" className="mb-6 h-12 w-full gap-2 rounded-xl text-sm font-semibold" onClick={handleGoogle}>
        <GoogleIcon className="h-5 w-5" />
        المتابعة بحساب Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[11px]">
          <span className="bg-white px-3 text-[#0C2A1D]/40">أو</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-[13px] text-destructive">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl pr-10"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl pr-10"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 rounded-xl pr-10"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-[#0F9D58] text-[14px] font-bold hover:bg-[#0C8650]"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جارٍ إنشاء الحساب...
            </>
          ) : (
            "إنشاء الحساب"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}