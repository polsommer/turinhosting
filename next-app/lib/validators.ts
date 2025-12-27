import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(2, "Company must be at least 2 characters")
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(2, "Company must be at least 2 characters").optional(),
  password: z.string().min(8, "Password must be at least 8 characters")
});
