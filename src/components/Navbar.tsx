
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, BookOpen, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  const isAdmin = user?.primaryEmailAddress?.emailAddress === "developeruniqe@gmail.com";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight hidden sm:inline-block">Logical Book</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/exams" className="transition-colors hover:text-accent font-semibold text-foreground/80 hover:text-foreground">Exams</Link>
            <Link href="/practice" className="transition-colors hover:text-accent font-semibold text-foreground/80 hover:text-foreground">Practice</Link>
            <Link href="/books" className="transition-colors hover:text-accent font-semibold text-foreground/80 hover:text-foreground">Books</Link>
            <Link href="/pricing" className="transition-colors hover:text-accent font-semibold text-foreground/80 hover:text-foreground">Pricing</Link>
            {isAdmin && (
              <Link href="/admin" className="text-primary font-bold hover:underline">Admin</Link>
            )}
          </nav>
        </div>

        <div className="flex-1 max-w-md hidden lg:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for exams..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {!mounted ? (
              <Moon className="h-5 w-5" />
            ) : isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <Link href="/login">
                <Button variant="ghost" className="font-bold">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button className="font-bold shadow-lg shadow-primary/20">Sign Up</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'h-10 w-10 border-2 border-primary/20'
                  }
                }}
              />
            </SignedIn>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation links for exams, practice materials, pricing, and account management.
              </SheetDescription>
              <div className="flex flex-col gap-6 mt-10">
                <Link href="/" className="text-lg font-bold">Home</Link>
                <Link href="/exams" className="text-lg font-bold">Exams</Link>
                <Link href="/practice" className="text-lg font-bold">Practice</Link>
                <Link href="/books" className="text-lg font-bold">Books</Link>
                <Link href="/pricing" className="text-lg font-bold">Pricing</Link>
                {isAdmin && <Link href="/admin" className="text-lg font-bold text-primary">Admin Dashboard</Link>}
                <hr className="opacity-20" />
                <SignedOut>
                  <Link href="/login" className="text-lg font-bold">Log In</Link>
                  <Link href="/signup" className="text-lg font-bold text-accent">Sign Up</Link>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl">
                    <UserButton afterSignOutUrl="/" />
                    <span className="font-bold text-sm">Account Settings</span>
                  </div>
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
