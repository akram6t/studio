"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { syncUser } from "@/lib/api";

export default function AuthCallbackPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function init() {
      if (isLoaded && user) {
        // Sync user with MongoDB
        const dbUser = await syncUser(user);
        
        if (dbUser.role === 'admin') {
          router.push("/admin");
        } else {
          router.push("/exams");
        }
      }
    }
    init();
  }, [isLoaded, user, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">
        Verifying Account...
      </p>
    </div>
  );
}