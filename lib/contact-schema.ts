import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter at least two characters.").max(120, "Please keep your name under 120 characters."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(40, "Please keep the phone number under 40 characters.").optional().or(z.literal("")),
  service: z.string().max(80).optional().or(z.literal("")),
  items: z.array(z.object({ service: z.string().max(80), sub: z.string().max(80) })).max(32).default([]),
  message: z.string().trim().min(10, "Please add a little more detail (at least 10 characters). ").max(5000, "Please keep your message under 5,000 characters."),
  website: z.string().max(0, "Invalid submission.").optional(),
  turnstileToken: z.string().max(4096).optional().or(z.literal("")),
});

export type ContactValues = z.input<typeof contactSchema>;
