import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSafeIp, hashIp } from "@/lib/security";

const LIMIT = 60;
const WINDOW_SECONDS = 60;

type RateLimitResult =
  | {
      allowed: true;
      headers: Headers;
      identifier: string;
    }
  | {
      allowed: false;
      response: NextResponse;
      identifier: string;
    };

async function getRateLimitIdentifier(request: Request): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id) {
    return `user:${user.id}`;
  }

  const ip = getSafeIp(request);
  return `ip:${hashIp(ip)}`;
}

export async function checkRateLimit(request: Request): Promise<RateLimitResult> {
  try {
    const identifier = await getRateLimitIdentifier(request);

    const now = Math.floor(Date.now() / 1000);
    const windowId = Math.floor(now / WINDOW_SECONDS);
    const resetAt = (windowId + 1) * WINDOW_SECONDS;

    const key = `rate-limit:${identifier}:${windowId}`;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    const remaining = Math.max(LIMIT - count, 0);

    const headers = new Headers();
    headers.set("X-RateLimit-Limit", String(LIMIT));
    headers.set("X-RateLimit-Remaining", String(remaining));
    headers.set("X-RateLimit-Reset", String(resetAt));

    if (count > LIMIT) {
      return {
        allowed: false,
        identifier,
        response: NextResponse.json(
          {
            error: "Too many requests. Please try again shortly.",
          },
          {
            status: 429,
            headers,
          }
        ),
      };
    }

    return {
      allowed: true,
      headers,
      identifier,
    };
  } catch (error) {
    console.error("[RATE_LIMIT_FAIL_OPEN]", error);

    const headers = new Headers();
    headers.set("X-RateLimit-Limit", String(LIMIT));
    headers.set("X-RateLimit-Remaining", String(LIMIT));
    headers.set(
      "X-RateLimit-Reset",
      String(Math.floor(Date.now() / 1000) + WINDOW_SECONDS)
    );

    return {
      allowed: true,
      headers,
      identifier: "fail-open",
    };
  }
}

export function withRateLimit(
  handler: (request: Request) => Promise<Response>
) {
  return async function rateLimitedHandler(request: Request) {
    const result = await checkRateLimit(request);

    if (!result.allowed) {
      return result.response;
    }

    const response = await handler(request);

    result.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  };
}