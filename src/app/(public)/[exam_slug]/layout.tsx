import { getExams, getMockTests, getTests, getPrevPapers, getQuizzes } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, ArrowLeft, CheckCircle2, Layout } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ExamTabs from '@/components/exam-tabs';

export default async function ExamDetailLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ exam_slug: string }>
}) {
  const { exam_slug: slug } = await params;

  const [exams, mocks, tests, papers, quizzes] = await Promise.all([
    getExams(),
    getMockTests(slug),
    getTests(slug),
    getPrevPapers(slug),
    getQuizzes(slug)
  ]);
  
  const exam = exams.find(e => e.slug === slug);
  if (!exam) return <div className="p-20 text-center font-bold">Exam not found</div>;

  const counts = {
    mock: mocks.length,
    sectional: tests.length,
    prev: papers.length,
    quiz: quizzes.length
  };

  const totalTests = counts.mock + counts.sectional + counts.prev;

  return (
    <div className="container mx-auto px-4 py-2 md:py-4 max-w-6xl">
      <Link href="/exams" className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-primary mb-2 md:mb-3 transition-colors">
        <ArrowLeft className="mr-1 h-3 w-3" />
        Back to Exams
      </Link>

      <Card className={cn(
        "mb-[5px] overflow-hidden border-none shadow-md transition-all duration-700 bg-primary text-primary-foreground"
      )}>
        <CardContent className="p-4 md:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <Badge className={cn(
                "bg-white/20 text-white border-none backdrop-blur-md text-[10px] md:text-xs px-2 py-0.5"
              )}>
                {exam.category}
              </Badge>
            </div>
            
            <h1 className="text-xl md:text-3xl font-headline font-bold mb-1 md:mb-2 leading-tight">
              {exam.title} Prep
            </h1>
            <p className={cn(
              "max-w-2xl mb-4 md:mb-6 text-xs md:text-sm opacity-90 line-clamp-2 text-primary-foreground/80"
            )}>
              {exam.description}
            </p>
            
            <div className="flex items-center gap-6 md:gap-10">
              <div className="space-y-0.5">
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-70 font-bold block">Tests</span>
                <div className="flex items-center gap-1.5">
                  <Layout className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-lg font-bold">{totalTests}+</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-70 font-bold block">Mock</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-lg font-bold">{counts.mock}</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-70 font-bold block">Students</span>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-lg font-bold">240k+</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-70 font-bold block">Year</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-lg font-bold">2025</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ExamTabs slug={slug} />

      <div className="min-h-[300px] mt-4 md:mt-6">
        {children}
      </div>
    </div>
  );
}
