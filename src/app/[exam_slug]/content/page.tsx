"use client";

import { useParams } from 'next/navigation';
import { getContent } from '@/lib/api';
import { FileText, MonitorPlay, BookOpen, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function ContentPage() {
  const params = useParams();
  const content = getContent(params.exam_slug as string);

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
        {content.map(item => (
          <div key={item.id} className="group cursor-pointer">
            <Card className="aspect-[3/4] relative overflow-hidden border-none shadow-sm bg-white dark:bg-card group-hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {/* Spine Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/10 z-10" />
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/20 z-10" />
              
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
                </div>
                
                <div className="p-3 bg-white dark:bg-card flex flex-col gap-2 border-t relative z-20">
                  <h3 className="font-bold text-sm leading-snug line-clamp-2 h-10">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.type}</span>
                    <Download className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
