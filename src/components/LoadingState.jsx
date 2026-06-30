import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Consulting your inner psychologist...",
  "Detecting thought patterns...",
  "Scanning for logical fallacies...",
  "Analyzing your reasoning...",
  "Identifying hidden assumptions...",
  "Checking for blind spots...",
];

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      {/* Animated message */}
      <div className="text-center mb-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-violet-600 text-sm font-medium"
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Animated dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Skeleton clarity score with shimmer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100 flex flex-col items-center mb-5"
      >
        <SkeletonLine width="w-24" className="mb-5" />
        <div className="relative w-36 h-36">
          <div className="absolute inset-0 rounded-full bg-gray-100 shimmer" />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-gray-200"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <SkeletonLine width="w-32" className="mt-5" />
      </motion.div>

      {/* Skeleton unbiased view */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 mb-5 border border-violet-100"
      >
        <SkeletonLine width="w-32" className="mb-4 bg-violet-200" />
        <SkeletonLine className="mb-3 bg-violet-100" />
        <SkeletonLine width="w-4/5" className="mb-3 bg-violet-100" />
        <SkeletonLine width="w-3/5" className="bg-violet-100" />
      </motion.div>

      {/* Skeleton bias cards */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.08 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-4 border border-gray-100"
        >
          <div className="flex justify-between mb-4">
            <SkeletonLine width="w-40" />
            <SkeletonLine width="w-20" />
          </div>
          <SkeletonLine className="mb-3" />
          <SkeletonLine width="w-4/5" className="mb-3" />
          <SkeletonLine width="w-3/5" />
        </motion.div>
      ))}
    </div>
  );
}

function SkeletonLine({ width = "w-full", className = "" }) {
  return (
    <div className={`h-3 ${width} rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full w-full bg-gradient-to-r from-transparent via-white/60 to-transparent shimmer"
        style={{ backgroundSize: "200% 100%" }}
      />
    </div>
  );
}

<style>{`
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .shimmer {
    animation: shimmer 2s infinite linear;
  }
`}</style>;
