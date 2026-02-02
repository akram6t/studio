"use client";

import { useParams } from 'next/navigation';
import { getContent } from '@/lib/api';
import { FileText, MonitorPlay, BookOpen, Lock, Unlock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function ContentPage() {
  const params = useParams();
  const content = getContent(params.exam_slug as string);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check for premium status
    const handleUnlock = () => setIsUnlocked(true);
    window.addEventListener('premium-unlocked', handleUnlock);
    return () => window.removeEventListener('premium-unlocked', handleUnlock);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'ppt': return <MonitorPlay className="h-5 w-5 text-orange-500" />;
      default: return <BookOpen className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-bold">Study Resources</h2>
        <p className="text-muted-foreground text-sm">Curated PDFs, presentations, and blog posts.</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {content.map(item => {
          const canAccess = item.isFree || isUnlocked;
          
          return (
            <div key={item.id} className="group cursor-pointer">
              <Card className="aspect-[3/4] relative overflow-hidden border-none shadow-sm bg-white dark:bg-card group-hover:-translate-y-1 transition-all duration-300 flex flex-col">
                {/* Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/10 z-10" />
                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/20 z-10" />
                
                {/* Status Badges */}
                <div className="absolute top-0 left-2 z-30">
                  {item.isFree ? (
                    <div className="bg-emerald-500 text-white text-[8px] font-bold px-2 py-1 rounded-b-sm shadow-sm flex items-center gap-1 uppercase tracking-widest">
                      Free
                    </div>
                  ) : (
                    <div className={cn(
                      "text-white text-[8px] font-bold px-2 py-1 rounded-b-sm shadow-sm flex items-center gap-1 uppercase tracking-widest",
                      "bg-amber-600"
                    )}>
                      {isUnlocked ? <Unlock className="h-2 w-2" /> : <Lock className="h-2 w-2" />} 
                      {isUnlocked ? "Unlocked" : "Premium"}
                    </div>
                  )}
                </div>

                <CardContent className="p-0 flex-grow flex flex-col relative">
                  <div className="relative flex-grow bg-muted/30">
                    <Image 
                      src={item.thumbnail || `https://picsum.photos/seed/${item.id}/300/400`} 
                      alt={item.title} 
                      fill 
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      data-ai-hint="book cover"
                    />
                    {/* Overlay for icon type */}
                    <div className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-card/90 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {getIcon(item.type)}
                    </div>
                    
                    {!canAccess && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/10 p-3 rounded-full border border-white/20">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-card flex flex-col gap-2 border-t relative z-20">
                    <h3 className="font-bold text-base leading-snug line-clamp-2 h-12">{item.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.type}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}