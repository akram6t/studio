"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Routes that should NOT show the standard Navbar/Footer (Immersive modes)
  const isImmersive = pathname?.startsWith('/test-session') || 
                      pathname?.startsWith('/quiz-session') || 
                      pathname?.startsWith('/viewer');

  if (isImmersive) {
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
