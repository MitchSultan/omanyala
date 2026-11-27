import { contactCopy, enquiryTypes } from "@/data/contact";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_REQUEST_BYTES = 16_384;
const rateLimitBuckets = new Map<
  string,
  { count: number; resetAt: number }
>();
// Process-local protection for this preview; use shared storage in a scaled deployment.
const validEnquiryTypes: ReadonlySet<string> = new Set(
  enquiryTypes.map(({ value }) => value)
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeSingleLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
}

function sanitizeMessage(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim();
}

function getClientKey(request: Request): string {
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();

  return (
    request.headers.get("x-real-ip")?.trim() ||
    forwardedFor ||
    "unknown-client"
  );
}

function getRateLimitResetAt(clientKey: string, now: number): number | null {
  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(key);
  }

  const bucket = rateLimitBuckets.get(clientKey);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    if (rateLimitBuckets.size > 2_000) {
      const oldestKey = rateLimitBuckets.keys().next().value;
      if (oldestKey) rateLimitBuckets.delete(oldestKey);
    }

    return null;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS ? bucket.resetAt : null;
}

function mockSuccess() {
  return Response.json({ ok: true, message: contactCopy.apiSuccessMessage });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return Response.json(
      { ok: false, message: "The submitted form is too large." },
      { status: 413 }
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json(
      { ok: false, message: "Submit the form using the supported format." },
      { status: 415 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: "The form submission could not be read." },
      { status: 400 }
    );
  }

  if (!isRecord(payload)) {
    return Response.json(
      { ok: false, message: "The form submission is invalid." },
      { status: 400 }
    );
  }

  if (sanitizeSingleLine(payload.website)) return mockSuccess();

  const now = Date.now();
  const resetAt = getRateLimitResetAt(getClientKey(request), now);
  if (resetAt !== null) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - now) / 1000));
    return Response.json(
      {
        ok: false,
        message: "Too many attempts. Please wait before trying again.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const fullName = sanitizeSingleLine(payload.fullName);
  const email = sanitizeSingleLine(payload.email).toLowerCase();
  const phone = sanitizeSingleLine(payload.phone);
  const organisation = sanitizeSingleLine(payload.organisation);
  const enquiryType = sanitizeSingleLine(payload.enquiryType);
  const message = sanitizeMessage(payload.message);
  const errors: Record<string, string> = {};

  if (!fullName) errors.fullName = contactCopy.validation.fullNameRequired;
  else if (fullName.length > 120) {
    errors.fullName = contactCopy.validation.fullNameTooLong;
  }

  if (!email) errors.email = contactCopy.validation.emailRequired;
  else if (email.length > 254) {
    errors.email = contactCopy.validation.emailTooLong;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = contactCopy.validation.emailInvalid;
  }

  if (phone.length > 40) errors.phone = contactCopy.validation.phoneTooLong;
  if (organisation.length > 120) {
    errors.organisation = contactCopy.validation.organisationTooLong;
  }

  if (!validEnquiryTypes.has(enquiryType)) {
    errors.enquiryType = contactCopy.validation.enquiryTypeRequired;
  }

  if (!message) errors.message = contactCopy.validation.messageRequired;
  else if (message.length < 20) {
    errors.message = contactCopy.validation.messageTooShort;
  } else if (message.length > 5_000) {
    errors.message = contactCopy.validation.messageTooLong;
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      {
        ok: false,
        message: "Review the highlighted fields and try again.",
        errors,
      },
      { status: 400 }
    );
  }

  // TODO: Connect a verified email provider before accepting real enquiries.
  // No contact data is stored or sent by this preview route.
  return mockSuccess();
}
