import { useState } from "react";

const EXAMPLES = [
  "I've been working on this startup idea for 2 years, spent all my savings on it. It's not working but I can't quit now.",
  "My friend group all think crypto will moon, so I'm putting in my entire salary this month.",
  "I only read news sources that agree with my political views because the others are clearly biased."
];

export default function InputForm({ onAnalyze, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim().length < 20) return;
    onAnalyze(text);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Describe a decision you're struggling with, an argument you had, or a belief you hold strongly..."
        className="w-full h-40 p-4 rounded-2xl border border-gray-200 text-gray-800 text-base resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white shadow-sm"
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-400">{text.length} characters</span>
        <button
          onClick={handleSubmit}
          disabled={loading || text.trim().length < 20}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-medium px-6 py-2.5 rounded-xl transition-all"
        >
          {loading ? "Analyzing..." : "Spot My Biases →"}
        </button>
      </div>

      <div className="mt-6">
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Try an example</p>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setText(ex)}
              className="text-left text-sm text-gray-500 hover:text-violet-600 bg-gray-50 hover:bg-violet-50 px-4 py-2.5 rounded-xl transition-all border border-gray-100"
            >
              "{ex.slice(0, 80)}..."
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}