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
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
      <Link href="/exams" className="inline-flex items-center text-[10px] md:text-sm font-medium text-muted-foreground hover:text-primary mb-3 md:mb-4 transition-colors">
        <ArrowLeft className="mr-2 h-3 w-3 md:h-4 md:w-4" />
        Back to Exams
      </Link>

      <Card className={cn(
        "mb-4 md:mb-0 overflow-hidden border-none shadow-lg transition-all duration-700",
        isUnlocked 
          ? "bg-amber-600 text-white" 
          : "bg-primary text-primary-foreground"
      )}>
        <CardContent className="p-4 md:p-6 lg:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <Badge className={cn(
                "bg-white/20 text-white border-none backdrop-blur-md text-[8px] md:text-[10px]",
                isUnlocked && "bg-white text-amber-600"
              )}>
                {exam.category}
              </Badge>
              {isUnlocked && (
                <Badge className="bg-white text-amber-600 border-none flex gap-1 items-center animate-bounce text-[8px] md:text-[10px]">
                  <Crown className="h-2 w-2 md:h-2.5 md:w-2.5" /> ELITE PASS ACTIVE
                </Badge>
              )}
            </div>
            
            <h1 className="text-lg md:text-2xl lg:text-3xl font-headline font-bold mb-1 md:mb-2 leading-tight">
              {exam.title} {isUnlocked ? 'Pro Dashboard' : 'Preparation'}
            </h1>
            <p className={cn(
              "max-w-2xl mb-4 md:mb-6 text-[11px] md:text-sm lg:text-base opacity-90 line-clamp-2 md:line-clamp-none",
              isUnlocked ? "text-white/90" : "text-primary-foreground/80"
            )}>
              {isUnlocked 
                ? "Welcome to your elite preparation kit. You have full access to all premium tests, advanced analysis, and curated study materials."
                : `${exam.description} Master your exam with our comprehensive test series and expert-curated materials.`}
            </p>
            
            <div className="grid grid-cols-4 gap-2 md:gap-8">
              <div className="space-y-0">
                <span className="text-[7px] md:text-[9px] uppercase tracking-widest opacity-70 font-bold block">Total Tests</span>
                <div className="flex items-center gap-1 md:gap-1.5">
                  <Layout className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" />
                  <span className="text-[10px] md:text-base font-bold">{totalTests}+</span>
                </div>
              </div>
              <div className="space-y-0">
                <span className="text-[7px] md:text-[9px] uppercase tracking-widest opacity-70 font-bold block">Mock Exams</span>
                <div className="flex items-center gap-1 md:gap-1.5">
                  <CheckCircle2 className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" />
                  <span className="text-[10px] md:text-base font-bold">{mockCount}</span>
                </div>
              </div>
              <div className="space-y-0">
                <span className="text-[7px] md:text-[9px] uppercase tracking-widest opacity-70 font-bold block">Students</span>
                <div className="flex items-center gap-1 md:gap-1.5">
                  <Users className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" />
                  <span className="text-[10px] md:text-base font-bold">240k+</span>
                </div>
              </div>
              <div className="space-y-0">
                <span className="text-[7px] md:text-[9px] uppercase tracking-widest opacity-70 font-bold block">Updated</span>
                <div className="flex items-center gap-1 md:gap-1.5">
                  <Calendar className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" />
                  <span className="text-[10px] md:text-base font-bold">2025</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none hidden md:block transition-colors duration-700",
            isUnlocked ? "text-white" : "text-primary-foreground"
          )}>
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L100 0 L100 100 Z" fill="currentColor" />
            </svg>
          </div>
          
          {isUnlocked && (
            <div className="absolute -bottom-6 -right-6 opacity-10 rotate-12">
              <Crown size={120} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="sticky top-16 z-40 -mx-4 md:mx-0">
        <div className="bg-background/95 backdrop-blur-md border-y md:border-x md:rounded-b-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-4 md:px-1 py-1">
          <Tabs value={currentTab || ''} onValueChange={(val) => router.push(`/${slug}/${val}`)} className="w-full">
            <TabsList className="bg-transparent h-auto p-1 flex w-full justify-start md:justify-center overflow-x-auto whitespace-nowrap scrollbar-hide">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className={cn(
                    "rounded-lg py-1.5 md:py-2 px-3 md:px-5 transition-all text-[9px] md:text-xs font-bold tracking-tight",
                    isUnlocked 
                      ? "data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md" 
                      : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="min-h-[400px] mt-6 md:mt-8">
        {children}
      </div>
    </div>
  );
}
