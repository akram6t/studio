
"use client";

import { useParams } from "next/navigation";
import { getPracticeSets } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, CheckCircle2, Clock, BarChart3, BookText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SubjectPracticePage() {
  const params = useParams();
  const subjectId = params.subject_id as string;
  const sets = getPracticeSets(subjectId);

  const getSubjectTitle = (id: string) => {
    switch (id) {
      case 'quant': return 'Quantitative Aptitude';
      case 'english': return 'English Language';
      case 'reasoning': return 'Reasoning Ability';
      case 'gk': return 'General Knowledge';
      default: return 'Practice Sets';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
      case 'Medium': return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'Hard': return 'text-rose-600 border-rose-200 bg-rose-50';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/practice" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <BookText className="h-6 w-6 text-primary" />
          <h1 className="text-4xl font-headline font-bold">{getSubjectTitle(subjectId)}</h1>
        </div>
        <p className="text-muted-foreground">Master {getSubjectTitle(subjectId)} by practicing these core topics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sets.map((set) => {
          const progress = (set.completedQuestions / set.totalQuestions) * 100;
          const isCompleted = progress === 100;

          return (
            <Card key={set.id} className="group hover:shadow-lg transition-all border-none shadow-md overflow-hidden flex flex-col bg-card">
              <div className={cn(
                "h-1.5 w-full transition-colors",
                isCompleted ? "bg-emerald-500" : "bg-primary/20"
              )} />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", getDifficultyColor(set.difficulty))}>
                    {set.difficulty}
                  </Badge>
                  {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in zoom-in duration-300" />}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                  {set.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <BarChart3 className="h-3 w-3" />
                  {set.totalQuestions} Questions
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow pb-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span>{set.completedQuestions} Solved</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>

              <CardFooter className="pt-0 p-6 bg-muted/5 group-hover:bg-muted/10 transition-colors">
                <Button className="w-full gap-2 rounded-xl" variant={isCompleted ? "outline" : "default"}>
                  {isCompleted ? "Review Set" : progress > 0 ? "Resume Topic" : "Start Topic"}
                  <Play className="h-4 w-4 fill-current" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {sets.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Topics Coming Soon</h3>
          <p className="text-muted-foreground">We are currently preparing practice modules for this subject.</p>
        </div>
      )}
    </div>
  );
}
