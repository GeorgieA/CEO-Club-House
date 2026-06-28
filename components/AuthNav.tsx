"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthNav() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .maybeSingle();
      setUsername(data?.username ?? null);
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        loadProfile(user.id);
      } else {
        setUsername(null);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-9 w-20" aria-hidden />;
  }

  if (username) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profil"
          className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-2.5 text-sm font-bold text-accent transition-opacity hover:opacity-90"
        >
          @{username}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-2.5 text-sm font-bold text-accent transition-opacity hover:opacity-90"
      >
        Anmelden
      </Link>
    </div>
  );
}
