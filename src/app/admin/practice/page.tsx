"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Languages, 
  BrainCircuit, 
  Globe, 
  ArrowRight,
  Plus,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  {
    id: "quant",
    title: "Quantitative Aptitude",
    description: "Arithmetic, Algebra, Geometry, and Data Interpretation.",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-blue-500",
    topicsCount: 12,
    questionsCount: "1200+"
  },
  {
    id: "english",
    title: "English Language",
    description: "Grammar, Vocabulary, and Reading Comprehension.",
    icon: <Languages className="h-6 w-6" />,
    color: "bg-emerald-500",
    topicsCount: 8,
    questionsCount: "1500+"
  },
  {
    id: "reasoning",
    title: "Reasoning Ability",
    description: "Logical puzzles, Series, and Analytical reasoning.",
    icon: <BrainCircuit className="h-6 w-6" />,
    color: "bg-purple-500",
    topicsCount: 10,
    questionsCount: "1000+"
  },
  {
    id: "gk",
    title: "General Knowledge",
    description: "History, Geography, Science, and Current Affairs.",
    icon: <Globe className="h-6 w-6" />,
    color: "bg-orange-500",
    topicsCount: 15,
    questionsCount: "2000+"
  }
];

export default function AdminPracticePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-foreground">Practice Subject Management</h1>
          <p className="text-muted-foreground text-sm font-medium">Define subjects, organize topics and manage question banks.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
          <Plus className="h-4 w-4" />
          Add New Subject
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {SUBJECTS.map((subject) => (
          <Card key={subject.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all bg-card">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className={cn(
                "p-3 rounded-2xl text-white shadow-lg",
                subject.color
              )}>
                {subject.icon}
              </div>
              <div className="flex-grow">
                <CardTitle className="text-lg">{subject.title}</CardTitle>
                <CardDescription className="line-clamp-1 text-[11px] font-semibold uppercase tracking-wider">{subject.id}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xs text-muted-foreground line-clamp-2 h-8 font-medium">
                {subject.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Topics</span>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                    {subject.topicsCount}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Questions</span>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Target className="h-3.5 w-3.5 text-accent" />
                    {subject.questionsCount}
                  </div>
                </div>
              </div>

              <Link href={`/admin/practice/${subject.id}`} className="block">
                <Button className="w-full gap-2 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all" variant="outline">
                  Manage Topics <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
