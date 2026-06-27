"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validation";
import { getSiteUrl } from "@/lib/site";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signUp(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { email, password, username } = parsed.data;
  const supabase = await createClient();

  const { data: available, error: rpcError } = await supabase.rpc(
    "username_available",
    { name: username },
  );

  if (rpcError) {
    console.error("[auth] username_available:", rpcError.message);
    return { error: "Username-Prüfung fehlgeschlagen. Bitte erneut versuchen." };
  }

  if (!available) {
    return { error: "Dieser Username ist bereits vergeben." };
  }

  const siteUrl = getSiteUrl();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Diese E-Mail ist bereits registriert." };
    }
    return { error: error.message };
  }

  return {
    success:
      "Registrierung erfolgreich! Bitte bestätige deine E-Mail, bevor du dich anmeldest.",
  };
}

export async function signIn(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (
      error.message.toLowerCase().includes("email not confirmed") ||
      error.message.toLowerCase().includes("not confirmed")
    ) {
      return {
        error:
          "Bitte bestätige zuerst deine E-Mail-Adresse. Prüfe dein Postfach.",
      };
    }
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
