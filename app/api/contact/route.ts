import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { services } from "@/content/services";

export const runtime = "nodejs";
const requests = new Map<string, { count: number; resetAt: number }>();
const windowMs = 60_000;
const maxRequests = 5;

async function rateLimited(ip: string) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const response = await fetch(`${redisUrl.replace(/\/$/, "")}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" }, body: JSON.stringify([["INCR", `contact:${ip}`], ["EXPIRE", `contact:${ip}`, 60]]) });
      if (!response.ok) return true;
      const result = await response.json() as { result?: number }[];
      return Number(result[0]?.result ?? 0) > maxRequests;
    } catch { return true; }
  }
  const now = Date.now();
  const entry = requests.get(ip);
  if (!entry || now > entry.resetAt) { requests.set(ip, { count: 1, resetAt: now + windowMs }); return false; }
  entry.count += 1;
  return entry.count > maxRequests;
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!secret || !siteKey) return process.env.NODE_ENV === "development" && !secret && !siteKey;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body, cache: "no-store" });
    const result = await response.json() as { success?: boolean };
    return Boolean(response.ok && result.success);
  } catch { return false; }
}

export async function POST(request: Request) {
  let incoming: unknown;
  try { incoming = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Please send a valid enquiry." }, { status: 400 }); }
  const parsed = contactSchema.safeParse(incoming);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Please check the form fields and try again." }, { status: 400 });
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true });
  const forwarded = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const ip = forwarded.split(",")[0].trim().slice(0, 80) || "unknown";
  if (await rateLimited(ip)) return NextResponse.json({ ok: false, error: "Please wait a minute before sending another enquiry." }, { status: 429 });
  if (!await verifyTurnstile(data.turnstileToken, ip)) return NextResponse.json({ ok: false, error: "Spam protection could not verify this request. Please try again." }, { status: 403 });
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return NextResponse.json({ ok: false, error: "The enquiry service is not configured yet. Please email contact@mhrehman.com." }, { status: 503 });

  const service = services.find((entry) => entry.slug === data.service);
  const items = data.items.map((item) => {
    const parent = services.find((entry) => entry.slug === item.service);
    const sub = parent?.subServices.find((entry) => entry.id === item.sub);
    return `${parent?.title ?? item.service} / ${sub?.label ?? item.sub}`;
  });
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, replyTo: data.email, subject: `Project enquiry from ${data.name}`, text: [
    `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone || "Not provided"}`, `Service: ${service?.title ?? data.service ?? "Not specified"}`, `Selected sub-services: ${items.length ? items.join(", ") : "None"}`, "", data.message,
  ].join("\n") });
  if (error) return NextResponse.json({ ok: false, error: "We couldn’t deliver your enquiry right now. Please email contact@mhrehman.com." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
