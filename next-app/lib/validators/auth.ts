import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  confirmPassword: z.string().min(8, "Password confirmation is required")
});

export const linkJexpanelSchema = z.object({
  jexpanelUserId: z
    .string()
    .min(3, "Jexpanel user ID must be at least 3 characters")
    .max(64, "Jexpanel user ID must be at most 64 characters")
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type LinkJexpanelValues = z.infer<typeof linkJexpanelSchema>;
