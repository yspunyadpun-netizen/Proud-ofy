import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // Always show success regardless
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="استعادة كلمة المرور"
      subtitle="سنرسل لك رابطاً لإعادة التعيين"
      footer={
        <Link to="/login" className="font-bold text-[#0F9D58] hover:underline">
          <ArrowRight className="ml-1 inline h-3 w-3" />
          العودة لتسجيل الدخول
        </Link>
      }
    >
      {sent ? (
        <p className="text-center text-[13px] leading-relaxed text-[#0C2A1D]/70">
          إذا كان هناك حساب بهذا البريد، ستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور قريباً.
        </p>
      ) : (
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
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#0F9D58] font-bold hover:bg-[#0C8650]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جارٍ الإرسال...
              </>
            ) : (
              "إرسال رابط الاستعادة"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}