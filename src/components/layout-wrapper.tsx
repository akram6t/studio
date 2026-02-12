"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * A client-side wrapper that conditionally renders the public Navbar and Footer.
 * Reverted to static imports to ensure hydration stability while maintaining high performance.
 */
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // High-performance route exclusion check
  const isExcluded = pathname?.startsWith('/admin') || 
                     pathname?.startsWith('/test-session') || 
                     pathname?.startsWith('/quiz-session') || 
                     pathname?.startsWith('/viewer');

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
