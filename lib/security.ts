import crypto from "crypto";

export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET;

  if (!secret) {
    throw new Error("IP_HASH_SECRET is missing");
  }

  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

export function getSafeIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");

  const rawIp = cfIp || realIp || forwardedFor?.split(",")[0]?.trim();

  return rawIp || "unknown-ip";
}