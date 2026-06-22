import { useLocation, useNavigate } from "react-router-dom";
import BiasCard from "../components/BiasCard";
import ClarityScore from "../components/ClarityScore";
import UnbiasedView from "../components/UnbiasedView";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.entry) { navigate("/"); return null; }
  const { input, result } = state.entry;

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

        <h2 className="font-semibold text-gray-800 text-lg mb-3">Biases detected ({result.biases.length})</h2>
        <div className="flex flex-col gap-4">
          {result.biases.map((bias, i) => <BiasCard key={i} bias={bias} index={i} />)}
        </div>

        <button
          onClick={() => navigate("/history")}
          className="w-full mt-8 text-center text-sm text-violet-500 hover:text-violet-700 py-3"
        >
          View past analyses →
        </button>
      </div>
    </div>
  );
}