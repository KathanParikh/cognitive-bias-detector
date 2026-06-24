import { forwardRef } from "react";

const SEVERITY_COLOR = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e"
};

const ShareCard = forwardRef(({ result, input }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: "600px",
        background: "white",
        borderRadius: "24px",
        padding: "40px",
        fontFamily: "sans-serif",
        position: "fixed",
        left: "-9999px",
        top: "-9999px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", color: "#8b5cf6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
            🧠 Cognitive Bias Detector
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#111827" }}>My Bias Report</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: result.clarityScore >= 70 ? "#dcfce7" : result.clarityScore >= 40 ? "#fef9c3" : "#fee2e2",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ fontSize: "22px", fontWeight: 800, color: result.clarityScore >= 70 ? "#16a34a" : result.clarityScore >= 40 ? "#ca8a04" : "#dc2626" }}>
              {result.clarityScore}
            </div>
            <div style={{ fontSize: "9px", color: "#9ca3af" }}>/ 100</div>
          </div>
          <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "4px" }}>Clarity Score</div>
        </div>
      </div>

      {/* Input preview */}
      <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "4px" }}>Situation analyzed</div>
        <div style={{ fontSize: "13px", color: "#374151", fontStyle: "italic" }}>
          "{input.slice(0, 120)}{input.length > 120 ? "..." : ""}"
        </div>
      </div>

      {/* Biases */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
          Biases detected
        </div>
        {result.biases.map((bias, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: SEVERITY_COLOR[bias.severity], flexShrink: 0
            }} />
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{bias.name}</div>
            <div style={{
              fontSize: "10px", color: SEVERITY_COLOR[bias.severity],
              background: `${SEVERITY_COLOR[bias.severity]}15`,
              padding: "2px 8px", borderRadius: "99px", marginLeft: "auto"
            }}>
              {bias.severity}
            </div>
          </div>
        ))}
      </div>

      {/* Reframe */}
      <div style={{ background: "#f5f3ff", borderRadius: "12px", padding: "14px 16px", marginBottom: "24px" }}>
        <div style={{ fontSize: "10px", color: "#8b5cf6", marginBottom: "4px" }}>🪞 Unbiased reframe</div>
        <div style={{ fontSize: "12px", color: "#5b21b6", lineHeight: 1.6 }}>{result.unbiasedReframe}</div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "11px", color: "#9ca3af" }}>cognitive-bias-detector.vercel.app</div>
        <div style={{ fontSize: "11px", color: "#8b5cf6", fontWeight: 600 }}>Try it free →</div>
      </div>
    </div>
  );
});

ShareCard.displayName = "ShareCard";
export default ShareCard;