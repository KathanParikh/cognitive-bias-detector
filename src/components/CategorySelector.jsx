const CATEGORIES = [
  { id: "career", label: "Career", emoji: "💼", desc: "Job, internship, college decisions" },
  { id: "finance", label: "Finance", emoji: "💸", desc: "Money, investments, spending" },
  { id: "relationship", label: "Relationship", emoji: "❤️", desc: "Friends, family, romantic" },
  { id: "business", label: "Business", emoji: "🚀", desc: "Startup, product, strategy" },
  { id: "argument", label: "Argument", emoji: "🗣️", desc: "Debate, conflict, disagreement" },
  { id: "general", label: "General", emoji: "🧠", desc: "Anything else" },
];

export default function CategorySelector({ selected, onSelect }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <p className="text-sm text-gray-500 mb-3 font-medium">What kind of situation is this?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all
              ${selected === cat.id
                ? "border-violet-400 bg-violet-50 shadow-sm"
                : "border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50"
              }`}
          >
            <span className="text-xl">{cat.emoji}</span>
            <div>
              <div className={`text-sm font-medium ${selected === cat.id ? "text-violet-700" : "text-gray-700"}`}>
                {cat.label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{cat.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}