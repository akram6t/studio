"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * A client-side wrapper that conditionally renders the public Navbar and Footer.
 * It excludes them from:
 * - Admin routes (/admin)
 * - Active test sessions (/test-session/[id])
 */
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path is an admin route
  const isAdmin = pathname?.startsWith('/admin');
  
  // Check if current path is a live test session (Universal Route)
  const isTestSession = pathname?.startsWith('/test-session');

  // If either admin or test session, don't show standard layout
  if (isAdmin || isTestSession) {
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
