import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const history = JSON.parse(localStorage.getItem("bias-history") || "[]");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-violet-600 mb-6">← Back</button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Past Analyses</h1>
        {history.length === 0 && <p className="text-gray-400 text-sm">No analyses yet.</p>}
        <div className="flex flex-col gap-4">
          {history.map(entry => (
            <button
              key={entry.id}
              onClick={() => navigate("/results", { state: { entry } })}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-left hover:border-violet-200 transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">{entry.date}</span>
                <span className="text-xs font-medium text-violet-600">Clarity: {entry.result.clarityScore}/100</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 italic">"{entry.input.slice(0, 120)}..."</p>
              <p className="text-xs text-gray-400 mt-2">{entry.result.biases.length} biases detected</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}