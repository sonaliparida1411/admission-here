/**
 * 1536-dimensional Vector Embedding Pipeline
 * Uses OpenAI text-embedding-3-small or graceful normalized deterministic fallback
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith("sk-") && !apiKey.includes("mock")) {
    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text.slice(0, 8000),
          dimensions: 1536,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        return json.data[0].embedding;
      }
    } catch (e) {
      console.warn("OpenAI API call failed, using deterministic embedding fallback:", e);
    }
  }

  // Deterministic 1536-dim normalized vector fallback
  const vector = new Array(1536).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
    const index = Math.abs((hash + i * 31) % 1536);
    vector[index] += 1 / (1 + Math.abs(hash % 10));
  }

  // Normalize vector to unit length (L2 norm)
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vector.map((v) => Number((v / norm).toFixed(6)));
}

/**
 * Text chunking helper for long markdown blog content & brochures
 */
export function chunkMarkdown(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk);
    i += chunkSize - overlap;
  }
  return chunks;
}

