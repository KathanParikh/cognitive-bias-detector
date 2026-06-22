export default function UnbiasedView({ reframe, summary }) {
  return (
    <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-violet-500 text-lg">🪞</span>
        <h3 className="font-semibold text-violet-800">Unbiased reframe</h3>
      </div>
      <p className="text-violet-700 text-sm leading-relaxed mb-4">{reframe}</p>
      <div className="border-t border-violet-200 pt-4">
        <p className="text-xs text-violet-400 mb-1">Overall pattern</p>
        <p className="text-sm text-violet-600 font-medium">{summary}</p>
      </div>
    </div>
  );
}