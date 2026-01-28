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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/exams" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Exams
      </Link>

      <Card className={cn(
        "mb-8 overflow-hidden border-none shadow-lg transition-all duration-700",
        isUnlocked 
          ? "bg-amber-600 text-white" 
          : "bg-primary text-primary-foreground"
      )}>
        <CardContent className="p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={cn(
                "bg-white/20 text-white border-none backdrop-blur-md",
                isUnlocked && "bg-white text-amber-600"
              )}>
                {exam.category}
              </Badge>
              {isUnlocked && (
                <Badge className="bg-white text-amber-600 border-none flex gap-1 items-center animate-bounce">
                  <Crown className="h-3 w-3" /> ELITE PASS ACTIVE
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-headline font-bold mb-4">
              {exam.title} {isUnlocked ? 'Pro Dashboard' : 'Preparation'}
            </h1>
            <p className={cn(
              "max-w-2xl mb-8 text-lg",
              isUnlocked ? "text-white/90" : "text-primary-foreground/80"
            )}>
              {isUnlocked 
                ? "Welcome to your elite preparation kit. You have full access to all premium tests, advanced analysis, and curated study materials."
                : `${exam.description} Master your exam with our comprehensive test series and expert-curated materials.`}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Total Tests</span>
                <div className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  <span className="text-xl font-bold">{totalTests}+</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Mock Exams</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xl font-bold">{mockCount}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Students</span>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-xl font-bold">240k+</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Last Updated</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xl font-bold">2025</span>
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
            <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
              <Crown size={200} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-card rounded-xl shadow-sm border p-1 sticky top-20 z-40 mb-8 overflow-x-auto scrollbar-hide">
        <Tabs value={currentTab || ''} onValueChange={(val) => router.push(`/${slug}/${val}`)} className="w-full">
          <TabsList className="bg-transparent h-auto p-1 flex w-full justify-start md:justify-center overflow-x-auto whitespace-nowrap scrollbar-hide">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className={cn(
                  "rounded-lg py-2.5 px-6 transition-all",
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

      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}