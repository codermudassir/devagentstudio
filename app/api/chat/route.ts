import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_MESSAGE_LENGTH = 10000;
const MAX_SYSTEM_PROMPT_LENGTH = 5000;
const MAX_HISTORY_LENGTH = 50;
const MAX_HISTORY_MESSAGE_LENGTH = 10000;

const ALLOWED_AGENT_IDS = ["upwork", "analyst", "code-reviewer", "assistant", "writer"];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  agentId: string;
  systemPrompt: string;
  conversationHistory?: ChatMessage[];
}

function validateInput(body: unknown): { valid: boolean; error?: string; data?: ChatRequestBody } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const b = body as Record<string, unknown>;

  if (!b.message || typeof b.message !== "string") {
    return { valid: false, error: "Message is required and must be a string" };
  }
  if (b.message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message too long. Max ${MAX_MESSAGE_LENGTH} characters` };
  }

  if (!b.agentId || typeof b.agentId !== "string") {
    return { valid: false, error: "Agent ID is required" };
  }
  if (!ALLOWED_AGENT_IDS.includes(b.agentId)) {
    return { valid: false, error: "Invalid agent ID" };
  }

  if (!b.systemPrompt || typeof b.systemPrompt !== "string") {
    return { valid: false, error: "System prompt is required" };
  }
  if (b.systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
    return { valid: false, error: `System prompt too long. Max ${MAX_SYSTEM_PROMPT_LENGTH} characters` };
  }

  const history = b.conversationHistory;
  if (history !== undefined) {
    if (!Array.isArray(history)) {
      return { valid: false, error: "Conversation history must be an array" };
    }
    if (history.length > MAX_HISTORY_LENGTH) {
      return { valid: false, error: `Too many messages. Max ${MAX_HISTORY_LENGTH}` };
    }
    for (let i = 0; i < history.length; i++) {
      const msg = history[i];
      if (!msg || typeof msg !== "object") return { valid: false, error: `Invalid message at ${i}` };
      if (!["user", "assistant"].includes((msg as ChatMessage).role)) {
        return { valid: false, error: `Invalid role at ${i}` };
      }
      if (typeof (msg as ChatMessage).content !== "string") {
        return { valid: false, error: `Invalid content at ${i}` };
      }
      if ((msg as ChatMessage).content.length > MAX_HISTORY_MESSAGE_LENGTH) {
        return { valid: false, error: `Message at ${i} too long` };
      }
    }
  }

  return {
    valid: true,
    data: {
      message: (b.message as string).trim(),
      agentId: b.agentId as string,
      systemPrompt: (b.systemPrompt as string).trim(),
      conversationHistory: (b.conversationHistory as ChatMessage[] | undefined) ?? [],
    },
  };
}

export async function POST(request: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const useGemini = !!geminiKey;

  if (!geminiKey && !openRouterKey) {
    return NextResponse.json(
      { error: "AI service not configured. Set GEMINI_API_KEY or OPENROUTER_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateInput(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { message, systemPrompt, conversationHistory = [] } = validation.data!;

  // Check user credits
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }

  if (profile.credits <= 0) {
    return NextResponse.json(
      { error: "Insufficient credits. Please upgrade your plan to continue chatting.", code: "INSUFFICIENT_CREDITS" },
      { status: 403 }
    );
  }

  const makeGeminiRequest = () => {
    const historyText = conversationHistory
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    const fullPrompt = historyText
      ? `${systemPrompt}\n\n--- Previous conversation ---\n${historyText}\n\n--- New message ---\nUser: ${message}`
      : `${systemPrompt}\n\nUser: ${message}`;

    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

    return fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    });
  };

  const makeOpenRouterRequest = () => {
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const model = process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash:free";

    return fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });
  };

  const makeRequest = useGemini ? makeGeminiRequest : makeOpenRouterRequest;

  try {
    let res = await makeRequest();

    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 5000));
      res = await makeRequest();
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("AI API error:", res.status, errText);

      if (res.status === 429) {
        return NextResponse.json(
          { error: "AI rate limit exceeded. Please wait a minute and try again." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 502 }
      );
    }

    let text: string;
    if (useGemini) {
      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ??
        "I couldn't generate a response. Please try again.";
    } else {
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      text =
        data.choices?.[0]?.message?.content?.trim() ??
        "I couldn't generate a response. Please try again.";
    }

    // Deduct 1 credit on success
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credits: Math.max(0, profile.credits - 1) })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to deduct credits:", updateError.message);
    }

    return NextResponse.json({ response: text, success: true, remainingCredits: profile.credits - 1 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Chat API error:", msg);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
