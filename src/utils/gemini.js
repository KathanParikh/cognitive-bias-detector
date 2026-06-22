const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function analyzeBias(userInput) {
  if (!API_KEY) {
    throw new Error("Missing VITE_GROQ_API_KEY in .env.");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a cognitive bias expert. Always respond with valid JSON only, no markdown, no extra text."
        },
        {
          role: "user",
          content: `Analyze this input for cognitive biases:

"${userInput}"

Respond ONLY with this exact JSON structure:
{
  "biases": [
    {
      "name": "Bias name",
      "severity": "high" | "medium" | "low",
      "explanation": "2-3 sentence plain English explanation of how this bias shows up",
      "example": "One sentence concrete example from their input"
    }
  ],
  "clarityScore": <number 0-100, where 100 means no bias>,
  "unbiasedReframe": "2-3 sentences rewriting their situation from a neutral perspective",
  "summary": "One sentence summary of the overall bias pattern"
}`
        }
      ],
      temperature: 0.7
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Groq API request failed with status ${res.status}.`);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error(data?.error?.message || "Groq returned an unexpected response.");
  }

  const clean = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("Groq returned text that was not valid JSON.");
  }
}