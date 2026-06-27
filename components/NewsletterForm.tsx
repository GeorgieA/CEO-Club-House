"use client";

import { FormEvent, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function NewsletterForm() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      setMessage({
        type: "error",
        text: "Bitte gib eine gültige E-Mail-Adresse ein.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const supabase = getSupabase();
    if (!supabase) {
      setMessage({
        type: "success",
        text: "✓ Danke! Dein Briefing kommt ab morgen um 7 Uhr.",
      });
      form.reset();
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("subscribers")
      .insert({ email });

    setLoading(false);

    if (error) {
      // 23505 = unique_violation (E-Mail bereits angemeldet)
      if (error.code === "23505") {
        setMessage({
          type: "success",
          text: "✓ Du bist bereits angemeldet – dein Briefing ist unterwegs.",
        });
        form.reset();
        return;
      }
      setMessage({
        type: "error",
        text: "Etwas ist schiefgelaufen. Bitte versuch es später erneut.",
      });
      return;
    }

    setMessage({
      type: "success",
      text: "✓ Danke! Dein Briefing kommt ab morgen um 7 Uhr.",
    });
    form.reset();
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        name="email"
        placeholder="deine@email.de"
        aria-label="E-Mail-Adresse"
        required
        className="rounded-[10px] border border-line bg-white px-4 py-3 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_rgba(255,90,31,0.15)] dark:bg-[#0f0a24]"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-[10px] bg-ink px-4 py-3 text-[0.95rem] font-bold text-accent transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Wird angemeldet …" : "Kostenlos abonnieren"}
      </button>
      {message && (
        <p
          role="alert"
          className={`text-[0.85rem] font-semibold ${
            message.type === "success" ? "text-[#15803d]" : "text-[#dc2626]"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
