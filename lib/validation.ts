import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9_]{3,20}$/,
    "Username: 3–20 Zeichen, nur Kleinbuchstaben, Zahlen und Unterstrich.",
  );

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Bitte gib eine gültige E-Mail-Adresse ein.");

export const passwordSchema = z
  .string()
  .min(8, "Passwort muss mindestens 8 Zeichen haben.");

export const businessUrlSchema = z
  .string()
  .trim()
  .url("Bitte gib eine gültige URL ein (https://…).")
  .max(500)
  .refine(
    (url) => url.startsWith("http://") || url.startsWith("https://"),
    "Nur http:// oder https:// URLs erlaubt.",
  );

export const preferredCategoriesSchema = z.array(
  z.enum(["tech", "ai", "business", "trend"]),
);

export const commentBodySchema = z
  .string()
  .trim()
  .min(1, "Kommentar darf nicht leer sein.")
  .max(2000, "Kommentar darf maximal 2000 Zeichen haben.");

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  username: usernameSchema,
  businessUrl: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine(
      (v) => v === null || businessUrlSchema.safeParse(v).success,
      "Bitte gib eine gültige URL ein (https://…).",
    ),
  preferredCategories: preferredCategoriesSchema,
});

export type Profile = {
  id: string;
  username: string;
  business_url: string | null;
  preferred_categories: string[];
  created_at: string;
  updated_at: string;
};

export type CommentWithProfile = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    business_url: string | null;
  };
};

export type VoteCounts = {
  likes: number;
  dislikes: number;
};
