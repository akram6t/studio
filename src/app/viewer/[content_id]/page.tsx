"use client";

import { useParams, useRouter } from 'next/navigation';
import { getContent } from '@/lib/api';
import { useState, useEffect } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Printer, 
  Share2, 
  Maximize2, 
  Lock, 
  FileText,
  AlertCircle,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function SecureViewer() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.content_id as string;
  
  const content = getContent('all').find(c => c.id === contentId);

  useEffect(() => {
    // Global protection handlers
    const handleContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContext);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common print/save/inspect shortcuts
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'u', 'i'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContext);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!content) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
      <div className="space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Content Not Found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-body select-none overflow-hidden">
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-sm backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <h1 className="font-headline font-bold text-sm md:text-base line-clamp-1">{content.title}</h1>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Secure Reader Mode
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg gap-2 text-xs font-bold opacity-50 cursor-not-allowed" disabled>
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg gap-2 text-xs font-bold opacity-50 cursor-not-allowed" disabled>
              <Download className="h-3.5 w-3.5" /> Download
            </Button>
          </div>
          <Button className="rounded-lg px-4 md:px-6 font-bold shadow-lg text-xs md:text-sm h-9 md:h-10">
            <Share2 className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Share</span>
          </Button>
        </div>
      </header>

      <main className={cn(
        "flex-grow flex flex-col items-center overflow-auto scroll-smooth",
        content.type === 'pdf' ? "p-4 md:p-8" : "p-4 md:p-8"
      )}>
        {content.type === 'pdf' ? (
          <div className="w-full max-w-5xl h-fit flex flex-col items-center gap-6 relative">
            
            {/* Security Overlay / Watermark */}
            <div className="fixed inset-0 pointer-events-none z-20 flex flex-wrap items-center justify-center opacity-[0.04] overflow-hidden rotate-[-25deg] select-none scale-125">
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} className="text-3xl font-black p-16 uppercase whitespace-nowrap text-foreground">
                  Logical Book Secure Stream • Protected Session
                </span>
              ))}
            </div>

            {/* Page Image Stream (Backend Simulated) */}
            <div className="flex flex-col gap-4 w-full shadow-2xl rounded-xl overflow-hidden bg-slate-200 p-4 border border-border/50">
              {content.pages?.map((pageUrl, idx) => (
                <div 
                  key={idx} 
                  className="relative w-full aspect-[1/1.41] bg-white shadow-md border rounded-sm overflow-hidden select-none pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img 
                    src={pageUrl} 
                    alt={`Page ${idx + 1}`}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                  <div className="absolute top-4 right-4 bg-black/10 px-2 py-1 rounded text-[10px] font-bold text-black/40 backdrop-blur-sm">
                    Page {idx + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Secure Guard Indicator */}
            <div className="fixed bottom-8 left-8 z-30 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 text-white shadow-2xl animate-in slide-in-from-left duration-500">
              <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lock className="h-5 w-5" />
              </div>
              <div className="pr-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Security</p>
                <p className="text-xs font-bold">Image-Stream Encryption Active</p>
              </div>
            </div>

            <div className="py-8 flex flex-col items-center gap-2">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] text-center">
                End of Document Stream
              </p>
              <div className="h-1 w-20 bg-primary/20 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-card overflow-hidden">
              <div className="relative h-64 md:h-96 w-full">
                <img 
                  src={content.thumbnail || `https://picsum.photos/seed/${content.id}/1200/600`} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    {content.type} Article
                  </span>
                  <h2 className="text-3xl md:text-5xl font-headline font-bold mt-4 leading-tight">{content.title}</h2>
                </div>
              </div>
              <CardContent className="p-8 md:p-16">
                <MarkdownRenderer 
                  content={content.contentMdx || '# Coming Soon\n\nThe full article is being prepared by our editorial team.'} 
                  className="prose-base md:prose-lg"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {content.type === 'blog' && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button className="h-14 w-14 rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-transform">
            <Maximize2 className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}