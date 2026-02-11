
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const ADMIN_EMAIL = "developeruniqe@gmail.com";

export default function AuthCallbackPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      
      if (email === ADMIN_EMAIL) {
        router.push("/admin");
      } else {
        router.push("/exams");
      }
    }
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
