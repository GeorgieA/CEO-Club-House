"use client";

import { FormEvent, useState } from "react";

export default function NewsletterForm() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
        className="rounded-[10px] bg-ink px-4 py-3 text-[0.95rem] font-bold text-accent transition-opacity hover:opacity-90"
      >
        Kostenlos abonnieren
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
