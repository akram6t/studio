
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, User, BookOpen, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/exams" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight hidden sm:inline-block">ExamPrep</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/exams" className="transition-colors hover:text-accent">Exams</Link>
            <Link href="/practice" className="transition-colors hover:text-accent">Practice</Link>
            <Link href="#" className="transition-colors hover:text-accent">Courses</Link>
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
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
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
                Navigation links for exams, practice materials, and account management.
              </SheetDescription>
              <div className="flex flex-col gap-6 mt-10">
                <Link href="/exams" className="text-lg font-medium">Exams</Link>
                <Link href="/practice" className="text-lg font-medium">Practice</Link>
                <Link href="#" className="text-lg font-medium">Courses</Link>
                <hr />
                <Link href="/login" className="text-lg font-medium">Log In</Link>
                <Link href="/signup" className="text-lg font-medium">Sign Up</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
