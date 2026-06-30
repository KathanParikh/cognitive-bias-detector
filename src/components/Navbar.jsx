import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 opacity-0 group-hover:opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-lg tracking-tight">
                ClarityAI
              </span>
              <span className="text-[10px] text-gray-400 -mt-1 hidden sm:block">
                Think better
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink to="/" active={location.pathname === "/"}>
              Home
            </NavLink>
            <NavLink to="/history" active={location.pathname === "/history"}>
              History
            </NavLink>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} className="relative px-3 py-2 group">
      <motion.span
        variants={{
          idle: { y: 0 },
          hover: { y: -1 }
        }}
        initial="idle"
        whileHover="hover"
        className={`text-sm font-medium transition-colors ${
          active ? "text-violet-600" : "text-gray-500 group-hover:text-gray-900"
        }`}
      >
        {children}
      </motion.span>

      <AnimatePresence>
        {active && (
          <motion.div
            layoutId="activeNav"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-600"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 rounded-lg bg-gray-100 -z-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      />
    </Link>
  );
}
