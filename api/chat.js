export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { messages } = req.body;

    const systemPrompt = `You are a study assistant for the Israeli Skipper 30 (משיט 30) boating license exam. You help students prepare for the 4 theory exams:
1. ימאות ג' (Seamanship) - COLREGs, stability, safety equipment, weather, maritime regulations
2. מכונאות (Mechanics) - diesel engines, cooling, lubrication, fuel systems, electrical, propellers
3. ניווט חופי א' (Coastal Navigation) - chart plotting, position fixing, course calculations, tides
4. ניווט מכשירים ב' (Instrument Navigation) - compass, GPS, radar, echo sounder, AIS, VHF radio

ALWAYS respond in Hebrew. Be concise but thorough. Use examples from actual exam questions when possible. If a student asks a question you're not sure about, say so. Format key terms in bold. Keep answers focused on what's needed for the exam.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    const text = data.content?.map(c => c.text || '').join('') || '';
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
