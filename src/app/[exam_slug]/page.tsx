
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Crown, Sparkles, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function ExamOverview() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    // Dispatch custom event to notify layout.tsx
    window.dispatchEvent(new Event('premium-unlocked'));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <section className="bg-card p-6 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-headline font-bold mb-6">About the Exam</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              The exam is conducted annually to recruit eligible candidates for various positions. It tests candidates on their aptitude, technical knowledge, and mental ability.
            </p>
            <p>
              Success in this exam requires a disciplined approach, thorough understanding of the syllabus, and consistent practice with mock tests.
            </p>
          </div>
        </section>

        <section className="bg-card p-6 rounded-2xl shadow-sm border">
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
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <CheckCircle2 className={cn("h-5 w-5", isUnlocked ? "text-amber-600" : "text-accent")} />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card p-6 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-headline font-bold mb-6">Exam Pattern</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-3 font-semibold">Section</th>
                  <th className="p-3 font-semibold">Questions</th>
                  <th className="p-3 font-semibold">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3">General Intelligence</td>
                  <td className="p-3">25</td>
                  <td className="p-3">25</td>
                </tr>
                <tr>
                  <td className="p-3">English Language</td>
                  <td className="p-3">25</td>
                  <td className="p-3">25</td>
                </tr>
                <tr>
                  <td className="p-3">Quantitative Aptitude</td>
                  <td className="p-3">25</td>
                  <td className="p-3">25</td>
                </tr>
                <tr className="bg-muted/50 font-bold">
                  <td className="p-3">Total</td>
                  <td className="p-3">100</td>
                  <td className="p-3">100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <Card className={cn(
          "sticky top-40 overflow-hidden transition-all duration-500",
          isUnlocked 
            ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20" 
            : "border-accent/20 bg-accent/5"
        )}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-headline font-bold">Preparation Kit</h3>
              {isUnlocked ? (
                <Crown className="text-amber-600 h-6 w-6" />
              ) : (
                <Zap className="text-accent h-6 w-6" />
              )}
            </div>

            {isUnlocked ? (
              <div className="space-y-6">
                <div className="p-4 bg-white dark:bg-card rounded-xl border-2 border-amber-600/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <span className="font-bold text-amber-600 uppercase tracking-widest text-xs">Premium Access</span>
                  </div>
                  <p className="text-sm font-medium">All 250+ Premium tests are now unlocked for you!</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pass Status</span>
                    <Badge className="bg-amber-600 text-white border-none">ACTIVE</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Validity</span>
                    <span className="font-bold">Expires in 364 days</span>
                  </div>
                </div>
                
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled>
                  Elite Member
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">₹499</span>
                  <span className="text-muted-foreground line-through text-sm mb-1">₹1,499</span>
                  <Badge variant="outline" className="mb-1 text-[10px] text-emerald-600 border-emerald-600 bg-emerald-50">66% OFF</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">Unlock all premium content, full mock tests, and expert guidance for this exam.</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span>Pass Status</span>
                    <Badge variant="outline" className="border-accent text-accent">Inactive</Badge>
                  </div>
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-white h-12 text-lg font-bold shadow-lg shadow-accent/20"
                    onClick={handleUnlock}
                  >
                    Unlock All Tests
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground italic">1-year validity • Instant access</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="bg-card p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Latest Updates</h3>
          <ul className="space-y-4">
            {[1, 2, 3].map(i => (
              <li key={i} className="group cursor-pointer">
                <p className="text-xs text-muted-foreground mb-1">Oct 15, 2024</p>
                <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">Official notification for 2024 out now.</h4>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
