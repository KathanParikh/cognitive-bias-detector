const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

async function callGroq(messages, { temperature = 0.7, model = "llama-3.3-70b-versatile" } = {}) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model, messages, temperature }),
  });

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "";
  // strip code fences if present
  const clean = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    // If not valid JSON, return raw text under `raw` key for fallback
    return { raw: clean };
  }
}

export { callGroq };
