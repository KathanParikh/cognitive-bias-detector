import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import TOOLS from "../data/tools";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-3">ClarityAI</h1>
          <p className="text-gray-500 text-lg">Five AI tools to help you think more clearly.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map(t => (
            <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 text-lg">{t.title}</h3>
              <p className="text-gray-500 text-sm mt-2 mb-4">{t.desc}</p>
              <Link to={t.route} className="inline-block bg-violet-600 text-white px-4 py-2 rounded-lg">Try it</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}