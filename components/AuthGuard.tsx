"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        setAllowed(false);
        setChecking(false);
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      setAllowed(true);
      setChecking(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session) {
        setAllowed(true);
        setChecking(false);
      } else {
        setAllowed(false);
        setChecking(false);
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070A] text-sm font-black uppercase tracking-[0.2em] text-[#0094FF]">
        Loading BlueTrail...
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}