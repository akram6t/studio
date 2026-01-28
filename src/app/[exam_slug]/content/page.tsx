"use client";

import { useParams } from 'next/navigation';
import { getContent } from '@/lib/api';
import { FileText, MonitorPlay, BookOpen, Download } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ContentPage() {
  const params = useParams();
  const content = getContent(params.exam_slug as string);

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-10 w-10 text-red-500" />;
      case 'ppt': return <MonitorPlay className="h-10 w-10 text-orange-500" />;
      default: return <BookOpen className="h-10 w-10 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-bold">Study Resources</h2>
        <p className="text-muted-foreground text-sm">Curated PDFs, presentations, and blog posts.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {content.map(item => (
          <div key={item.id} className="group cursor-pointer">
            <Card className="aspect-[3/4] relative overflow-hidden border-none shadow-lg bg-white dark:bg-card group-hover:-translate-y-2 transition-all duration-300 flex flex-col">
              {/* Spine Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/10 z-10" />
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/20 z-10" />
              
              <CardContent className="p-0 flex-grow flex flex-col">
                <div className="flex-grow flex items-center justify-center bg-muted/30 p-8">
                  <div className="p-6 bg-white dark:bg-card rounded-2xl shadow-sm transform group-hover:scale-110 transition-transform duration-500">
                    {getIcon(item.type)}
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-card-foreground/5 flex flex-col gap-1 border-t">
                  <h3 className="font-bold text-sm leading-tight line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.type}</span>
                    <Download className="h-3 w-3 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
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
