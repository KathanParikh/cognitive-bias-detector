const SEVERITY_STYLES = {
  high: "bg-red-50 border-red-200 text-red-700",
  medium: "bg-amber-50 border-amber-200 text-amber-700",
  low: "bg-green-50 border-green-200 text-green-700"
};

const SEVERITY_LABEL = {
  high: "Strong bias",
  medium: "Moderate bias",
  low: "Mild bias"
};

export default function BiasCard({ bias, index }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-100">#{index + 1}</span>
          <h3 className="font-semibold text-gray-800 text-base">{bias.name}</h3>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${SEVERITY_STYLES[bias.severity]}`}>
          {SEVERITY_LABEL[bias.severity]}
        </span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-3">{bias.explanation}</p>
      <div className="bg-gray-50 rounded-xl px-4 py-3">
        <p className="text-xs text-gray-400 mb-1">From your input</p>
        <p className="text-sm text-gray-600 italic">"{bias.example}"</p>
      </div>
    </div>
  );
}