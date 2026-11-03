import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.resetPassword({ resetToken, newPassword });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "تعذر تعيين كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="رابط غير صالح"
        subtitle="رابط إعادة التعيين مفقود أو منتهي"
        footer={
          <Link to="/forgot-password" className="font-bold text-[#0F9D58] hover:underline">
            اطلب رابطاً جديداً
          </Link>
        }
      >
        <p className="text-center text-[13px] leading-relaxed text-[#0C2A1D]/70">
          الرابط الذي استخدمته غير مكتمل. يرجى طلب رسالة إعادة تعيين جديدة.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout icon={Lock} title="كلمة مرور جديدة" subtitle="أدخل كلمة المرور الجديدة">
      {error && (
        <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-[13px] text-destructive">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور الجديدة</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          className="h-12 w-full rounded-xl bg-[#0F9D58] font-bold hover:bg-[#0C8650]"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جارٍ التعيين...
            </>
          ) : (
            "تعيين كلمة المرور"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}