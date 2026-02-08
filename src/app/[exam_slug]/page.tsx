"use client";

import { useParams } from 'next/navigation';
import { EXAMS } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Crown, Sparkles, Zap, Info } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function ExamOverview() {
  const params = useParams();
  const slug = params.exam_slug as string;
  const exam = EXAMS.find(e => e.slug === slug);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    window.dispatchEvent(new Event('premium-unlocked'));
  };

  if (!exam) return null;

  // Generate a full markdown string if overviewMdx is missing
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
        <section className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/5 p-2.5 rounded-2xl text-primary">
              <Info className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-headline font-bold">About the Exam</h2>
          </div>
          
          <div className="max-w-none">
            <MarkdownRenderer 
              content={markdownContent} 
              className="prose-base md:prose-lg"
            />
          </div>
        </section>

        <section className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border">
          <h2 className="text-2xl font-headline font-bold mb-6">What you'll get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "50+ Full length mock tests",
              "200+ Sectional practice sets",
              "Previous 10 year solved papers",
              "Daily current affairs quizzes",
              "Interactive study materials",
              "Performance analytics dashboard"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/10 transition-colors">
                <CheckCircle2 className={cn("h-5 w-5", isUnlocked ? "text-amber-600" : "text-primary")} />
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border">
          <h2 className="text-2xl font-headline font-bold mb-6">Standard Exam Pattern</h2>
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Section</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground text-center">Questions</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground text-center">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {exam.subjects.map((subject, idx) => (
                  <tr key={idx} className="hover:bg-muted/5 transition-colors">
                    <td className="p-4 font-medium">{subject}</td>
                    <td className="p-4 text-center font-bold">25</td>
                    <td className="p-4 text-center font-bold">25</td>
                  </tr>
                ))}
                <tr className="bg-primary/5 font-black text-primary">
                  <td className="p-4">Total Estimate</td>
                  <td className="p-4 text-center">{exam.subjects.length * 25}</td>
                  <td className="p-4 text-center">{exam.subjects.length * 25}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <Card className={cn(
          "sticky top-40 overflow-hidden transition-all duration-500 rounded-[2rem]",
          isUnlocked 
            ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20" 
            : "border-primary/10 bg-primary/5 shadow-xl"
        )}>
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-headline font-bold">Preparation Kit</h3>
              {isUnlocked ? (
                <div className="bg-amber-600 p-2 rounded-2xl text-white shadow-lg shadow-amber-600/20">
                  <Crown className="h-6 w-6" />
                </div>
              ) : (
                <div className="bg-primary p-2 rounded-2xl text-white shadow-lg shadow-primary/20">
                  <Zap className="h-6 w-6" />
                </div>
              )}
            </div>

            {isUnlocked ? (
              <div className="space-y-6">
                <div className="p-5 bg-white dark:bg-card rounded-[1.5rem] border-2 border-amber-600/20 shadow-inner">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <span className="font-black text-amber-600 uppercase tracking-widest text-[10px]">Elite Status</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed">Your account has unrestricted access to all 250+ premium tests!</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Pass Type</span>
                    <Badge className="bg-amber-600 text-white border-none px-3 py-1">ULTIMATE</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Days Left</span>
                    <span className="text-amber-700 dark:text-amber-400">364 Days</span>
                  </div>
                </div>
                
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 rounded-2xl font-black text-xs uppercase tracking-widest" disabled>
                  Elite Member Active
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-muted-foreground">Starts at</span>
                  <span className="text-4xl font-black tracking-tight text-foreground">₹499</span>
                  <Badge variant="outline" className="text-[9px] font-black text-emerald-600 border-emerald-600 bg-emerald-50 h-5">66% OFF</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">Unlock the full potential of your preparation with expert strategy guides and official pattern mocks.</p>
                
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20"
                    onClick={handleUnlock}
                  >
                    Unlock Pro Prep
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground font-bold italic tracking-wide uppercase">One-time payment • 365 days validity</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
