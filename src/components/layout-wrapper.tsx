"use client";

import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';

// Optimization: Dynamically import Navbar and Footer to reduce initial hydration size
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

/**
 * A client-side wrapper that conditionally renders the public Navbar and Footer.
 * Optimized to use usePathname efficiently.
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
