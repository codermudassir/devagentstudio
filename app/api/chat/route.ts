import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const supabase = await createClient();
  const adminClient = createAdminClient(); // Use admin client for system-level logs

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Fetch AI Configuration from Database
  const { data: dbConfigs } = await adminClient
    .from("api_keys_config")
    .select("*")
    .eq("is_active", true)
    .limit(1);

  let activeConfig = dbConfigs?.[0];

  // Hand-off to ENV if no DB config exists yet (migration support)
  const geminiKey = activeConfig?.provider === 'gemini' ? activeConfig.api_key : process.env.GEMINI_API_KEY;
  const openRouterKey = activeConfig?.provider === 'openrouter' ? activeConfig.api_key : process.env.OPENROUTER_API_KEY;
  const useGemini = activeConfig ? activeConfig.provider === 'gemini' : !!geminiKey;
  const modelName = activeConfig?.model_name || (useGemini ? (process.env.GEMINI_MODEL ?? "gemini-1.5-flash") : (process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash:free"));

  if (!geminiKey && !openRouterKey) {
    return NextResponse.json(
      { error: "AI service not configured. Please set up API keys in Admin Panel." },
      { status: 500 }
    );
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

  const { message, agentId, systemPrompt, conversationHistory = [] } = validation.data!;

  // 2. Check user credits and account status
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("credits, status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }

  if (profile.status !== 'active') {
    return NextResponse.json({ error: `Your account is ${profile.status}. Please contact support.` }, { status: 403 });
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

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;

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

    return fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterKey}`,
      },
      body: JSON.stringify({
        model: modelName,
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
      return NextResponse.json({ error: "Failed to get AI response" }, { status: 502 });
    }

    const data = await res.json();
    let text: string;
    let promptTokens = 0;
    let completionTokens = 0;

    if (useGemini) {
      text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response.";
      promptTokens = data.usageMetadata?.promptTokenCount || 0;
      completionTokens = data.usageMetadata?.candidatesTokenCount || 0;
    } else {
      text = data.choices?.[0]?.message?.content?.trim() ?? "I couldn't generate a response.";
      promptTokens = data.usage?.prompt_tokens || 0;
      completionTokens = data.usage?.completion_tokens || 0;
    }

    // 3. Deduct credits and log audited changes
    const creditsToDeduct = 1; // Basic rule: 1 credit per message
    const newCredits = Math.max(0, profile.credits - creditsToDeduct);

    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", user.id);

    if (!updateError) {
      // 4. Log AI usage
      await adminClient.from("ai_usage_logs").insert({
        user_id: user.id,
        agent_id: agentId,
        model: modelName,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        credits_used: creditsToDeduct,
      });

      // 5. Log Credit deduction
      await adminClient.from("credit_logs").insert({
        user_id: user.id,
        amount: -creditsToDeduct,
        balance_after: newCredits,
        reason: `AI Chat using agent: ${agentId}`,
      });
    }

    return NextResponse.json({
      response: text,
      success: true,
      remainingCredits: newCredits
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
