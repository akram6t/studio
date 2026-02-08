
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * A client-side wrapper that conditionally renders the public Navbar and Footer.
 * It excludes them from:
 * - Admin routes (/admin)
 * - Active test sessions (/test-session/[id])
 * - Active quiz sessions (/quiz-session/[id])
 * - Secure content viewer (/viewer/[id])
 */
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path is an admin route
  const isAdmin = pathname?.startsWith('/admin');
  
  // Check if current path is a live test session (Universal Route)
  const isTestSession = pathname?.startsWith('/test-session');

  // Check if current path is a live quiz session
  const isQuizSession = pathname?.startsWith('/quiz-session');

  // Check if current path is the secure viewer
  const isViewer = pathname?.startsWith('/viewer');

  // If either admin, test session, quiz session, or viewer, don't show standard layout
  if (isAdmin || isTestSession || isQuizSession || isViewer) {
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
