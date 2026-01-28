"use client";

import { useParams } from "next/navigation";
import { getPracticeSets } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, CheckCircle2, Clock, BarChart3, BookText, Hash, Binary, Type, Globe, Brain, HelpCircle, FileQuestion, GraduationCap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SubjectPracticePage() {
  const params = useParams();
  const subjectId = params.subject_id as string;
  const sets = getPracticeSets(subjectId);

  const getSubjectInfo = (id: string) => {
    switch (id) {
      case 'quant': return { title: 'Quantitative Aptitude', icon: <Hash className="h-6 w-6" /> };
      case 'english': return { title: 'English Language', icon: <Type className="h-6 w-6" /> };
      case 'reasoning': return { title: 'Reasoning Ability', icon: <Brain className="h-6 w-6" /> };
      case 'gk': return { title: 'General Knowledge', icon: <Globe className="h-6 w-6" /> };
      default: return { title: 'Practice Sets', icon: <BookText className="h-6 w-6" /> };
    }
  };

  const getTopicIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('number') || t.includes('series')) return <Binary className="h-5 w-5" />;
    if (t.includes('profit') || t.includes('interest')) return <Hash className="h-5 w-5" />;
    if (t.includes('reading') || t.includes('sentence') || t.includes('vocab')) return <Type className="h-5 w-5" />;
    if (t.includes('history') || t.includes('geography') || t.includes('science')) return <Globe className="h-5 w-5" />;
    if (t.includes('syllogism') || t.includes('arrangement') || t.includes('coding')) return <Brain className="h-5 w-5" />;
    return <FileQuestion className="h-5 w-5" />;
  };

  const info = getSubjectInfo(subjectId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/practice" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            {info.icon}
          </div>
          <h1 className="text-4xl font-headline font-bold">{info.title}</h1>
        </div>
        <p className="text-muted-foreground">Master {info.title} by practicing these core topics.</p>
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
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-muted group-hover:bg-primary group-hover:text-white"
                  )}>
                    {getTopicIcon(set.title)}
                  </div>
                  {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in zoom-in duration-300" />}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1 mt-2">
                  {set.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <BarChart3 className="h-3 w-3" />
                  {set.totalQuestions} Sets
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow pb-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span>{set.completedQuestions}/{set.totalQuestions} Solved</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>

              <CardFooter className="pt-0 p-6 bg-muted/5 group-hover:bg-muted/10 transition-colors">
                <Link href={`/practice/${subjectId}/${set.id}`} className="w-full">
                  <Button className="w-full gap-2 rounded-xl group-hover:text-primary-foreground" variant={isCompleted ? "outline" : "default"}>
                    {isCompleted ? "Review Set" : progress > 0 ? "Resume Topic" : "Start Topic"}
                    <Play className="h-4 w-4 fill-current" />
                  </Button>
                </Link>
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
