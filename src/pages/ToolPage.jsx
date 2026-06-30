import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import LoadingState from "../components/LoadingState";
import ClarityScore from "../components/ClarityScore";
import BiasCard from "../components/BiasCard";
import UnbiasedView from "../components/UnbiasedView";
import html2canvas from "html2canvas";
import { callGroq } from "../utils/groq";
import TOOLS from "../data/tools";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function ToolPage({ toolId }) {
  const tool = TOOLS.find((t) => t.id === toolId) || { id: toolId, title: toolId };
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
        { role: "user", content: `Analyze this input for cognitive biases. Respond with JSON: { biases: [{name,severity,explanation,example}], clarityScore:number, unbiasedReframe:string, summary:string }\n\nInput:\n${text}` },
      ];
    }
    if (toolId === "rant") {
      return [
        { role: "system", content: "You are an empathetic analyzer. Reply with JSON only." },
        { role: "user", content: `Separate emotions from facts, identify the underlying problem, and provide a calm rewrite. Respond with JSON: { emotions:["tag"], facts:["..."], problem:string, calm:string }\n\nRant:\n${text}` },
      ];
    }
    if (toolId === "devil") {
      return [
        { role: "system", content: "You are a devil's advocate. Reply JSON only." },
        { role: "user", content: `Given this idea, provide 3 attacks from logical, practical, and ethical angles, then give strengthening suggestions. Respond JSON: { attacks:[{angle, counterargument, suggestion}] }\n\nIdea:\n${text}` },
      ];
    }
    if (toolId === "conversation") {
      return [
        { role: "system", content: "You are a communication coach. Reply JSON only." },
        { role: "user", content: `Plan a difficult conversation. Respond JSON: { opening:string, keyPoints:["..."], dontSay:["..."], pushback:[{what:string, response:string}] }\n\nContext:\n${text}` },
      ];
    }
    if (toolId === "decision") {
      const opts = optionsText.split("\n").map((s) => s.trim()).filter(Boolean);
      return [
        { role: "system", content: "You are a decision strategist. Reply JSON only." },
        { role: "user", content: `Create a weighted decision matrix for this choice. Options: ${JSON.stringify(opts)}. Respond JSON: { criteria:["..."], scores:{option:{criteria:value}}, weights:{criteria:value}, winner:string, explanation:string }\n\nDecision:\n${text}` },
      ];
    }
    return [
      { role: "system", content: "You are an assistant. Reply JSON only." },
      { role: "user", content: text },
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
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen relative"
    >
      <AnimatedBackground />
      <Navbar />

      <main className="relative pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 mb-8 transition-colors"
          >
            <motion.span
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ←
            </motion.span>
            Back to tools
          </motion.button>

          {/* Tool header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20"
              >
                <span className="text-white text-xl font-bold">
                  {toolId.charAt(0).toUpperCase()}
                </span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tool.title}</h1>
                <p className="text-sm text-gray-500">{tool.desc}</p>
              </div>
            </div>
          </motion.div>

          {/* Input card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 mb-8 overflow-hidden"
          >
            {/* Input header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-sm font-medium text-gray-700">
                  Your input
                </span>
              </div>
            </div>

            {/* Textarea */}
            <div className="p-4">
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.01 }}
              >
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Describe your situation, decision, or argument in detail..."
                  className="w-full h-44 p-4 rounded-xl border border-gray-200 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 text-sm leading-relaxed transition-all"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="text-xs text-gray-400">{text.length} chars</span>
                </div>
              </motion.div>

              {/* Decision tool options input */}
              {toolId === "decision" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <label className="text-xs text-gray-500 mb-2 block font-medium">
                    Options (one per line)
                  </label>
                  <textarea
                    value={optionsText}
                    onChange={(e) => setOptionsText(e.target.value)}
                    placeholder="Option A&#10;Option B&#10;Option C"
                    className="w-full h-28 p-4 rounded-xl border border-gray-200 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 text-sm"
                  />
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setText("");
                    setOptionsText("");
                    setResult(null);
                  }}
                  className="px-6 py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Clear
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Loading state */}
          <AnimatePresence>
            {loading && <LoadingState />}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
                ref={shareRef}
              >
                {/* Bias results */}
                {toolId === "bias" && result.biases && (
                  <>
                    <div className="grid grid-cols-1 gap-5">
                      <ClarityScore score={result.clarityScore || 0} />
                      <UnbiasedView
                        reframe={result.unbiasedReframe || result.reframe || ""}
                        summary={result.summary || ""}
                      />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-sm">
                          🧠
                        </span>
                        Biases detected ({result.biases.length})
                      </h2>
                      <div className="space-y-4">
                        {Array.isArray(result.biases) &&
                          result.biases.map((b, i) => (
                            <BiasCard key={i} bias={b} index={i} />
                          ))}
                      </div>
                    </motion.div>
                  </>
                )}

                {/* Rant results */}
                {toolId === "rant" && (result.emotions || result.facts) && (
                  <ResultCard title="Analysis">
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                          Emotions Detected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(result.emotions || []).map((e, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
                            >
                              {e}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                          Facts Extracted
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          {(result.facts || []).map((f, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="text-sm text-gray-700"
                            >
                              {f}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                          Underlying Problem
                        </p>
                        <p className="text-sm text-gray-700">{result.problem}</p>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-4 border border-violet-100"
                      >
                        <p className="text-xs text-violet-500 mb-2 font-medium">
                          Calm Rewrite
                        </p>
                        <p className="text-violet-700 leading-relaxed">
                          {result.calm}
                        </p>
                      </motion.div>
                    </div>
                  </ResultCard>
                )}

                {/* Devil's advocate results */}
                {toolId === "devil" && Array.isArray(result.attacks) && (
                  <div className="space-y-4">
                    {(result.attacks || []).map((a, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                              {a.angle}
                            </span>
                            <span className="text-xs text-gray-400">
                              #{i + 1}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            {a.counterargument}
                          </p>
                          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                            <p className="text-xs text-emerald-600 font-medium mb-1">
                              Suggestion
                            </p>
                            <p className="text-sm text-emerald-700">
                              {a.suggestion}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Conversation results */}
                {toolId === "conversation" && (result.opening || result.keyPoints) && (
                  <div className="space-y-4">
                    <ResultCard title="Opening Line">
                      <p className="text-gray-700 leading-relaxed">
                        {result.opening}
                      </p>
                    </ResultCard>

                    <ResultCard title="Key Points">
                      <ul className="list-disc pl-5 space-y-2">
                        {(result.keyPoints || []).map((k, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="text-sm text-gray-700"
                          >
                            {k}
                          </motion.li>
                        ))}
                      </ul>
                    </ResultCard>

                    <ResultCard title="What NOT to Say" variant="warning">
                      <ul className="list-disc pl-5 space-y-2">
                        {(result.dontSay || []).map((d, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="text-sm text-amber-800"
                          >
                            {d}
                          </motion.li>
                        ))}
                      </ul>
                    </ResultCard>
                  </div>
                )}

                {/* Decision results */}
                {toolId === "decision" && result.criteria && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Decision Summary
                      </h4>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                          <span className="text-white text-lg">🏆</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Winner</p>
                          <p className="font-bold text-gray-900">
                            {result.winner}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-5">
                        {result.explanation}
                      </p>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left text-xs text-gray-500 font-medium pb-3 pr-4">
                                Option
                              </th>
                              {(result.criteria || []).map((c, i) => (
                                <th
                                  key={i}
                                  className="text-left text-xs text-gray-500 font-medium pb-3 px-2"
                                >
                                  {c}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(result.scores || {}).map((opt, i) => (
                              <motion.tr
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="border-b border-gray-50 last:border-0"
                              >
                                <td className="py-3 pr-4 font-medium text-gray-900">
                                  {opt}
                                  {opt === result.winner && (
                                    <span className="ml-2 text-emerald-500">
                                      ✓
                                    </span>
                                  )}
                                </td>
                                {(result.criteria || []).map((c, ci) => (
                                  <td
                                    key={ci}
                                    className="py-3 px-2 text-gray-600"
                                  >
                                    {result.scores[opt]?.[c]}
                                  </td>
                                ))}
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Raw fallback */}
                {result && result.raw && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {typeof result.raw === "string"
                        ? result.raw
                        : JSON.stringify(result.raw, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                  >
                    <span>Download as image</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setResult(null);
                      setText("");
                      setOptionsText("");
                    }}
                    className="px-6 py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    Try another
                  </motion.button>

                  <button
                    onClick={() => navigate("/history")}
                    className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 self-center sm:ml-auto"
                  >
                    View history
                    <span>→</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}

function ResultCard({ title, variant = "default", children }) {
  const variants = {
    default: {
      bg: "bg-white",
      border: "border-gray-100",
      header: "bg-gray-50",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      header: "bg-amber-100",
    },
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      header: "bg-emerald-100",
    },
  };

  const config = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.bg} border ${config.border} rounded-2xl shadow-sm overflow-hidden`}
    >
      <div className={`${config.header} px-5 py-3 border-b ${config.border}`}>
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}
