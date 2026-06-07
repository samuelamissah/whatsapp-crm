import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function POST(request: Request) {
  const { user, workspace } = await getCurrentWorkspace();

  if (!user || !workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is missing" },
      { status: 500 }
    );
  }

  const body = await request.json();

  const customerName = String(body.customerName || "").trim();
  const messageType = String(body.messageType || "follow_up").trim();
  const context = String(body.context || "").trim();

  if (!customerName) {
    return NextResponse.json(
      { error: "Customer name is required" },
      { status: 400 }
    );
  }

  const prompt = `
You are helping a Ghanaian WhatsApp seller write a short, friendly message.

Customer name: ${customerName}
Message type: ${messageType}
Context: ${context || "No extra context"}

Rules:
- Keep it natural and human.
- Keep it short.
- Do not sound robotic.
- Do not overuse emojis.
- Use Ghana-friendly tone.
- Output only the message.
`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 180,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error?.message || "AI generation failed" },
      { status: 500 }
    );
  }

  const message = data.choices?.[0]?.message?.content || "";

  return NextResponse.json({ message });
}