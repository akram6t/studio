
import { getExams } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import Link from 'next/link';

export default async function ExamOverview({ params }: { params: Promise<{ exam_slug: string }> }) {
  const { exam_slug: slug } = await params;
  const exams = await getExams();
  const exam = exams.find(e => e.slug === slug);

  if (!exam) return null;

  const markdownContent = exam.overviewMdx || `
# ${exam.title}
${exam.description}

### Preparation Strategy
Success in this competitive examination requires a disciplined approach, a thorough understanding of the comprehensive syllabus, and consistent daily practice with high-fidelity mock tests.

> "Consistency is the key to unlocking your potential in this exam."
  `;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <section className="bg-card p-6 md:p-10 rounded-3xl shadow-sm border overflow-hidden">
          <div className="max-w-none">
            <MarkdownRenderer 
              content={markdownContent} 
              className="prose-base md:prose-lg"
            />
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-40 overflow-hidden transition-all duration-500 rounded-[2.5rem] border shadow-xl border-primary/10 bg-card">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-headline font-bold text-card-foreground">Preparation Kit</h3>
              <div className="bg-primary p-2 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
                <Zap className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-muted-foreground">Starting at</span>
                  <span className="text-4xl font-black tracking-tight text-foreground">₹199</span>
                  <span className="text-sm font-bold text-muted-foreground">/mo</span>
                </div>
                <Badge variant="outline" className="text-[9px] font-black text-emerald-600 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 h-5">BEST VALUE</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">Unlock the full potential of your preparation with expert strategy guides and official pattern mocks.</p>
              
              <div className="space-y-4">
                <Link href="/pricing" className="block w-full">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20"
                  >
                    Unlock Pro Prep
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-muted-foreground font-bold italic tracking-wide uppercase">Choose a plan that works for you • Instant activation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
