import "server-only";
import { env } from "@/lib/env";

export async function sendEmail(input: { to: string; subject: string; html: string }): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portal Paladare <onboarding@resend.dev>",
      to: [input.to],
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend respondeu HTTP ${res.status}: ${body}`);
  }
}
