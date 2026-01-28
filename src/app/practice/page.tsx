
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Languages, 
  BrainCircuit, 
  Globe, 
  Zap, 
  Target, 
  TrendingUp,
  ArrowRight,
  Clock
} from "lucide-react";
import Link from "next/link";

const SUBJECTS = [
  {
    id: "quant",
    title: "Quantitative Aptitude",
    description: "Arithmetic, Algebra, Geometry, and Data Interpretation.",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-blue-500",
    progress: 65,
    questions: 1200,
    completed: 780
  },
  {
    id: "english",
    title: "English Language",
    description: "Grammar, Vocabulary, and Reading Comprehension.",
    icon: <Languages className="h-6 w-6" />,
    color: "bg-emerald-500",
    progress: 42,
    questions: 1500,
    completed: 630
  },
  {
    id: "reasoning",
    title: "Reasoning Ability",
    description: "Logical puzzles, Series, and Analytical reasoning.",
    icon: <BrainCircuit className="h-6 w-6" />,
    color: "bg-purple-500",
    progress: 88,
    questions: 1000,
    completed: 880
  },
  {
    id: "gk",
    title: "General Knowledge",
    description: "History, Geography, Science, and Current Affairs.",
    icon: <Globe className="h-6 w-6" />,
    color: "bg-orange-500",
    progress: 25,
    questions: 2000,
    completed: 500
  }
];

const RECENT_ACTIVITY = [
  { id: 1, title: "Arithmetic Quiz #4", subject: "Quantitative", score: "18/20", date: "2 hours ago" },
  { id: 2, title: "Fill in the Blanks", subject: "English", score: "12/15", date: "Yesterday" },
  { id: 3, title: "Number Series", subject: "Reasoning", score: "25/25", date: "Yesterday" },
];

export default function PracticePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">Practice Dashboard</h1>
          <p className="text-muted-foreground">Focused subject-wise practice to master every topic.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-4 py-1 flex gap-2 items-center">
            <Target className="h-4 w-4 text-primary" />
            <span>Daily Goal: 80%</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUBJECTS.map((subject) => (
              <Card key={subject.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={`${subject.color} p-3 rounded-2xl text-white shadow-lg`}>
                    {subject.icon}
                  </div>
                  <div className="flex-grow">
                    <CardTitle className="text-xl">{subject.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{subject.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground">
                      <span>{subject.completed} / {subject.questions} SOLVED</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                  <Button className="w-full gap-2 group-hover:bg-primary transition-colors" variant="outline">
                    Start Practice <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline font-bold">Recommended Topics</h2>
              <Button variant="link" className="text-accent font-bold p-0">View all</Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {["Profit & Loss", "Verbal Ability", "Time & Work", "Syllogism", "Indian History", "Sentence Correction", "Data Interpretation", "Current Affairs"].map((topic, i) => (
                <div key={i} className="bg-card p-4 rounded-xl border hover:border-accent transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="h-4 w-4 text-accent opacity-50 group-hover:opacity-100" />
                    <Badge className="text-[10px] bg-muted text-muted-foreground border-none">Topic</Badge>
                  </div>
                  <span className="text-sm font-bold block">{topic}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-md bg-primary text-primary-foreground overflow-hidden relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance
              </CardTitle>
              <CardDescription className="text-primary-foreground/70">
                You've improved by 12% this week!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold">142</span>
                <span className="text-xl opacity-70 mb-1">XP</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Rank among peers: <span className="font-bold">#42</span></p>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`flex-1 h-12 rounded-md ${i < 5 ? 'bg-white/40' : 'bg-white/10'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-center opacity-70">Daily Activity (Mon - Sun)</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full" />
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold">{activity.title}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{activity.subject} • {activity.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-600">{activity.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full text-xs text-muted-foreground" size="sm">
                <Clock className="h-3 w-3 mr-2" /> View History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
