"use client";

import { useParams } from "next/navigation";
import { getPracticeSets, PracticeSet } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Hash, 
  Binary, 
  Type, 
  Globe, 
  Brain, 
  FileQuestion,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Save,
  Check,
  BarChart3
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminSubjectTopicsPage() {
  const params = useParams();
  const subjectId = params.subject_id as string;
  const [topics, setTopics] = useState<PracticeSet[]>(getPracticeSets(subjectId));

  // CRUD State
  const [editingTopic, setEditingTopic] = useState<PracticeSet | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  const handleEdit = (topic: PracticeSet) => {
    setEditingTopic({ ...topic });
    setIsSheetOpen(true);
  };

  const handleAdd = () => {
    const newId = `topic-${topics.length + 1}`;
    setEditingTopic({
      id: newId,
      title: "New Topic",
      totalQuestions: 0,
      completedQuestions: 0,
      difficulty: 'Medium'
    });
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (editingTopic) {
      const exists = topics.some(t => t.id === editingTopic.id);
      if (exists) {
        setTopics(topics.map(t => t.id === editingTopic.id ? editingTopic : t));
      } else {
        setTopics([...topics, editingTopic]);
      }
      setIsSheetOpen(false);
      setEditingTopic(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setTopics(topics.filter(t => t.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const moveTopic = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= topics.length) return;

    const newTopics = [...topics];
    const [movedItem] = newTopics.splice(index, 1);
    newTopics.splice(newIndex, 0, movedItem);
    setTopics(newTopics);
  };

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
        <Button onClick={handleAdd} className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
          <Plus className="h-4 w-4" />
          Add New Topic
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <Card key={topic.id} className="group hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden flex flex-col bg-card">
            <div className="h-1.5 w-full bg-primary/20" />
            <CardHeader className="pb-4 relative">
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

              {/* Order Controls overlay - Horizontal */}
              <div className="absolute top-2 right-2 flex flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-6 w-6 rounded-md shadow-sm"
                  disabled={index === 0}
                  onClick={() => moveTopic(index, 'left')}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-6 w-6 rounded-md shadow-sm"
                  disabled={index === topics.length - 1}
                  onClick={() => moveTopic(index, 'right')}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow pb-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-muted-foreground uppercase tracking-widest">Total Modules</span>
                  <span className="text-foreground">{topic.totalQuestions} Sets</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0 p-6 bg-muted/5 group-hover:bg-muted/10 transition-colors flex gap-2">
              <Link href={`/admin/practice/${subjectId}/${topic.id}`} className="flex-grow">
                <Button className="w-full gap-2 rounded-xl font-bold" variant="outline">
                  Configure Sets <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEdit(topic)}
                  className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(topic.id)}
                  className={cn(
                    "h-10 w-10 rounded-xl transition-all",
                    confirmDeleteId === topic.id 
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                      : "hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  {confirmDeleteId === topic.id ? <div className="flex items-center gap-1 text-[10px] font-black"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">No topics found</h3>
          <p className="text-muted-foreground">Get started by creating your first practice topic for this subject.</p>
        </div>
      )}

      {/* Edit/Add Topic Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6 border-b pb-4">
            <SheetTitle className="text-xl font-headline font-bold text-foreground">
              {topics.some(t => t.id === editingTopic?.id) ? 'Edit Topic' : 'Add New Topic'}
            </SheetTitle>
            <SheetDescription className="font-medium">Define topic metadata and curriculum depth.</SheetDescription>
          </SheetHeader>
          
          {editingTopic && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="top-id" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Unique Slug / ID</Label>
                <Input 
                  id="top-id" 
                  value={editingTopic.id} 
                  onChange={(e) => setEditingTopic({...editingTopic, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="rounded-xl h-11 font-mono text-xs"
                  placeholder="e.g. time-and-work"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="top-title" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Topic Title</Label>
                <Input 
                  id="top-title" 
                  value={editingTopic.title} 
                  onChange={(e) => setEditingTopic({...editingTopic, title: e.target.value})}
                  className="rounded-xl h-11 font-bold"
                  placeholder="e.g. Time and Work"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Difficulty</Label>
                  <Select 
                    value={editingTopic.difficulty} 
                    onValueChange={(val: any) => setEditingTopic({...editingTopic, difficulty: val})}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Pick level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Total Modules</Label>
                  <Input 
                    type="number"
                    value={editingTopic.totalQuestions} 
                    onChange={(e) => setEditingTopic({...editingTopic, totalQuestions: parseInt(e.target.value) || 0})}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="p-6 bg-muted/30 rounded-2xl border space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Topic Preview</p>
                <div className="bg-background p-4 rounded-xl border shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      {getTopicIcon(editingTopic.title)}
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase font-black">{editingTopic.difficulty}</Badge>
                  </div>
                  <p className="font-bold text-base">{editingTopic.title || 'Untitled Topic'}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{editingTopic.totalQuestions} Modules Available</p>
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="mt-8 gap-2 pb-8">
            <SheetClose asChild>
              <Button variant="outline" className="w-full rounded-xl h-11 font-bold">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave} className="w-full gap-2 rounded-xl h-11 font-bold shadow-lg shadow-primary/20">
              <Save className="h-4 w-4" />
              Save Topic
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
