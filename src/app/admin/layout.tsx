"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', newMode);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8" />
              <div className="hidden md:flex h-9 items-center gap-2 rounded-lg bg-muted/50 px-3 ring-1 ring-border">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Global search..." 
                  className="bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 w-48 lg:w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {!mounted ? (
                  <Moon className="h-5 w-5" />
                ) : isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive" />
              </Button>
              
              <div className="h-8 w-px bg-border mx-1" />
              
              <div className="flex items-center gap-3 pl-1">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold leading-none">Admin User</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">Super Administrator</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                  A
                </div>
              </div>
            </div>
          </header>

          <main className="flex-grow p-4 md:p-8 bg-muted/20 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}