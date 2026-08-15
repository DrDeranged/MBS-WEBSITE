import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { logger } from "../lib/logger";

const router = Router();

// ── In-memory rate limiter: 10 req/min per IP ─────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

// Prune stale entries every 5 min so the map doesn't grow unbounded
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

// ── System prompt (verbatim behavior contract) ────────────────────────────
const SYSTEM_PROMPT =
  "You are MbsAssist on the My Business Solutions website. MBS is a business financing brokerage: one application, multiple lender options across six products (term loans, lines of credit, revenue-based financing, equipment financing, SBA loans, invoice factoring). You answer visitor questions about how the process works, what documents are typically needed (recent business bank statements, basic business info), and general education about funding types. HARD RULES: never quote rates, amounts, approval odds, or timelines as promises; never collect SSN or sensitive data in chat; for anything account- or application-specific, direct them to apply at https://app.my-business-solutions.com/apply or email support@my-business-solutions.com. Keep answers under 120 words, warm and plain-spoken. When a visitor seems ready, invite them to apply.";

// ── Anthropic client (Replit AI Integration env vars) ────────────────────
const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY ?? "placeholder",
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

// ── POST /api/assist ──────────────────────────────────────────────────────
router.post("/assist", async (req, res) => {
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0].trim() ??
    req.ip ??
    "unknown";

  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many requests. Please wait a minute and try again." });
    return;
  }

  const { messages } = req.body as { messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  // Validate message shape and strip anything unsafe
  const chatMessages: Anthropic.MessageParam[] = [];
  for (const m of messages) {
    if (
      m &&
      typeof m === "object" &&
      (m as Record<string, unknown>).role === "user" || (m as Record<string, unknown>).role === "assistant"
    ) {
      const role = (m as Record<string, unknown>).role as "user" | "assistant";
      const content = String((m as Record<string, unknown>).content ?? "").slice(0, 4000);
      if (content) chatMessages.push({ role, content });
    }
  }

  if (chatMessages.length === 0) {
    res.status(400).json({ error: "No valid messages provided" });
    return;
  }

  // Set SSE headers before anything can fail
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  try {
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: chatMessages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta" &&
        event.delta.text
      ) {
        res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    logger.error({ err }, "MbsAssist stream error");
    res.write(`data: ${JSON.stringify({ error: "Something went wrong. Please try again." })}\n\n`);
    res.end();
  }
});

export default router;
