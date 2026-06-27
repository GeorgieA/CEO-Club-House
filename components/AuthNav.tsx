"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
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

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUsername(null);
    router.refresh();
    router.push("/");
  }

  if (loading) {
    return <div className="hidden h-9 w-20 md:block" aria-hidden />;
  }

  if (username) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link
          href="/profil"
          className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-2.5 text-sm font-bold text-accent transition-opacity hover:opacity-90"
        >
          @{username}
        </Link>
        {pathname !== "/profil" && (
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-[#f1f5f9] hover:text-ink"
          >
            Abmelden
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link
        href="/login"
        className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-2.5 text-sm font-bold text-accent transition-opacity hover:opacity-90"
      >
        Anmelden
      </Link>
    </div>
  );
}
