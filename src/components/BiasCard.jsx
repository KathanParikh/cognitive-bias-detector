import { motion } from "framer-motion";

const SEVERITY_CONFIG = {
  high: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    label: "Strong bias",
  },
  medium: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
    label: "Moderate bias",
  },
  low: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    label: "Mild bias",
  },
};

export default function BiasCard({ bias, index }) {
  const config = SEVERITY_CONFIG[bias.severity] || SEVERITY_CONFIG.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.12,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      {/* Severity indicator line */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-1 ${config.bg}`}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: index * 0.12 + 0.2 }}
      />

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-4">
          {/* Number badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: index * 0.12 + 0.1,
            }}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
          >
            <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
          </motion.div>

          <div>
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.12 + 0.15 }}
              className="font-semibold text-gray-900 text-lg"
            >
              {bias.name}
            </motion.h3>

            {/* Severity badge */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.12 + 0.2 }}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mt-1 ${config.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.12 + 0.25 }}
        className="text-gray-600 text-sm leading-relaxed mb-4"
      >
        {bias.explanation}
      </motion.p>

      {/* Example quote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.12 + 0.3 }}
        className={`${config.bg} ${config.border} border rounded-xl px-4 py-3`}
      >
        <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 13a1 1 0 01-1 1H5.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 12H17a1 1 0 011 1z"
              clipRule="evenodd"
            />
          </svg>
          From your input
        </p>
        <p className={`text-sm ${config.text} italic leading-relaxed`}>
          "{bias.example}"
        </p>
      </motion.div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
