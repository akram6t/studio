"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calculator, 
  Languages, 
  BrainCircuit, 
  Globe, 
  ArrowRight,
  Plus,
  BarChart3,
  Target,
  Edit2,
  Trash2,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Layout,
  FlaskConical,
  History,
  Microscope,
  Type
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
import { useState } from "react";
import { cn } from "@/lib/utils";

// Define a type for supported icons
type IconName = 'calculator' | 'languages' | 'brain' | 'globe' | 'target' | 'book' | 'trending' | 'layout' | 'science' | 'history' | 'microscope' | 'text';

interface Subject {
  id: string;
  title: string;
  description: string;
  iconName: IconName;
  color: string;
  topicsCount: number | string;
  questionsCount: string;
}

const ICON_MAP: Record<IconName, React.ReactNode> = {
  calculator: <Calculator className="h-6 w-6" />,
  languages: <Languages className="h-6 w-6" />,
  brain: <BrainCircuit className="h-6 w-6" />,
  globe: <Globe className="h-6 w-6" />,
  target: <Target className="h-6 w-6" />,
  book: <BookOpen className="h-6 w-6" />,
  trending: <TrendingUp className="h-6 w-6" />,
  layout: <Layout className="h-6 w-6" />,
  science: <FlaskConical className="h-6 w-6" />,
  history: <History className="h-6 w-6" />,
  microscope: <Microscope className="h-6 w-6" />,
  text: <Type className="h-6 w-6" />
};

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "quant",
    title: "Quantitative Aptitude",
    description: "Arithmetic, Algebra, Geometry, and Data Interpretation.",
    iconName: "calculator",
    color: "bg-blue-500",
    topicsCount: 12,
    questionsCount: "1200+"
  },
  {
    id: "english",
    title: "English Language",
    description: "Grammar, Vocabulary, and Reading Comprehension.",
    iconName: "languages",
    color: "bg-emerald-500",
    topicsCount: 8,
    questionsCount: "1500+"
  },
  {
    id: "reasoning",
    title: "Reasoning Ability",
    description: "Logical puzzles, Series, and Analytical reasoning.",
    iconName: "brain",
    color: "bg-purple-500",
    topicsCount: 10,
    questionsCount: "1000+"
  },
  {
    id: "gk",
    title: "General Knowledge",
    description: "History, Geography, Science, and Current Affairs.",
    iconName: "globe",
    color: "bg-orange-500",
    topicsCount: 15,
    questionsCount: "2000+"
  }
];

const COLOR_OPTIONS = [
  { label: "Blue", value: "bg-blue-500" },
  { label: "Emerald", value: "bg-emerald-500" },
  { label: "Purple", value: "bg-purple-500" },
  { label: "Orange", value: "bg-orange-500" },
  { label: "Red", value: "bg-red-500" },
  { label: "Indigo", value: "bg-indigo-500" },
  { label: "Pink", value: "bg-pink-500" },
];

const ICON_OPTIONS: { label: string, value: IconName }[] = [
  { label: "Calculator", value: "calculator" },
  { label: "Languages", value: "languages" },
  { label: "Brain", value: "brain" },
  { label: "Globe", value: "globe" },
  { label: "Target", value: "target" },
  { label: "Book", value: "book" },
  { label: "Trending", value: "trending" },
  { label: "Layout", value: "layout" },
  { label: "Science", value: "science" },
  { label: "History", value: "history" },
  { label: "Microscope", value: "microscope" },
  { label: "Text", value: "text" },
];

