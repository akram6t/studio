"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

/**
 * Redirect page to the new Universal Test Conduction route.
 */
export default function LegacyPracticeRedirect() {
  const params = useParams();
  const router = useRouter();
  const setId = params.set_id as string;

  useEffect(() => {
    // Migrate to universal test-session route
    router.replace(`/test-session/${setId}`);
  }, [setId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse font-headline font-bold text-primary">
        Initializing Conduction Engine...
      </div>
    </div>
  );
}
