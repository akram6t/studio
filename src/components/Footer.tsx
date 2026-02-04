"use client";

import Link from 'next/link';
import { BookOpen, Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const currentYear = 2025;

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-headline font-bold text-xl tracking-tight">ExamPrep</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering aspirants with the best-in-class study materials, mock tests, and expert guidance to crack competitive exams with confidence.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Youtube className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-headline font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/exams" className="text-sm text-muted-foreground hover:text-primary transition-colors">Popular Exams</Link></li>
              <li><Link href="/practice" className="text-sm text-muted-foreground hover:text-primary transition-colors">Practice Dashboard</Link></li>
              <li><Link href="/books" className="text-sm text-muted-foreground hover:text-primary transition-colors">Study Materials</Link></li>
              <li><Link href="/quizzes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Daily Quizzes</Link></li>
              <li><Link href="/previous-papers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Solved Papers</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-headline font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Team</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="font-headline font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@examprep.com</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Knowledge Hub, New Delhi, India</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-2">Subscribe to Newsletter</h4>
              <div className="flex gap-2">
                <Input placeholder="Your email" className="h-9 text-xs" />
                <Button size="sm">Join</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {currentYear} ExamPrep. All rights reserved. Designed for serious aspirants.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link>
            <Link href="#" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors">Sitemap</Link>
            <Link href="#" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