export default function AdminPracticePage() {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  
  // CRUD State
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleEdit = (subject: Subject) => {
    setEditingSubject({ ...subject });
    setIsSheetOpen(true);
  };

  const handleAdd = () => {
    const newId = `subject-${subjects.length + 1}`;
    setEditingSubject({
      id: newId,
      title: "New Subject",
      description: "Enter a brief description here.",
      iconName: "target",
      color: "bg-blue-500",
      topicsCount: 0,
      questionsCount: "0"
    });
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (editingSubject) {
      const exists = subjects.some(s => s.id === editingSubject.id);
      if (exists) {
        setSubjects(subjects.map(s => s.id === editingSubject.id ? editingSubject : s));
      } else {
        setSubjects([...subjects, editingSubject]);
      }
      setIsSheetOpen(false);
      setEditingSubject(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setSubjects(subjects.filter(s => s.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const moveSubject = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= subjects.length) return;

    const newSubjects = [...subjects];
    const [movedItem] = newSubjects.splice(index, 1);
    newSubjects.splice(newIndex, 0, movedItem);
    setSubjects(newSubjects);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-foreground">Practice Subject Management</h1>
          <p className="text-muted-foreground text-sm font-medium">Define subjects, organize topics and manage question banks.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
          <Plus className="h-4 w-4" />
          Add New Subject
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <Card key={subject.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all bg-card flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-2 relative">
              <div className={cn(
                "p-3 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110",
                subject.color
              )}>
                {ICON_MAP[subject.iconName]}
              </div>
              <div className="flex-grow min-w-0">
                <CardTitle className="text-lg truncate">{subject.title}</CardTitle>
                <CardDescription className="line-clamp-1 text-[11px] font-semibold uppercase tracking-wider">{subject.id}</CardDescription>
              </div>
              
              {/* Order Controls overlay - Horizontal */}
              <div className="absolute top-2 right-2 flex flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-6 w-6 rounded-md shadow-sm"
                  disabled={index === 0}
                  onClick={() => moveSubject(index, 'left')}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-6 w-6 rounded-md shadow-sm"
                  disabled={index === subjects.length - 1}
                  onClick={() => moveSubject(index, 'right')}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
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
            </CardContent>
            <CardFooter className="pt-0 p-4 bg-muted/5 flex gap-2">
              <Link href={`/admin/practice/${subject.id}`} className="flex-grow">
                <Button className="w-full gap-2 rounded-xl h-10 font-bold" variant="outline">
                  Manage Topics <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEdit(subject)}
                  className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(subject.id)}
                  className={cn(
                    "h-10 w-10 rounded-xl transition-all",
                    confirmDeleteId === subject.id 
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                      : "hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  {confirmDeleteId === subject.id ? <div className="flex items-center gap-1 text-[10px] font-black"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">No subjects defined</h3>
          <p className="text-muted-foreground">Create your first practice subject to start organizing curriculum.</p>
        </div>
      )}

      {/* Edit/Add Subject Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6 border-b pb-4">
            <SheetTitle className="text-xl font-headline font-bold text-foreground">
              {subjects.some(s => s.id === editingSubject?.id) ? 'Edit Subject' : 'Add New Subject'}
            </SheetTitle>
            <SheetDescription className="font-medium">Configure core subject details and presentation.</SheetDescription>
          </SheetHeader>
          
          {editingSubject && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="sub-id" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Unique Slug / ID</Label>
                <Input 
                  id="sub-id" 
                  value={editingSubject.id} 
                  onChange={(e) => setEditingSubject({...editingSubject, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="rounded-xl h-11 font-mono text-xs"
                  placeholder="e.g. logic-reasoning"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-title" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Subject Title</Label>
                <Input 
                  id="sub-title" 
                  value={editingSubject.title} 
                  onChange={(e) => setEditingSubject({...editingSubject, title: e.target.value})}
                  className="rounded-xl h-11 font-bold"
                  placeholder="e.g. Verbal Reasoning"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-desc" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Short Description</Label>
                <Textarea 
                  id="sub-desc" 
                  value={editingSubject.description} 
                  onChange={(e) => setEditingSubject({...editingSubject, description: e.target.value})}
                  className="rounded-xl min-h-[100px] resize-none"
                  placeholder="Describe what this subject covers..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Subject Icon</Label>
                  <Select 
                    value={editingSubject.iconName} 
                    onValueChange={(val: IconName) => setEditingSubject({...editingSubject, iconName: val})}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Pick an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <span className="scale-75">{ICON_MAP[opt.value]}</span>
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Theme Color</Label>
                  <Select 
                    value={editingSubject.color} 
                    onValueChange={(val) => setEditingSubject({...editingSubject, color: val})}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Pick a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn("h-3 w-3 rounded-full", opt.value)} />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-6 bg-muted/30 rounded-2xl border flex flex-col items-center justify-center text-center space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dashboard Preview</p>
                </div>
                <div className={cn("p-5 rounded-[2rem] text-white shadow-2xl scale-110", editingSubject.color)}>
                  {ICON_MAP[editingSubject.iconName]}
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold">{editingSubject.title || 'Untitled Subject'}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{editingSubject.id || 'no-id'}</p>
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
              Save Subject
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
