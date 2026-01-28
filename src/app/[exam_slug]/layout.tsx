"use client";

import { useParams, usePathname, useRouter } from 'next/navigation';
import { EXAMS, getMockTests, getTests, getPrevPapers, getQuizzes } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, ArrowLeft, Crown, CheckCircle2, Layout } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function ExamDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.exam_slug as string;
  const exam = EXAMS.find(e => e.slug === slug);

  // Simulated global state for premium status
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Listen for the custom event from the "Unlock" button in page.tsx
    const handleUnlock = () => setIsUnlocked(true);
    window.addEventListener('premium-unlocked', handleUnlock);
    return () => window.removeEventListener('premium-unlocked', handleUnlock);
  }, []);

  if (!exam) return <div>Exam not found</div>;

  const mockCount = getMockTests(slug).length;
  const sectionalCount = getTests(slug).length;
  const prevCount = getPrevPapers(slug).length;
  const quizCount = getQuizzes(slug).length;
  const totalTests = mockCount + sectionalCount + prevCount;

  const tabs = [
    { label: 'Overview', value: '' },
    { label: 'Mock Test', value: 'mock' },
    { label: 'Tests', value: 'tests' },
    { label: 'Prev. papers', value: 'previous-papers' },
    { label: 'Content', value: 'content' },
    { label: 'Quizzes', value: 'quizzes' },
  ];

  const currentTab = pathname.split('/').pop() === slug ? '' : pathname.split('/').pop();

  return (
    <div className="container mx-auto px-4 py-2 md:py-4 max-w-6xl">
      <Link href="/exams" className="inline-flex items-center text-[10px] md:text-xs font-medium text-muted-foreground hover:text-primary mb-2 md:mb-3 transition-colors">
        <ArrowLeft className="mr-1 h-3 w-3" />
        Back to Exams
      </Link>

      <Card className={cn(
        "mb-[5px] overflow-hidden border-none shadow-md transition-all duration-700",
        isUnlocked 
          ? "bg-amber-600 text-white" 
          : "bg-primary text-primary-foreground"
      )}>
        <CardContent className="p-3 md:p-5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
              <Badge className={cn(
                "bg-white/20 text-white border-none backdrop-blur-md text-[7px] md:text-[9px] px-1.5 py-0",
                isUnlocked && "bg-white text-amber-600"
              )}>
                {exam.category}
              </Badge>
              {isUnlocked && (
                <Badge className="bg-white text-amber-600 border-none flex gap-1 items-center text-[7px] md:text-[9px] px-1.5 py-0">
                  <Crown className="h-2 w-2" /> ELITE ACTIVE
                </Badge>
              )}
            </div>
            
            <h1 className="text-sm md:text-xl font-headline font-bold mb-0.5 md:mb-1 leading-tight">
              {exam.title} {isUnlocked ? 'Pro' : 'Prep'}
            </h1>
            <p className={cn(
              "max-w-xl mb-3 md:mb-4 text-[9px] md:text-xs opacity-90 line-clamp-1 md:line-clamp-2",
              isUnlocked ? "text-white/90" : "text-primary-foreground/80"
            )}>
              {isUnlocked 
                ? "Full access to elite preparation materials, premium tests, and analytics."
                : exam.description}
            </p>
            
            <div className="flex items-center gap-4 md:gap-8">
              <div className="space-y-0">
                <span className="text-[6px] md:text-[8px] uppercase tracking-widest opacity-70 font-bold block">Tests</span>
                <div className="flex items-center gap-1">
                  <Layout className="h-2 w-2 md:h-3 md:w-3" />
                  <span className="text-[9px] md:text-sm font-bold">{totalTests}+</span>
                </div>
              </div>
              <div className="space-y-0">
                <span className="text-[6px] md:text-[8px] uppercase tracking-widest opacity-70 font-bold block">Mock</span>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-2 w-2 md:h-3 md:w-3" />
                  <span className="text-[9px] md:text-sm font-bold">{mockCount}</span>
                </div>
              </div>
              <div className="space-y-0">
                <span className="text-[6px] md:text-[8px] uppercase tracking-widest opacity-70 font-bold block">Students</span>
                <div className="flex items-center gap-1">
                  <Users className="h-2 w-2 md:h-3 md:w-3" />
                  <span className="text-[9px] md:text-sm font-bold">240k+</span>
                </div>
              </div>
              <div className="space-y-0">
                <span className="text-[6px] md:text-[8px] uppercase tracking-widest opacity-70 font-bold block">Year</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-2 w-2 md:h-3 md:w-3" />
                  <span className="text-[9px] md:text-sm font-bold">2025</span>
                </div>
              </div>
            </div>
          </div>
          
          {isUnlocked && (
            <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12">
              <Crown size={80} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="sticky top-16 z-40 -mx-4 md:mx-0">
        <div className="bg-background/95 backdrop-blur-md border-y md:border-x md:rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.05)] px-4 md:px-1 py-1">
          <Tabs value={currentTab || ''} onValueChange={(val) => router.push(`/${slug}/${val}`)} className="w-full">
            <TabsList className="bg-transparent h-auto p-0 flex w-full justify-start md:justify-center overflow-x-auto whitespace-nowrap scrollbar-hide">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className={cn(
                    "rounded-md py-2 px-4 md:px-6 transition-all text-xs md:text-sm font-bold tracking-tight",
                    isUnlocked 
                      ? "data-[state=active]:bg-amber-600 data-[state=active]:text-white" 
                      : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="min-h-[300px] mt-4 md:mt-6">
        {children}
      </div>
    </div>
  );
}
