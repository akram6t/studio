
"use client";

import { useParams, usePathname, useRouter } from 'next/navigation';
import { EXAMS } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExamDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.exam_slug as string;
  const exam = EXAMS.find(e => e.slug === slug);

  if (!exam) return <div>Exam not found</div>;

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

      <Card className="mb-8 overflow-hidden border-none shadow-lg bg-primary text-primary-foreground">
        <CardContent className="p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="mb-4 bg-accent text-white border-none">{exam.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-headline font-bold mb-4">{exam.title} Preparation</h1>
            <p className="text-primary-foreground/80 max-w-2xl mb-8 text-lg">
              {exam.description} Master your exam with our comprehensive test series and expert-curated materials.
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>240k+ Students enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Updated for 2024-25</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none hidden md:block">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L100 0 L100 100 Z" fill="currentColor" />
            </svg>
          </div>
        </CardContent>
      </Card>

      <div className="bg-card rounded-xl shadow-sm border p-1 sticky top-20 z-40 mb-8 overflow-x-auto">
        <Tabs value={currentTab || ''} onValueChange={(val) => router.push(`/${slug}/${val}`)} className="w-full">
          <TabsList className="bg-transparent h-auto p-1 flex w-full justify-start md:justify-center overflow-x-auto whitespace-nowrap scrollbar-hide">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="rounded-lg py-2.5 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
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
