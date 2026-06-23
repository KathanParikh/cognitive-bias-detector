import { useState, useEffect } from "react";

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
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      {/* Message */}
      <p className="text-center text-violet-500 text-sm font-medium mb-6 animate-pulse">
        {MESSAGES[msgIndex]}
      </p>

      {/* Skeleton clarity score */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center mb-4">
        <div className="h-3 w-24 bg-gray-100 rounded-full mb-4 animate-pulse" />
        <div className="w-36 h-36 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-3 w-32 bg-gray-100 rounded-full mt-4 animate-pulse" />
      </div>

      {/* Skeleton unbiased view */}
      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 mb-4">
        <div className="h-3 w-32 bg-violet-100 rounded-full mb-3 animate-pulse" />
        <div className="h-3 w-full bg-violet-100 rounded-full mb-2 animate-pulse" />
        <div className="h-3 w-4/5 bg-violet-100 rounded-full mb-2 animate-pulse" />
        <div className="h-3 w-3/5 bg-violet-100 rounded-full animate-pulse" />
      </div>

      {/* Skeleton bias cards */}
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex justify-between mb-3">
            <div className="h-4 w-40 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full mb-2 animate-pulse" />
          <div className="h-3 w-4/5 bg-gray-100 rounded-full mb-2 animate-pulse" />
          <div className="h-3 w-3/5 bg-gray-100 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}