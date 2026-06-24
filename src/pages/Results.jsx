// import { useRef } from "react";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import BiasCard from "../components/BiasCard";
import ClarityScore from "../components/ClarityScore";
import UnbiasedView from "../components/UnbiasedView";
import ShareCard from "../components/ShareCard";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const shareRef = useRef(null);
  const [sharing, setSharing] = useState(false);

  if (!state?.entry) { navigate("/"); return null; }
  const { input, result } = state.entry;

  const handleShare = async () => {
    setSharing(true);
    try {
      const canvas = await html2canvas(shareRef.current, {
        scale: 2,
        backgroundColor: "white",
        useCORS: true
      });
      const link = document.createElement("a");
      link.download = "my-bias-report.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Share failed", e);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-violet-600 mb-6 flex items-center gap-1">
          ← Analyze another
        </button>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Your input</p>
          <p className="text-gray-700 text-sm italic">"{input}"</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <ClarityScore score={result.clarityScore} />
          <UnbiasedView reframe={result.unbiasedReframe} summary={result.summary} />
        </div>

        <h2 className="font-semibold text-gray-800 text-lg mb-3">
          Biases detected ({result.biases.length})
        </h2>
        <div className="flex flex-col gap-4 mb-8">
          {result.biases.map((bias, i) => (
            <BiasCard key={i} bias={bias} index={i} />
          ))}
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          disabled={sharing}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-medium py-3 rounded-2xl transition-all mb-4"
        >
          {sharing ? "Generating image..." : "📤 Download My Bias Report"}
        </button>

        <button
          onClick={() => navigate("/history")}
          className="w-full text-center text-sm text-violet-500 hover:text-violet-700 py-3"
        >
          View past analyses →
        </button>
      </div>

      {/* Hidden share card — gets screenshotted */}
      <ShareCard ref={shareRef} result={result} input={input} />
    </div>
  );
}