import { useEffect, useState } from "react";

export default function ClarityScore({ score }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setDisplayed(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "Fairly clear thinking" : score >= 40 ? "Some bias detected" : "Heavy bias detected";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center animate-fade-slide-up">
      <p className="text-sm text-gray-400 mb-4 uppercase tracking-wide">Clarity Score</p>
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{displayed}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium" style={{ color }}>{label}</p>
    </div>
  );
}