import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import TOOLS from "../data/tools";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function History() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const history = JSON.parse(localStorage.getItem("clarity-history") || "[]");

  const byTool = history.reduce((acc, e) => {
    (acc[e.tool] = acc[e.tool] || []).push(e);
    return acc;
  }, {});

  const filteredHistory =
    activeFilter === "all"
      ? history
      : history.filter((e) => e.tool === activeFilter);

  const colors = {
    bias: "from-violet-500 to-purple-600",
    rant: "from-pink-500 to-rose-600",
    devil: "from-amber-500 to-orange-600",
    conversation: "from-emerald-500 to-teal-600",
    decision: "from-blue-500 to-indigo-600",
  };

  const icons = {
    bias: "🧠",
    rant: "💭",
    devil: "😈",
    conversation: "💬",
    decision: "⚖️",
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      <main className="relative pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
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
            Back to home
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analysis History
            </h1>
            <p className="text-gray-500">
              Review your past analyses and insights
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <FilterTab
              label="All"
              count={history.length}
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />
            {TOOLS.map((tool) => (
              <FilterTab
                key={tool.id}
                label={tool.title.split(" ")[0]}
                count={(byTool[tool.id] || []).length}
                active={activeFilter === tool.id}
                onClick={() => setActiveFilter(tool.id)}
              />
            ))}
          </motion.div>

          {/* Empty state */}
          <AnimatePresence>
            {filteredHistory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                >
                  <span className="text-3xl">📭</span>
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No analyses yet
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Start analyzing to build your history
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-violet-500/25"
                >
                  Start analyzing
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History list */}
          <AnimatePresence>
            {filteredHistory.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredHistory.map((entry) => {
                  const tool = TOOLS.find((t) => t.id === entry.tool) || {
                    title: entry.tool,
                  };
                  const gradient = colors[entry.tool] || "from-gray-500 to-gray-600";
                  const icon = icons[entry.tool] || "📊";

                  return (
                    <motion.div
                      key={entry.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, x: -20 }}
                      whileHover={{ y: -2 }}
                      onClick={() => navigate(`/${entry.tool}`)}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg cursor-pointer transition-all overflow-hidden"
                    >
                      <div className="flex items-stretch">
                        {/* Color accent */}
                        <div
                          className={`w-1.5 bg-gradient-to-b ${gradient}`}
                        />

                        {/* Icon */}
                        <div className="w-16 flex-shrink-0 flex items-center justify-center bg-gray-50">
                          <motion.span
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className="text-2xl"
                          >
                            {icon}
                          </motion.span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm">
                                {tool.title}
                              </h3>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {entry.date}
                              </p>
                            </div>
                            {entry.result?.clarityScore !== undefined && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
                                <span className="text-xs font-medium text-gray-600">
                                  {entry.result.clarityScore}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  /100
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            "{entry.input}"
                          </p>

                          {/* Tags for bias count */}
                          {entry.result?.biases?.length > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-xs px-2 py-1 bg-violet-50 text-violet-600 rounded-full font-medium">
                                {entry.result.biases.length} biases
                              </span>
                              {entry.result.biases.slice(0, 2).map((b, i) => (
                                <span
                                  key={i}
                                  className="text-xs text-gray-400"
                                >
                                  {b.name}
                                  {i < 1 && entry.result.biases.length > 1 && ","}
                                </span>
                              ))}
                              {entry.result.biases.length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +{entry.result.biases.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center pr-4">
                          <motion.span
                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clear history button */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to clear all history?"
                    )
                  ) {
                    localStorage.removeItem("clarity-history");
                    window.location.reload();
                  }
                }}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear all history
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function FilterTab({ label, count, active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-violet-100 text-violet-700"
          : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
      }`}
    >
      <span>{label}</span>
      <span
        className={`px-2 py-0.5 rounded-full text-xs ${
          active ? "bg-violet-200" : "bg-gray-100"
        }`}
      >
        {count}
      </span>
    </motion.button>
  );
}
