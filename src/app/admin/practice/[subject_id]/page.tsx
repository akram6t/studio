"use client";

import { useParams } from "next/navigation";
import { getPracticeSets } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  CheckCircle2, 
  BarChart3, 
  Hash, 
  Binary, 
  Type, 
  Globe, 
  Brain, 
  FileQuestion,
  Settings2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminSubjectTopicsPage() {
  const params = useParams();
  const subjectId = params.subject_id as string;
  const topics = getPracticeSets(subjectId);

  const getSubjectInfo = (id: string) => {
    switch (id) {
      case 'quant': return { title: 'Quantitative Aptitude', icon: <Hash className="h-6 w-6" /> };
      case 'english': return { title: 'English Language', icon: <Type className="h-6 w-6" /> };
      case 'reasoning': return { title: 'Reasoning Ability', icon: <Brain className="h-6 w-6" /> };
      case 'gk': return { title: 'General Knowledge', icon: <Globe className="h-6 w-6" /> };
      default: return { title: 'Practice Sets', icon: <FileQuestion className="h-6 w-6" /> };
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link href="/admin/practice" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-2">
            <ArrowLeft className="mr-1.5 h-3 w-3" /> Back to Subjects
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              {info.icon}
            </div>
            <h1 className="text-2xl font-headline font-bold text-foreground">{info.title} Topics</h1>
          </div>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
          <Plus className="h-4 w-4" />
          Add New Topic
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id} className="group hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden flex flex-col bg-card">
            <div className="h-1.5 w-full bg-primary/20" />
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2.5 rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  {getTopicIcon(topic.title)}
                </div>
                <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase border-primary/20 text-primary">
                  {topic.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1 mt-2">
                {topic.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">
                ID: {topic.id}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow pb-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-muted-foreground uppercase tracking-widest">Total Sets</span>
                  <span className="text-foreground">{topic.totalQuestions} Modules</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0 p-6 bg-muted/5 group-hover:bg-muted/10 transition-colors flex gap-2">
              <Link href={`/admin/practice/${subjectId}/${topic.id}`} className="flex-grow">
                <Button className="w-full gap-2 rounded-xl font-bold" variant="outline">
                  Configure Sets <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                <Settings2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
