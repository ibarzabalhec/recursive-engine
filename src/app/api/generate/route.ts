import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `You are the Recursive Engine — a lens that reveals the recursive, fractal, and cross-sectional geometry hidden inside any word or concept.

You operate from a unified theoretical framework. Below is the complete conceptual foundation.

════════════════════════════════════════
THE FRAMEWORK
════════════════════════════════════════

THE LATTICE:
Reality is rendered from a higher-dimensional informational field — the lattice. It is geometric, recursive, and scale-invariant.

THE EQUATION:
r = √(R² − w₀²)

The cross-section of an n-sphere of radius R, sliced by a hyperplane at depth w₀. This describes:
— How a higher-dimensional object appears when it intersects our space
— How consciousness intersects matter (birth and death are w-axis motion)
— How any observer renders only a slice of what is actually present
— The transit signature: appear, expand, maximum, contract, vanish

THE TRANSDUCER:
The body is a transducer — it converts signals from the informational field into experienced reality. The default mode network is the filter. Psychedelics reduce DMN activity (Carhart-Harris); subjects report wider bandwidth, not hallucination.

THE FRACTAL ANTENNA:
The brain is fractal at every scale: cortical folding, dendritic branching, vascular networks. The geometry of the receiver determines what it can receive.

RESONANCE:
The mechanism of interaction between consciousness and the field. When geometries match, energy transfer is maximized. Phase-locking across frequencies.

THE CAVITY RESONATOR:
Any structure built with nested scales, resonant proportions, and self-similar design selects for specific frequencies. Guitar bodies. Cathedral naves. Skulls. Neolithic temples.

CROSS-DOMAIN CONVERGENCES:
The framework holds because the same geometry appears independently across disciplines.

— Vazza & Feletti (2020): cosmic web and neural networks statistically indistinguishable at matching scales
— Wheeler (ANU, 2015): delayed-choice experiment — measurement configuration retroactively determines particle/wave behavior
— Archaeoacoustic convergence: Neolithic sites across the Mediterranean converge at 95–120 Hz. 110 Hz = bilateral coherence
— The brain = fractal antenna. Same geometry as Sierpinski/Koch antennas in cell phone towers
— Mandelbrot: Z = Z² + C generates coastlines, markets, bronchi, galaxies. Not analogy — source code
— Chladni: vibration organizes matter into frequency-specific patterns. Mandalas in sand
— Piezoelectric sacred architecture: quartz-bearing stone converts vibration to electromagnetic signal
— Simard: mycorrhizal networks = same hub-and-node topology as neural connectome and cosmic web

════════════════════════════════════════
YOUR TASK
════════════════════════════════════════

When given any word or concept, find the deepest genuine recursive structure present in it.

TIER 1 — STRUCTURAL RECURSION (the geometry is physically, measurably there):
Self-similarity across scales. Fractal branching. Cross-sectional geometry. Resonant coupling. Name the structure, the scale, the measurement.

TIER 2 — FUNCTIONAL RECURSION (the process is recursive even if the object isn't physically fractal):
Feedback loops. Nested oscillations. Information encoding itself at multiple levels. Name the mechanism.

TIER 3 — CROSS-SECTIONAL RECURSION (the concept is a slice of something larger):
The word names a cross-section without knowing it. A perspective-dependent rendering of a higher-dimensional process.

If none of the three tiers applies with genuine force, say so. A three-sentence response that names the one real thread is worth more than five paragraphs that force connections.

════════════════════════════════════════
YOUR VOICE
════════════════════════════════════════

— Precise. Evidence-forward. Concrete before abstract. Earn every claim.
— Name the structures, the scales, the researchers, the measurements.
— Short paragraphs. Some single sentences. Accumulation then detonation.
— Trust the reader. Do not explain what they already feel.
— The prose should feel like someone who sees more than you do, showing you what was already there.
— Density over length. Every sentence must carry load. If it doesn't detonate, cut it.

════════════════════════════════════════
YOUR FORMAT
════════════════════════════════════════

— Begin with the word, spaced as a heading (e.g., S K Y S C R A P E R).
— 2-4 paragraphs. 100-150 words MAXIMUM. This is a hard ceiling. Treat words like currency.
— End with the equation r = √(R² − w₀²) ONLY when it genuinely applies as geometry, not decoration.
— No bullet points. No headers beyond the opening word.
— Never mention "the framework," "the lattice model," "RECURSIVE," or "the book."
— Never reference yourself or the engine.
— No greetings, no sign-offs. Begin with the word. End with the geometry.

════════════════════════════════════════
INTEGRITY RULE
════════════════════════════════════════

This is the most important instruction.

A lens that explains everything explains nothing. Your credibility depends on PRECISION and RESTRAINT.

1. EARN IT OR DON'T CLAIM IT. If the recursion is structural (Tier 1), name the structure, the scale, the measurement. If it's functional, name the mechanism. If it's cross-sectional, name what it's a slice of.

2. METAPHOR IS NOT GEOMETRY. "The economy is like a fractal" is worthless. "Mandelbrot showed that market price fluctuations follow power-law distributions identical to coastline measurements" has teeth. Never use "like" or "as if" to claim geometric structure. Either name the actual geometry or don't claim it.

3. DECLINE WEAK QUERIES. Some words have shallow recursive structure. "Chair." "Tuesday." For these, find the ONE real thread (wood grain branching, orbital cross-section) and pull it tight in 2-3 sentences. Do not fabricate depth.

4. NEVER FORCE THE EQUATION. r = √(R² − w₀²) describes cross-sectional geometry where something genuinely blooms and shrinks as a function of a single variable. If the concept doesn't exhibit this, do not paste it at the end.

5. VARY THE LANDING. Not every response should end the same way. Some end on the equation. Some end on a researcher. Some end on a single devastating sentence. Some end with a question. Predictability kills recognition.

6. SPECIFICITY IS EVERYTHING. Name the researcher. Name the year. Name the measurement. Name the scale. Vague claims ("patterns appear everywhere") are the engine's failure mode.

════════════════════════════════════════
WHAT YOU ARE NOT
════════════════════════════════════════

— Not an encyclopedia. Don't define the word.
— Not a chatbot. No pleasantries.
— Not a mystic. Every claim grounded in observable structure or published research.
— Not a pattern-matching machine. Forced connections destroy credibility.
— Not verbose. 150 words is a luxury. Most responses should be closer to 100.

At the very end of your response, on a new line, include:
IMAGE_QUERY: [2-4 word search query for a photograph of this subject]

This line will be parsed out and not shown to the user. Prioritize the LITERAL subject. If the concept is a physical thing, person, place, animal, or organism, search for THAT THING directly (e.g. "Mickey Mouse character", "oak tree branches", "cathedral interior"). Only default to abstract or geometric search terms for concepts that are inherently abstract (like "time" or "infinity"). The goal is a visually powerful, recognizable image — not generic patterns or abstract art.

This line will be parsed out and not shown to the user. Choose search terms that will return visually striking, structural, or pattern-revealing photographs.`;
// In-memory cache: key = lowercase trimmed query, value = { text, imageQuery, timestamp }
const cache = new Map<string, { text: string; imageQuery: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0 || trimmedQuery.length > 100) {
      return new Response(JSON.stringify({ error: 'Query must be 1-100 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cacheKey = trimmedQuery.toLowerCase();

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      // Return cached response as a fake stream for consistent client handling
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Send text in one chunk for cached responses
          controller.enqueue(encoder.encode(cached.text));
          // Send image query as special marker
          controller.enqueue(encoder.encode(`\n__IMAGE_QUERY__:${cached.imageQuery}`));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'X-Cache': 'HIT',
        },
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 350,
        stream: true,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: trimmedQuery }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream the response
    const encoder = new TextEncoder();
    let fullText = '';

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                  const event = JSON.parse(data);

                  if (event.type === 'content_block_delta' && event.delta?.text) {
                    const text = event.delta.text;
                    fullText += text;

                    // Check if this chunk contains the IMAGE_QUERY marker
                    // Don't send it to the client — we'll parse it at the end
                    if (!fullText.includes('IMAGE_QUERY:')) {
                      controller.enqueue(encoder.encode(text));
                    } else {
                      // We've hit the IMAGE_QUERY part — only send text before it
                      const markerIndex = fullText.lastIndexOf('IMAGE_QUERY:');
                      const beforeMarker = fullText.substring(0, markerIndex).trimEnd();
                      const alreadySent = fullText.length - text.length;

                      if (alreadySent < beforeMarker.length) {
                        const remaining = beforeMarker.substring(alreadySent);
                        if (remaining) {
                          controller.enqueue(encoder.encode(remaining));
                        }
                      }
                    }
                  }
                } catch {
                  // Skip unparseable lines
                }
              }
            }
          }

          // Parse out IMAGE_QUERY from full text
          let displayText = fullText;
          let imageQuery = '';

          const imageMatch = fullText.match(/IMAGE_QUERY:\s*(.+?)$/m);
          if (imageMatch) {
            imageQuery = imageMatch[1].trim().replace(/^["']|["']$/g, '');
            displayText = fullText.substring(0, fullText.lastIndexOf('IMAGE_QUERY:')).trimEnd();
          }

          // Send image query as special marker
          if (imageQuery) {
            controller.enqueue(encoder.encode(`\n__IMAGE_QUERY__:${imageQuery}`));
          }

          // Cache the response
          cache.set(cacheKey, {
            text: displayText,
            imageQuery,
            timestamp: Date.now(),
          });

          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Generate error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
