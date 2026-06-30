import { motion } from "framer-motion";

export default function UnbiasedView({ reframe, summary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-6 border border-violet-100 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-violet-200/30 to-indigo-200/30 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl" />

      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2.5 mb-4"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center"
          >
            <span className="text-lg">🪞</span>
          </motion.div>
          <h3 className="font-semibold text-violet-900">Unbiased Reframe</h3>
        </motion.div>

        {/* Reframe text with character animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <p className="text-violet-700 text-sm leading-relaxed">
            {reframe}
          </p>
        </motion.div>

        {/* Summary section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-t border-violet-200/60 pt-4"
        >
          <p className="text-xs text-violet-500 mb-2 font-medium uppercase tracking-wide flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Overall Pattern
          </p>
          <p className="text-sm text-violet-800 font-medium leading-relaxed">
            {summary}
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-violet-300"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
