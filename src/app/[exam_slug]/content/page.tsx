"use client";

import { useParams } from 'next/navigation';
import { getContent, ContentItem } from '@/lib/api';
import { FileText, BookOpen, Lock, Unlock, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CATEGORIES = [
  "All Resources",
  "PDF Documents",
  "Articles & Blogs"
];

export default function ContentPage() {
  const params = useParams();
  const slug = params.exam_slug as string;
  
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Resources");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getContent(slug);
        setAllContent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();

    const handleUnlock = () => setIsUnlocked(true);
    window.addEventListener('premium-unlocked', handleUnlock);
    return () => window.removeEventListener('premium-unlocked', handleUnlock);
  }, [slug]);

  const filteredContent = useMemo(() => {
    if (selectedCategory === "All Resources") return allContent;
    
    return allContent.filter(item => {
      if (selectedCategory === "PDF Documents") return item.type === 'pdf';
      if (selectedCategory === "Articles & Blogs") return item.type === 'blog';
      return true;
    });
  }, [allContent, selectedCategory]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-rose-500" />;
      case 'blog': return <BookOpen className="h-5 w-5 text-blue-500" />;
      default: return <BookOpen className="h-5 w-5 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-headline font-bold">Study Resources</h2>
        <p className="text-muted-foreground text-xs md:text-sm">Curated PDFs and expert strategy guides.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Dropdown */}
        <div className="lg:hidden">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full bg-card h-12 rounded-xl border-none shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Select Content Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <Card className="border-none shadow-md overflow-hidden sticky top-48">
            <div className="bg-primary/5 p-4 border-b">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Filter by Type</span>
            </div>
            <CardContent className="p-2">
              <div className="space-y-1">
                {CATEGORIES.map(cat => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-all group",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span>{cat}</span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Content Grid */}
        <div className="flex-grow">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Showing {filteredContent.length} materials in {selectedCategory}
            </span>
          </div>

          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContent.map(item => {
                const canAccess = item.isFree || isUnlocked;
                
                return (
                  <Link 
                    key={item.id} 
                    href={canAccess ? `/viewer/${item.id}` : '#'} 
                    className={cn(
                      "group block relative",
                      !canAccess && "cursor-default"
                    )}
                    onClick={(e) => {
                      if (!canAccess) {
                        e.preventDefault();
                        window.dispatchEvent(new Event('premium-unlocked'));
                      }
                    }}
                  >
                    <Card className="aspect-[3/4.2] relative overflow-hidden border-none shadow-md bg-white dark:bg-card group-hover:-translate-y-1.5 transition-all duration-500 flex flex-col">
                      {/* Spine Effect */}
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/10 z-10" />
                      <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10 z-10" />
                      
                      {/* Status Badges */}
                      <div className="absolute top-0 left-3 z-30">
                        {item.isFree ? (
                          <div className="bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-b-md shadow-lg flex items-center gap-1 uppercase tracking-widest">
                            Free
                          </div>
                        ) : (
                          <div className={cn(
                            "text-white text-[9px] font-black px-2.5 py-1 rounded-b-md shadow-lg flex items-center gap-1 uppercase tracking-widest",
                            isUnlocked ? "bg-emerald-600" : "bg-amber-600"
                          )}>
                            {isUnlocked ? <Unlock className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />} 
                            {isUnlocked ? "Unlocked" : "Premium"}
                          </div>
                        )}
                      </div>

                      <CardContent className="p-0 flex-grow flex flex-col relative h-full">
                        <div className="relative flex-grow bg-muted/20 overflow-hidden">
                          <Image 
                            src={item.thumbnail || `https://picsum.photos/seed/${item.id}/300/400`} 
                            alt={item.title} 
                            fill 
                            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            data-ai-hint="book cover"
                          />
                          
                          {/* Top Icon Overlay */}
                          <div className="absolute top-3 right-3 p-2 bg-white/95 dark:bg-card/95 rounded-xl shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            {getIcon(item.type)}
                          </div>
                          
                          {!canAccess && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center gap-3">
                              <div className="bg-white/10 p-4 rounded-full border border-white/20 animate-pulse">
                                <Lock className="h-8 w-8 text-white" />
                              </div>
                              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Requires Pro Pass</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-card flex flex-col gap-2 border-t relative z-20 shrink-0">
                          <h3 className="font-bold text-xs md:text-sm leading-tight line-clamp-2 h-10 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                              {getIcon(item.type)} {item.type}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
              <h3 className="text-xl font-bold mb-2">No resources found</h3>
              <p className="text-muted-foreground">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}