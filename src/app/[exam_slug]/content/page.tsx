
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
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'ppt': return <MonitorPlay className="h-8 w-8 text-orange-500" />;
      default: return <BookOpen className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-bold">Study Resources</h2>
        <p className="text-muted-foreground text-sm">Curated PDFs, presentations, and blog posts.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.map(item => (
          <Card key={item.id} className="group hover:shadow-md transition-all border-none shadow-sm bg-muted/20">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-white dark:bg-card rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                {getIcon(item.type)}
              </div>
              <h3 className="font-bold mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground uppercase">{item.type} Document</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="ghost" className="w-full gap-2 text-accent hover:text-accent hover:bg-accent/5">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
