import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import { analyzeBias } from "../utils/gemini";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = async (text) => {
    setLoading(true);
    setError("");
    try {
      const result = await analyzeBias(text);
      const entry = { id: Date.now(), input: text, result, date: new Date().toLocaleDateString() };
      const history = JSON.parse(localStorage.getItem("bias-history") || "[]");
      localStorage.setItem("bias-history", JSON.stringify([entry, ...history].slice(0, 20)));
      navigate("/results", { state: { entry } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="bg-violet-100 text-violet-600 text-xs font-medium px-3 py-1 rounded-full">Powered by AI</span>
        <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-3">Spot My Cognitive Bias</h1>
        <p className="text-gray-500 text-lg">Describe any decision, argument, or belief. AI will reveal the hidden biases shaping your thinking.</p>
      </div>
      <InputForm onAnalyze={handleAnalyze} loading={loading} />
      {error && <p className="text-center text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
}