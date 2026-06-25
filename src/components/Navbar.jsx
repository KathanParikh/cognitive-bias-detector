import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold">CI</div>
          <div className="text-gray-800 font-semibold">ClarityAI</div>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/history" className="text-sm text-gray-500 hover:text-violet-600">History</Link>
        </div>
      </div>
    </div>
  );
}