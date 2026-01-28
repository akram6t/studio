
"use client";

import { TestItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Award, FileQuestion, Lock, Play } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      {tests.map(test => {
        const canAccess = test.isFree || isUnlocked;
        
        return (
          <div 
            key={test.id} 
            className={cn(
              "flex flex-col md:flex-row items-center gap-6 p-5 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all group",
              !canAccess && "opacity-50 grayscale-[0.3] hover:opacity-70 transition-opacity"
            )}
          >
            <div className={cn(
              "h-16 w-16 hidden md:flex shrink-0 items-center justify-center rounded-2xl transition-colors",
              isUnlocked ? "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
            )}>
              <Play className="h-8 w-8 fill-current" />
            </div>
            
            <div className="flex-grow space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{test.title}</h3>
                {test.isFree ? (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-50 text-[10px]">FREE</Badge>
                ) : (
                  <Badge variant="outline" className={cn(
                    "text-[10px] flex gap-1",
                    isUnlocked ? "text-amber-600 border-amber-600 bg-amber-50" : "text-amber-600 border-amber-600 bg-amber-50"
                  )}>
                    {isUnlocked ? <Play className="h-3 w-3 fill-current" /> : <Lock className="h-3 w-3" />} 
                    {isUnlocked ? "UNLOCKED" : "PREM"}
                  </Badge>
                )}
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
                "w-full md:w-auto gap-2 rounded-xl h-12 px-8",
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
