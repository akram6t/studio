"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * A client-side wrapper that conditionally renders the public Navbar and Footer.
 * It excludes them from:
 * - Admin routes (/admin)
 * - Active exam sessions (/practice/[subject]/[topic]/[set])
 */
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path is an admin route
  const isAdmin = pathname?.startsWith('/admin');
  
  // Check if current path is a live exam/practice set
  // Pattern: /practice/[subject_id]/[topic_id]/[set_id]
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const isExamSession = pathParts[0] === 'practice' && pathParts.length === 4;

  // If either admin or exam session, don't show standard layout
  if (isAdmin || isExamSession) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
