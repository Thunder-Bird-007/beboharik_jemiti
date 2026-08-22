import { useMemo, useState } from "react";
import { QUIZ } from "@/quiz/data";
import { useAppStore } from "@/state/appStore";

export default function Quiz() {
  const lang = useAppStore((s) => s.lang);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [retryMode, setRetryMode] = useState(false);

  const isCorrect = (id: string) => {
    const sel = answers[id];
    if (sel === undefined) return false;
    return !!QUIZ.find((q) => q.id === id)?.options[sel]?.correct;
  };

  const answeredCount = Object.keys(answers).length;
  const score = QUIZ.filter((q) => isCorrect(q.id)).length;
  const wrongList = useMemo(() => QUIZ.filter((q) => answers[q.id] !== undefined && !isCorrect(q.id)), [answers]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleQuiz = retryMode ? wrongList : QUIZ;

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto pb-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--ink)" }}>
            {lang === "bn" ? "কুইজ: ব্যবহারিক জ্যামিতি" : "Quiz: Practical Geometry"}
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--ink-soft)" }}>
            {lang === "bn" ? "লেকচারের সংক্ষিপ্ত প্রশ্নোত্তর ও MCQ" : "The lecture's short-answer & MCQ recap"}
          </p>
        </div>
        <div
          className="rounded-full px-4 h-10 flex items-center gap-2 text-[13.5px] font-semibold"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {lang === "bn" ? "স্কোর" : "Score"}: {score} / {QUIZ.length}
        </div>
      </div>

      {answeredCount === QUIZ.length && wrongList.length > 0 && (
        <button
          onClick={() => setRetryMode((v) => !v)}
          className="self-start text-[12.5px] px-3 h-8 rounded-full font-medium"
          style={{ background: retryMode ? "var(--accent)" : "var(--bg-elevated)", color: retryMode ? "#fff" : "var(--accent)", border: "1px solid var(--accent)" }}
        >
          {retryMode
            ? lang === "bn"
              ? "সব প্রশ্ন দেখাও"
              : "Show all questions"
            : lang === "bn"
              ? `শুধু ভুলগুলো আবার চেষ্টা করো (${wrongList.length})`
              : `Retry wrong ones only (${wrongList.length})`}
        </button>
      )}

      {retryMode && wrongList.length === 0 && (
        <div className="rounded-xl p-4 text-center" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
          {lang === "bn" ? "🎉 চমৎকার! সব প্রশ্নের সঠিক উত্তর দিয়েছ।" : "🎉 Great job! All questions answered correctly."}
        </div>
      )}

      {visibleQuiz.map((q, idx) => {
        const sel = answers[q.id];
        const answered = sel !== undefined;
        const correct = answered && isCorrect(q.id);
        return (
          <div key={q.id} className="rounded-xl p-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)" }}>
            <p className="text-[13px] font-mono-num mb-1" style={{ color: "var(--muted)" }}>
              {lang === "bn" ? `প্রশ্ন ${idx + 1}` : `Question ${idx + 1}`}
            </p>
            <p className="text-[14.5px] font-medium whitespace-pre-line leading-relaxed" style={{ color: "var(--ink)" }}>
              {lang === "bn" ? q.prompt.bn : q.prompt.en}
            </p>
            {q.figure && <div className="my-3 flex justify-center">{q.figure}</div>}
            <div className="grid gap-2 mt-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
              {q.options.map((opt, i) => {
                const isSel = sel === i;
                let bg = "var(--bg)";
                let border = "var(--panel-border)";
                let color = "var(--ink)";
                if (answered && isSel) {
                  bg = opt.correct ? "rgba(28,122,76,0.12)" : "rgba(179,38,30,0.12)";
                  border = opt.correct ? "var(--success)" : "var(--danger)";
                  color = opt.correct ? "var(--success)" : "var(--danger)";
                } else if (answered && opt.correct) {
                  bg = "rgba(28,122,76,0.08)";
                  border = "var(--success)";
                  color = "var(--success)";
                }
                return (
                  <button
                    key={i}
                    disabled={answered}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                    className="text-left text-[13px] px-3 py-2 rounded-lg transition-colors disabled:cursor-default"
                    style={{ background: bg, border: `1.5px solid ${border}`, color }}
                  >
                    {lang === "bn" ? opt.bn : opt.en}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div
                className="mt-3 text-[12.5px] rounded-md px-3 py-2 leading-relaxed"
                style={{
                  background: correct ? "rgba(28,122,76,0.08)" : "rgba(179,38,30,0.08)",
                  color: correct ? "var(--success)" : "var(--danger)",
                  border: `1px solid ${correct ? "var(--success)" : "var(--danger)"}`,
                }}
              >
                <p className="font-semibold mb-0.5">
                  {correct ? (lang === "bn" ? "✓ সঠিক!" : "✓ Correct!") : lang === "bn" ? "✗ ভুল হয়েছে" : "✗ Not quite"}
                </p>
                <p style={{ color: "var(--ink-soft)" }}>{lang === "bn" ? q.explanation.bn : q.explanation.en}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
