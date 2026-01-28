"use client";

import { TestItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Award, FileQuestion, Lock, Play, History, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function TestListView({ tests }: { tests: TestItem[] }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check if premium was unlocked during this session
    const handleUnlock = () => setIsUnlocked(true);
    window.addEventListener('premium-unlocked', handleUnlock);
    return () => window.removeEventListener('premium-unlocked', handleUnlock);
  }, []);

  const getTestIcon = (type: string) => {
    switch (type) {
      case 'mock':
        return <Play className="h-8 w-8 fill-current" />;
      case 'test':
        return <ClipboardCheck className="h-8 w-8" />;
      case 'previous':
        return <History className="h-8 w-8" />;
      default:
        return <Play className="h-8 w-8 fill-current" />;
    }
  };

  return (
    <div className="space-y-4">
      {tests.map(test => {
        const canAccess = test.isFree || isUnlocked;
        
        return (
          <div 
            key={test.id} 
            className={cn(
              "relative flex flex-col md:flex-row items-center gap-6 p-5 pt-10 md:pt-5 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden",
              !canAccess && "opacity-50 grayscale-[0.3] hover:opacity-70 transition-opacity"
            )}
          >
            {/* Absolute Badge at Top-Left */}
            <div className="absolute top-0 left-0 z-10">
              {test.isFree ? (
                <div className="bg-emerald-500 text-white text-[8px] font-bold px-2 py-1 rounded-br-xl shadow-sm flex items-center gap-1 uppercase tracking-widest">
                  Free
                </div>
              ) : (
                <div className={cn(
                  "text-white text-[8px] font-bold px-2 py-1 rounded-br-xl shadow-sm flex items-center gap-1 uppercase tracking-widest",
                  isUnlocked ? "bg-amber-600" : "bg-amber-600"
                )}>
                  {isUnlocked ? <Play className="h-2 w-2 fill-current" /> : <Lock className="h-2 w-2" />} 
                  {isUnlocked ? "Unlocked" : "Premium"}
                </div>
              )}
            </div>

            <div className={cn(
              "h-16 w-16 hidden md:flex shrink-0 items-center justify-center rounded-2xl transition-colors",
              isUnlocked ? "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
            )}>
              {getTestIcon(test.type)}
            </div>
            
            <div className="flex-grow space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{test.title}</h3>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Timer className="h-4 w-4" />
                  <span>{test.durationInMinutes} Minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  <span>{test.marks} Marks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileQuestion className="h-4 w-4" />
                  <span>{test.numberOfQuestions} Questions</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Button className={cn(
                "w-full md:w-auto gap-2 rounded-xl h-12 px-8 font-bold",
                canAccess ? "" : "bg-amber-600 hover:bg-amber-700"
              )}>
                {canAccess ? (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    Start Test
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Unlock Now
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
