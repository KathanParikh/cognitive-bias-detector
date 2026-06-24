const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function analyzeBias(userInput, category = "General") {
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
          content: `Analyze this input for cognitive biases. The category of this situation is: ${category}.

"${userInput}"

Respond ONLY with this exact JSON structure:
{
  "biases": [
    {
      "name": "Bias name",
      "severity": "high" | "medium" | "low",
      "explanation": "2-3 sentence plain English explanation of how this bias shows up in their thinking",
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
  const text = data.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}