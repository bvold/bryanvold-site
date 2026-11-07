import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { env } from "cloudflare:workers";
import { siteConfig } from "../config/site";

const FROM_ADDRESS = "website@bryanvold.com";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Collapse whitespace/newlines so user input can't break email headers.
const oneLine = (value: string) => value.replace(/[\r\n\t]+/g, " ").trim();

async function verifyTurnstile(token: string, ip: string | null) {
  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET_KEY);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z
        .string({ message: "Please enter your name." })
        .trim()
        .min(1, "Please enter your name.")
        .max(100, "Please keep your name under 100 characters."),
      email: z
        .string({ message: "Please enter your email address." })
        .trim()
        .email("Please enter a valid email address.")
        .max(254),
      reason: z
        .string()
        .refine((r) => siteConfig.contact.reasons.includes(r), {
          message: "Please choose a reason.",
        }),
      message: z
        .string({ message: "Please write a message." })
        .trim()
        .min(10, "Please write a little more (at least 10 characters).")
        .max(5000, "Please keep your message under 5,000 characters."),
      // Honeypot: hidden from people, often filled in by bots.
      website: z.string().nullish(),
      "cf-turnstile-response": z
        .string({ message: "Please complete the verification check." })
        .min(1, "Please complete the verification check."),
    }),
    handler: async (input, context) => {
      // Pretend success for bots so they don't retry.
      if (input.website) return { ok: true };

      const human = await verifyTurnstile(
        input["cf-turnstile-response"],
        context.request.headers.get("CF-Connecting-IP"),
      );
      if (!human) {
        throw new ActionError({
          code: "FORBIDDEN",
          message:
            "The verification check didn't pass. Please refresh the page and try again.",
        });
      }

      const name = oneLine(input.name);
      const email = oneLine(input.email);
      const reason = oneLine(input.reason);

      try {
        await env.SEND_EMAIL.send({
          from: FROM_ADDRESS,
          to: env.CONTACT_TO,
          replyTo: email,
          subject: `[bryanvold.com] ${reason} — ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Reason: ${reason}`,
            "",
            input.message,
            "",
            "—",
            "Sent from the contact form at https://bryanvold.com/contact/",
            "Reply to this email to respond directly.",
          ].join("\n"),
        });
      } catch (err) {
        // Log fields explicitly; Workers Logs may show only the stack otherwise.
        const e = err as { name?: string; message?: string; code?: string };
        console.error(
          `Contact form email failed: ${e?.name ?? "Error"}` +
            ` code=${e?.code ?? "n/a"} message=${e?.message ?? String(err)}` +
            ` to=${env.CONTACT_TO ? "set" : "MISSING"}`,
        );
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Sorry, your message couldn't be sent right now. Please try again in a little while.",
        });
      }

      return { ok: true };
    },
  }),
};
