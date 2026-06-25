import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TOOLS from "../data/tools";

export default function History() {
  const navigate = useNavigate();
  const history = JSON.parse(localStorage.getItem("clarity-history") || "[]");

  const byTool = history.reduce((acc, e) => {
    (acc[e.tool] = acc[e.tool] || []).push(e);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-violet-600 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">History</h1>
        {history.length === 0 && <p className="text-gray-400 text-sm">No analyses yet.</p>}

        {TOOLS.map(tool => (
          <div key={tool.id} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{tool.title}</h3>
            <div className="flex flex-col gap-3">
              {(byTool[tool.id] || []).map(entry => (
                <button key={entry.id} onClick={() => navigate(tool.route)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-left hover:border-violet-200 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">{entry.date}</span>
                    <span className="text-xs font-medium text-violet-600">{entry.tool}</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{entry.input.slice(0, 120)}..."</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}