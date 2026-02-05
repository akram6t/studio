"use client";

import { useParams } from "next/navigation";
import { getTopicSets, getPracticeSets } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Lock, 
  Clock, 
  HelpCircle, 
  Trophy, 
  Plus, 
  Edit2, 
  Trash2,
  Settings,
  MoreVertical,
  Layers
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminTopicSetsPage() {
  const params = useParams();
  const subjectId = params.subject_id as string;
  const topicId = params.topic_id as string;
  const sets = getTopicSets(topicId);
  const topics = getPracticeSets(subjectId);
  const currentTopic = topics.find(t => t.id === topicId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link href={`/admin/practice/${subjectId}`} className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-2">
            <ArrowLeft className="mr-1.5 h-3 w-3" /> Back to {subjectId} Topics
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Layers className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-foreground">{currentTopic?.title || 'Practice Sets'}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl h-11 px-4 font-bold border-primary/20 text-primary">
            <Settings className="h-4 w-4" />
            Topic Settings
          </Button>
          <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
            <Plus className="h-4 w-4" />
            Create Set
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sets.map((set, index) => (
          <Card 
            key={set.id} 
            className="group border-none shadow-sm overflow-hidden hover:shadow-md transition-all bg-card"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center p-5 gap-6">
                {/* Index / Visual */}
                <div className={cn(
                  "h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl font-headline text-xl font-bold transition-colors",
                  "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                )}>
                  {index + 1}
                </div>

                {/* Info */}
                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{set.title}</h3>
                    {set.isFree ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-black uppercase tracking-widest">
                        Free Access
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-600/10 text-amber-600 border-none text-[9px] font-black uppercase tracking-widest flex gap-1 items-center">
                        <Lock className="h-2.5 w-2.5" /> Premium Only
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-primary" />
                      <span>{set.questions} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{set.timeLimit} Mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-accent" />
                      <span>{index * 10 + 50}+ Aspirants</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="h-6 w-px bg-border mx-1" />
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sets.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">No sets configured</h3>
          <p className="text-muted-foreground">Get started by creating your first practice set for this topic.</p>
        </div>
      )}
    </div>
  );
}
