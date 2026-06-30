import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50" />

      {/* Animated mesh gradient blobs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 -left-20 w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          filter: "blur(45px)",
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-violet-400/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #8b5cf6 1px, transparent 1px),
            linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
