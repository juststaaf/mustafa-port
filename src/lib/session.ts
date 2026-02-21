import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "studio_session";

function getSessionSecret() {
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("STUDIO_SESSION_SECRET is required in production.");
  }
  return secret || "local-dev-session-secret";
}

function getExpectedToken() {
  return createHash("sha256").update(`studio:${getSessionSecret()}`).digest("hex");
}

export async function isStudioAuthenticated() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return cookieValue === getExpectedToken();
}

export async function setStudioSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, getExpectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function clearStudioSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
