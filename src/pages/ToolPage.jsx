import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingState from "../components/LoadingState";
import ClarityScore from "../components/ClarityScore";
import BiasCard from "../components/BiasCard";
import UnbiasedView from "../components/UnbiasedView";
import html2canvas from "html2canvas";
import { callGroq } from "../utils/groq";
import TOOLS from "../data/tools";

export default function ToolPage({ toolId }) {
  const tool = TOOLS.find(t => t.id === toolId) || { id: toolId, title: toolId };
  const [text, setText] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const shareRef = useRef(null);
  const navigate = useNavigate();

  const buildMessages = () => {
    if (toolId === "bias") {
      return [
        { role: "system", content: "You are a cognitive bias expert. Respond with JSON only." },
        { role: "user", content: `Analyze this input for cognitive biases. Respond with JSON: { biases: [{name,severity,explanation,example}], clarityScore:number, unbiasedReframe:string, summary:string }\n\nInput:\n${text}` }
      ];
    }

    if (toolId === "rant") {
      return [
        { role: "system", content: "You are an empathetic analyzer. Reply with JSON only." },
        { role: "user", content: `Separate emotions from facts, identify the underlying problem, and provide a calm rewrite. Respond with JSON: { emotions:["tag"], facts:["..."], problem:string, calm:string }\n\nRant:\n${text}` }
      ];
    }

    if (toolId === "devil") {
      return [
        { role: "system", content: "You are a devil's advocate. Reply JSON only." },
        { role: "user", content: `Given this idea, provide 3 attacks from logical, practical, and ethical angles, then give strengthening suggestions. Respond JSON: { attacks:[{angle, counterargument, suggestion}] }\n\nIdea:\n${text}` }
      ];
    }

    if (toolId === "conversation") {
      return [
        { role: "system", content: "You are a communication coach. Reply JSON only." },
        { role: "user", content: `Plan a difficult conversation. Respond JSON: { opening:string, keyPoints:["..."], dontSay:["..."], pushback:[{what:string, response:string}] }\n\nContext:\n${text}` }
      ];
    }

    if (toolId === "decision") {
      const opts = optionsText.split("\n").map(s => s.trim()).filter(Boolean);
      return [
        { role: "system", content: "You are a decision strategist. Reply JSON only." },
        { role: "user", content: `Create a weighted decision matrix for this choice. Options: ${JSON.stringify(opts)}. Respond JSON: { criteria:["..."], scores:{option:{criteria:value}}, weights:{criteria:value}, winner:string, explanation:string }\n\nDecision:\n${text}` }
      ];
    }

    return [
      { role: "system", content: "You are an assistant. Reply JSON only." },
      { role: "user", content: text }
    ];
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const messages = buildMessages();
      const res = await callGroq(messages, { temperature: 0.7 });
      const entry = {
        id: Date.now(),
        tool: toolId,
        input: text + (optionsText ? "\nOptions:\n" + optionsText : ""),
        result: res,
        date: new Date().toLocaleString(),
      };
      const history = JSON.parse(localStorage.getItem("clarity-history") || "[]");
      localStorage.setItem("clarity-history", JSON.stringify([entry, ...history].slice(0, 50)));
      setResult(res);
    } catch {
      setResult({ raw: "Error parsing response" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!shareRef.current) return;
    try {
      const canvas = await html2canvas(shareRef.current, { scale: 2, backgroundColor: "white", useCORS: true });
      const link = document.createElement("a");
      link.download = `${toolId}-result.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-violet-600 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{tool.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{tool.desc}</p>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Describe your situation..." className="w-full h-40 p-4 rounded-xl border border-gray-100 text-gray-800 resize-none focus:ring-2 focus:ring-violet-400" />

          {toolId === "decision" && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">List options (one per line)</p>
              <textarea value={optionsText} onChange={e => setOptionsText(e.target.value)} className="w-full h-24 p-3 rounded-xl border border-gray-100 text-gray-700 resize-none" />
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button onClick={handleAnalyze} disabled={loading} className="bg-violet-600 text-white px-4 py-2 rounded-xl disabled:opacity-40">{loading ? "Thinking…" : "Analyze"}</button>
            <button onClick={() => { setText(""); setOptionsText(""); setResult(null); }} className="px-4 py-2 rounded-xl border border-gray-100">Try another</button>
          </div>
        </div>

        {loading && <LoadingState />}

        {result && (
          <div className="space-y-4" ref={shareRef}>
            {/* Bias-specific rendering */}
            {toolId === "bias" && result.biases && (
              <>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <ClarityScore score={result.clarityScore || 0} />
                  <UnbiasedView reframe={result.unbiasedReframe || result.reframe || ""} summary={result.summary || ""} />
                </div>
                <div className="space-y-4">
                  {Array.isArray(result.biases) && result.biases.map((b, i) => <BiasCard key={i} bias={b} index={i} />)}
                </div>
              </>
            )}

            {/* Rant */}
            {toolId === "rant" && (result.emotions || result.facts) && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Analysis</h3>
                <div className="mb-3">
                  <p className="text-xs text-gray-400">Emotions</p>
                  <div className="flex gap-2 flex-wrap mt-2">{(result.emotions||[]).map((e,i)=><span key={i} className="text-xs px-3 py-1 rounded-full bg-violet-50 text-violet-600">{e}</span>)}</div>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-400">Facts</p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">{(result.facts||[]).map((f,i)=><li key={i}>{f}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Underlying problem</p>
                  <p className="mt-2 text-sm text-gray-700">{result.problem}</p>
                </div>
                <div className="mt-4 bg-violet-50 border border-violet-100 p-4 rounded-xl">
                  <p className="text-xs text-violet-400">Calm rewrite</p>
                  <p className="mt-2 text-violet-700">{result.calm}</p>
                </div>
              </div>
            )}

            {/* Devil's advocate */}
            {toolId === "devil" && Array.isArray(result.attacks) && (
              <div className="space-y-4">
                {result.attacks.map((a,i)=> (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{a.angle}</h4>
                      <span className="text-xs text-gray-400">Attack #{i+1}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{a.counterargument}</p>
                    <div className="text-sm text-violet-700 font-medium">Suggestion: {a.suggestion}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Conversation */}
            {toolId === "conversation" && (result.opening || result.keyPoints) && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-xs text-gray-400">Opening line</p>
                  <p className="mt-2 text-gray-700">{result.opening}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-xs text-gray-400">Key points</p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">{(result.keyPoints||[]).map((k,i)=><li key={i}>{k}</li>)}</ul>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-xs text-gray-400">What NOT to say</p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">{(result.dontSay||[]).map((d,i)=><li key={i}>{d}</li>)}</ul>
                </div>
              </div>
            )}

            {/* Decision */}
            {toolId === "decision" && result.criteria && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Decision summary</h4>
                <p className="text-sm text-gray-700 mb-3">Winner: <span className="font-bold">{result.winner}</span></p>
                <p className="text-sm text-gray-600 mb-3">{result.explanation}</p>
                <div className="overflow-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left text-xs text-gray-400 pb-2">Option</th>
                        {(result.criteria||[]).map((c,i)=>(<th key={i} className="text-left text-xs text-gray-400 pb-2">{c}</th>))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(result.scores||{}).map((opt,i)=> (
                        <tr key={i} className="align-top">
                          <td className="py-2 pr-4 font-medium text-gray-800">{opt}</td>
                          {(result.criteria||[]).map((c,ci)=>(<td key={ci} className="py-2 text-gray-700">{result.scores[opt]?.[c]}</td>))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Raw fallback */}
            {result && result.raw && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{typeof result.raw === 'string' ? result.raw : JSON.stringify(result.raw, null, 2)}</pre>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={handleDownload} className="bg-violet-600 text-white px-4 py-2 rounded-xl">📤 Download as image</button>
              <button onClick={() => { setResult(null); setText(""); setOptionsText(""); }} className="px-4 py-2 rounded-xl border">Try another</button>
              <button onClick={() => navigate('/history')} className="ml-auto text-sm text-violet-600">View history →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
