import { useState } from "react";

const EXAMPLES = {
  career: "I've been preparing for this company for months. Even though the role doesn't excite me, I can't back out now after all that effort.",
  finance: "Everyone in my friend group is investing in this new crypto coin. It keeps going up so I want to put in my entire savings.",
  relationship: "My friend cancelled plans last minute. They always do this. I don't think they actually value our friendship at all.",
  business: "I've gotten a lot of positive feedback on my app idea from friends and family. I'm sure it will work in the market.",
  argument: "I only read news from sources I trust. The other sources are clearly biased and I don't need to waste time on them.",
  general: "I've been working on this project for 2 years and spent all my savings. It's not working but I feel like I can't quit now."
};

export default function InputForm({ onAnalyze, loading, category }) {
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
        placeholder="Describe your situation, decision, or argument in detail..."
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

      {/* Category-specific example */}
      {category && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Try an example</p>
          <button
            onClick={() => setText(EXAMPLES[category] || EXAMPLES.general)}
            className="text-left text-sm text-gray-500 hover:text-violet-600 bg-gray-50 hover:bg-violet-50 px-4 py-3 rounded-xl transition-all border border-gray-100 w-full"
          >
            "{(EXAMPLES[category] || EXAMPLES.general).slice(0, 100)}..."
          </button>
        </div>
      )}
    </div>
  );
}