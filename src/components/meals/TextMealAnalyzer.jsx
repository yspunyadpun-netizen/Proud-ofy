import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MealAnalysisResult from "@/components/meals/MealAnalysisResult";

const EXAMPLES = ["خبز مع جبن", "طبق كسكس بالدجاج", "قهوة بالحليب وتمر"];

export default function TextMealAnalyzer({ onAdd }) {
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setText("");
    setResult(null);
    setError("");
  };

  const analyze = async (event) => {
    event.preventDefault();
    const description = text.trim();
    if (description.length < 2 || analyzing) return;
    setAnalyzing(true);
    setError("");
    setResult(null);
    try {
      const response = await base44.functions.invoke("analyzeFood", { text: description });
      if (response.data?.error) throw new Error(response.data.error);
      setResult(response.data);
    } catch (err) {
      setError(err.message || "تعذر فهم الوجبة، حاول مرة أخرى.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (result) {
    return (
      <MealAnalysisResult
        result={result}
        onAdd={(meal) => {
          onAdd(meal);
          reset();
        }}
        onReset={() => setResult(null)}
      />
    );
  }

  return (
    <form onSubmit={analyze} className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="اكتب ما أكلته… مثال: أكلت خبزا فيه الجبن وكوب شاي بالحليب"
        className="w-full resize-none rounded-2xl border border-[#EDF1EE] bg-[#F9FBFA] px-4 py-3 text-[12.5px] leading-relaxed text-[#0C2A1D] outline-none transition placeholder:text-[#0C2A1D]/35 focus:border-[#0F9D58]/50 focus:bg-white"
      />

      <div className="flex flex-wrap gap-1.5">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setText(example)}
            className="rounded-full bg-[#0F9D58]/[0.07] px-3 py-1.5 text-[10.5px] font-semibold text-[#0F9D58] transition hover:bg-[#0F9D58]/15"
          >
            {example}
          </button>
        ))}
      </div>

      {analyzing && (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#0F9D58]/[0.07] py-4 text-[12px] font-semibold text-[#0F9D58]">
          <Loader2 className="h-4 w-4 animate-spin" />
          الذكاء الاصطناعي يحسب وجبتك...
        </div>
      )}

      {error && <p className="text-[12px] font-semibold text-rose-500">{error}</p>}

      <button
        type="submit"
        disabled={analyzing || text.trim().length < 2}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F9D58] py-3 text-[13px] font-bold text-white transition hover:bg-[#0C8650] disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4" />
        افهم وجبتي
      </button>
    </form>
  );
}