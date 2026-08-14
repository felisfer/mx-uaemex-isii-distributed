export type JwtPayload = {
  sub?: string;
  exp?: number;
  [key: string]: unknown;
};

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const segments = token.split(".");
    if (segments.length < 2) {
      return null;
    }
    const payload = segments[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(normalized, "base64").toString("utf-8");
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}
