import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SUGGESTIONS = [
  "كم سعرة تبقى لي اليوم؟",
  "أعطني وجبة غداء عالية البروتين",
  "كيف أزيد وزني بشكل صحي؟",
  "قيّم تقدمي هذا الأسبوع",
];

export default function Coach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const page = await base44.entities.ChatMessage.filter({}, { sort: "created_date", limit: 80 });
      if (!active) return;
      setMessages(page?.items || []);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setInput("");
    setSending(true);
    try {
      const userMessage = await base44.entities.ChatMessage.create({ role: "user", content });
      setMessages((prev) => [...prev, userMessage]);
      const response = await base44.functions.invoke("coachChat", { message: content });
      const reply =
        response.data?.reply ||
        (response.data?.error ? "حدث خطأ أثناء الرد، حاول مرة أخرى." : "لم أستطع الرد الآن.");
      const assistantMessage = await base44.entities.ChatMessage.create({ role: "assistant", content: reply });
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `local-${Date.now()}`, role: "assistant", content: "تعذر الاتصال بالمدرب، تحقق من اتصالك وحاول مجدداً." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-11rem)] min-h-[480px] flex-col lg:h-[calc(100dvh-6rem)]">
      <header className="mb-3 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#12B268] to-[#0B7A45] text-white shadow-[0_12px_24px_-14px_rgba(15,157,88,0.9)]">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-heading text-[17px] font-black text-[#0C2A1D]">المدرب الذكي</h1>
          <p className="text-[11px] text-[#0C2A1D]/45">يجيبك اعتماداً على بياناتك الحقيقية</p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-[26px] bg-white p-4 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]">
        {loading ? (
          <div className="grid h-full place-items-center">
            <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#0F9D58]/20 border-t-[#0F9D58]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0F9D58]/8 text-[#0F9D58]">
              <Sparkles className="h-6 w-6" />
            </span>
            <p className="mt-4 font-heading text-[14px] font-bold text-[#0C2A1D]">مرحباً، أنا آيبي</p>
            <p className="mt-1 max-w-[260px] text-[12px] leading-relaxed text-[#0C2A1D]/45">
              اسألني عن سعراتك، وجباتك، ماءك أو وزنك — سأجيبك من بياناتك المسجلة.
            </p>
            <div className="mt-5 grid w-full gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => send(suggestion)}
                  className="rounded-xl bg-[#F7FAF8] px-3.5 py-2.5 text-right text-[12px] font-semibold text-[#0C2A1D]/60 transition hover:bg-[#0F9D58]/8 hover:text-[#0F9D58]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#0C2A1D] text-white"
                      : "bg-[#F4F7F5] text-[#0C2A1D]/80"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-end">
                <div className="flex items-center gap-1.5 rounded-2xl bg-[#F4F7F5] px-3.5 py-2.5 text-[11.5px] text-[#0C2A1D]/50">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  آيبي يكتب...
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mt-3 flex items-center gap-2 rounded-[22px] bg-white p-2 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك للمدرب..."
          className="h-11 flex-1 bg-transparent px-3 text-[13px] text-[#0C2A1D] outline-none placeholder:text-[#0C2A1D]/30"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#0F9D58] text-white transition hover:bg-[#0C8650] disabled:opacity-40"
          aria-label="إرسال"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}