"use client";

import { useParams, useRouter } from 'next/navigation';
import { getContent, ContentItem } from '@/lib/api';
import { useState, useEffect } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Printer, 
  Share2, 
  Lock, 
  AlertCircle,
  Download,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SecureViewer() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.content_id as string;
  
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const found = getContent('all').find(c => c.id === contentId);
    if (found) {
      setContent(found);
    }
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [contentId]);

  useEffect(() => {
    // Global protection handlers
    const handleContext = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common print/save/inspect shortcuts
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'u', 'i'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    const handleSelect = (e: Event) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContext);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelect);

    return () => {
      document.removeEventListener('contextmenu', handleContext);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelect);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">
          Initializing Secure Environment...
        </p>
      </div>
    );
  }

  if (!content) return (
    <div className="h-screen flex items-center justify-center bg-background p-6 text-center">
      <div className="space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Document Not Found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-body select-none overflow-hidden">
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-sm backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <h1 className="font-headline font-bold text-sm md:text-base line-clamp-1">{content.title}</h1>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Protected Resource
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
        "flex-grow relative overflow-hidden",
        content.type === 'pdf' ? "bg-slate-200" : "bg-slate-50 dark:bg-slate-900/50"
      )}>
        {content.type === 'pdf' ? (
          <div className="w-full h-full relative flex flex-col items-center">
            {/* The Document Viewport */}
            <div className="w-full max-w-5xl h-full bg-white shadow-2xl relative">
              <iframe 
                src={`${content.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="w-full h-full border-none pointer-events-auto"
                title={content.title}
              />
              
              {/* Floating Security Watermark Layer */}
              <div className="absolute inset-0 pointer-events-none z-20 flex flex-wrap items-center justify-center opacity-[0.04] overflow-hidden rotate-[-25deg] select-none scale-125">
                {Array.from({ length: 60 }).map((_, i) => (
                  <span key={i} className="text-2xl font-black p-12 md:p-20 uppercase whitespace-nowrap text-foreground">
                    Logical Book Restricted Access
                  </span>
                ))}
              </div>
            </div>

            {/* Guard Banner */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full flex items-center gap-3 text-white shadow-2xl">
              <div className="h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <Lock className="h-3 w-3" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest">Secure Reader Active • Copying Prohibited</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto p-4 md:p-12">
            <div className="w-full max-w-4xl mx-auto">
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
                    content={content.contentMdx || '# Content Unavailable\n\nPlease check back later.'} 
                    className="prose-base md:prose-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
