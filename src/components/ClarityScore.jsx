import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function ClarityScore({ score }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setDisplayed(score), 300);
    return () => clearTimeout(timeout);
  }, [score]);

  const springValue = useSpring(0, { stiffness: 50, damping: 20 });
  const animatedScore = useTransform(springValue, (v) => Math.round(v));

  useEffect(() => {
    springValue.set(score);
  }, [score, springValue]);

  const getColor = (s) => {
    if (s >= 70) return { primary: "#22c55e", secondary: "#dcfce7", glow: "rgba(34,197,94,0.3)" };
    if (s >= 40) return { primary: "#f59e0b", secondary: "#fef3c7", glow: "rgba(245,158,11,0.3)" };
    return { primary: "#ef4444", secondary: "#fee2e2", glow: "rgba(239,68,68,0.3)" };
  };

  const getLabel = (s) => {
    if (s >= 70) return "Clear thinking";
    if (s >= 40) return "Some bias detected";
    return "Heavy bias detected";
  };

  const color = getColor(displayed);
  const label = getLabel(displayed);
  const circumference = 2 * Math.PI * 54;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100 flex flex-col items-center relative overflow-hidden"
    >
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          background: `radial-gradient(circle at center, ${color.glow}, transparent 70%)`,
        }}
      />

      <p className="text-sm text-gray-400 mb-5 uppercase tracking-wider font-medium">
        Clarity Score
      </p>

      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="10"
          />

          {/* Progress circle with animation */}
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color.primary}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (displayed / 100) * circumference,
            }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />

          {/* Decorative outer ring */}
          <circle
            cx="60"
            cy="60"
            r="58"
            fill="none"
            stroke={color.primary}
            strokeWidth="0.5"
            opacity="0.2"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayed}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-gray-900 tabular-nums"
          >
            <motion.span>{animatedScore}</motion.span>
          </motion.span>
          <span className="text-sm text-gray-400 font-medium">/ 100</span>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-5 text-sm font-medium"
        style={{ color: color.primary }}
      >
        {label}
      </motion.p>

      {/* Decorative dots */}
      <div className="flex gap-1.5 mt-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: i < Math.floor(displayed / 20) ? color.primary : "#e5e7eb",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
