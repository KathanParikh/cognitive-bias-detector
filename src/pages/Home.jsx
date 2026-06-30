import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import TOOLS from "../data/tools";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

const heroText = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      <main className="relative pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-center mb-16 sm:mb-24"
          >
            {/* Floating badge */}
            <motion.div
              variants={heroText}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 mb-6"
            >
              <motion.span
                className="flex h-2 w-2 relative"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </motion.span>
              <span className="text-sm font-medium text-violet-700">
                Powered by AI
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={heroText}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Think clearer.
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Decide smarter.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={heroText}
              className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Five intelligent tools to help you identify cognitive biases, plan
              conversations, make better decisions, and communicate more
              effectively.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={heroText}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/bias">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(124, 58, 237, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-xl shadow-violet-500/25 transition-all"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Analyzing
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </Link>

              <Link to="/history">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 text-gray-600 font-medium rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  View Past Analyses
                </motion.button>
              </Link>
            </motion.div>
          </motion.section>

          {/* Tools Grid */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {TOOLS.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </motion.section>

          {/* Stats Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              { label: "Cognitive Biases", value: "180+", desc: "Detectable biases" },
              { label: "Thinking Tools", value: "5", desc: "Powerful analyzers" },
              { label: "Success Rate", value: "98%", desc: "User satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-400">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.section>
        </div>
      </main>
    </div>
  );
}

function ToolCard({ tool, index }) {
  const icons = {
    bias: "🧠",
    rant: "💭",
    devil: "😈",
    conversation: "💬",
    decision: "⚖️",
  };

  const colors = {
    bias: "from-violet-500 to-purple-600",
    rant: "from-pink-500 to-rose-600",
    devil: "from-amber-500 to-orange-600",
    conversation: "from-emerald-500 to-teal-600",
    decision: "from-blue-500 to-indigo-600",
  };

  return (
    <motion.div variants={item}>
      <Link to={tool.route} className="group block h-full">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="relative h-full bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          {/* Gradient accent */}
          <div
            className={`absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${colors[tool.id]} opacity-0 group-hover:opacity-100 transition-opacity`}
          />

          {/* Icon */}
          <div className="mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-gray-100 transition-colors"
            >
              {icons[tool.id]}
            </motion.div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
            {tool.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {tool.desc}
          </p>

          {/* Action */}
          <div className="flex items-center gap-2 text-sm font-medium text-violet-600 group-hover:text-violet-700">
            Try it out
            <motion.span
              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
