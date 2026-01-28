"use client";

import { useParams } from "next/navigation";
import { getTopicSets, getPracticeSets } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Lock, CheckCircle2, Clock, HelpCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function TopicSetsPage() {
  const params = useParams();
  const subjectId = params.subject_id as string;
  const topicId = params.topic_id as string;
  const sets = getTopicSets(topicId);
  const topics = getPracticeSets(subjectId);
  const currentTopic = topics.find(t => t.id === topicId);

  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check for premium status
    const handleUnlock = () => setIsUnlocked(true);
    window.addEventListener('premium-unlocked', handleUnlock);
    return () => window.removeEventListener('premium-unlocked', handleUnlock);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href={`/practice/${subjectId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} Topics
      </Link>

      <div className="mb-10">
        <h1 className="text-2xl md:text-4xl font-headline font-bold mb-2">{currentTopic?.title || 'Topic Sets'}</h1>
        <p className="text-sm md:text-base text-muted-foreground">Select a practice set to test your skills on this specific topic.</p>
      </div>

      <div className="space-y-4">
        {sets.map((set, index) => {
          const canAccess = set.isFree || isUnlocked;
          
          return (
            <Card 
              key={set.id} 
              className={cn(
                "group border-none shadow-md overflow-hidden hover:shadow-lg transition-all"
              )}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                  {/* Set Number Icon */}
                  <div className={cn(
                    "h-16 w-16 shrink-0 flex items-center justify-center rounded-2xl transition-colors font-headline text-2xl font-bold",
                    set.isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary"
                  )}>
                    {index + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-grow text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h3 className="text-xl font-bold">{set.title}</h3>
                      {set.isCompleted && (
                        <Badge className="bg-emerald-500 text-white border-none">COMPLETED</Badge>
                      )}
                      {!set.isFree && !isUnlocked && (
                        <Badge variant="outline" className="text-amber-600 border-amber-600 flex gap-1 items-center bg-amber-50">
                          <Lock className="h-3 w-3" /> PREMIUM
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4" />
                        <span>{set.questions} Questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{set.timeLimit} Mins</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-4 w-4" />
                        <span>{index * 10 + 50} Students attempted</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0 w-full md:w-auto">
                    <Button 
                      className={cn(
                        "w-full md:w-auto gap-2 rounded-xl h-12 px-8 font-bold",
                        !canAccess && "bg-amber-600 hover:bg-amber-700"
                      )}
                      variant={set.isCompleted ? "outline" : "default"}
                    >
                      {canAccess ? (
                        <>
                          <Play className="h-4 w-4 fill-current" />
                          {set.isCompleted ? 'Retry Set' : 'Start Set'}
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Unlock Premium
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isUnlocked && (
        <Card className="mt-12 bg-primary text-primary-foreground border-none shadow-xl overflow-hidden">
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-headline font-bold">Unlock All Premium Sets</h2>
              <p className="text-primary-foreground/80 max-w-md">Get unlimited access to thousands of premium practice sets and mocks for 1 year.</p>
            </div>
            <Link href={`/${subjectId === 'quant' ? 'ssc-gd-constable' : ''}`}>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-14 px-10 text-xl shadow-lg shadow-amber-900/20">
                Upgrade to Pro
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
