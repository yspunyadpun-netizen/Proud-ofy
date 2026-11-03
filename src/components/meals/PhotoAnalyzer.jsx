import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MealAnalysisResult from "@/components/meals/MealAnalysisResult";

export default function PhotoAnalyzer({ onAdd }) {
  const [preview, setPreview] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setPreview(null);
    setFileUri(null);
    setResult(null);
    setError("");
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setResult(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      setFileUri(file_uri);
      setUploading(false);
      setAnalyzing(true);
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({
        file_uri,
        expires_in: 600,
      });
      const response = await base44.functions.invoke("analyzeFood", { image_url: signed_url });
      if (response.data?.error) throw new Error(response.data.error);
      setResult({ ...response.data, file_uri });
    } catch (err) {
      setError(err.message || "تعذر تحليل الصورة، حاول مرة أخرى.");
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!preview && (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#0F9D58]/25 bg-[#0F9D58]/[0.04] px-4 py-10 text-center transition hover:border-[#0F9D58]/50 hover:bg-[#0F9D58]/[0.07]">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0F9D58] text-white shadow-[0_16px_30px_-14px_rgba(15,157,88,0.9)]">
            <Camera className="h-6 w-6" />
          </span>
          <span className="font-heading text-[14px] font-bold text-[#0C2A1D]">التقط صورة لوجبتك</span>
          <span className="max-w-[240px] text-[11.5px] leading-relaxed text-[#0C2A1D]/45">
            الذكاء الاصطناعي سيحدد الأطباق والكميات والسعرات تلقائياً
          </span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>
      )}

      {preview && (
        <div className="overflow-hidden rounded-2xl bg-[#F7FAF8]">
          <img src={preview} alt="صورة الوجبة" className="h-40 w-full object-cover" />
        </div>
      )}

      {(uploading || analyzing) && (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#0F9D58]/[0.07] py-4 text-[12px] font-semibold text-[#0F9D58]">
          <Loader2 className="h-4 w-4 animate-spin" />
          {uploading ? "جارٍ رفع الصورة..." : "الذكاء الاصطناعي يحلل وجبتك..."}
        </div>
      )}

      {error && <p className="text-[12px] font-semibold text-rose-500">{error}</p>}

      {result && (
        <MealAnalysisResult
          result={result}
          onAdd={(meal) => {
            onAdd(meal);
            reset();
          }}
          onReset={reset}
        />
      )}
    </div>
  );
}