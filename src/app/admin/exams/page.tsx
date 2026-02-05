"use client";

import { EXAMS, CATEGORIES, Exam, getMockTests, getTests, getPrevPapers, getQuizzes, getContent } from "@/lib/api";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  Edit2, 
  Trash2, 
  Save, 
  Check, 
  ChevronRight, 
  Filter, 
  GraduationCap, 
  Layers, 
  X, 
  BookOpen, 
  Layout,
  Image as ImageIcon,
  Upload,
  Trophy,
  ClipboardCheck,
  History,
  LibraryBig
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
  SelectValue 
} from "@/components/ui/select";
import { MediaLibraryDialog } from "@/components/MediaLibraryDialog";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>(EXAMS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Drawer State
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newStage, setNewStage] = useState("");
  const [newSubject, setNewSubject] = useState("");

  // Media Selection State
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);

  // Deletion Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || exam.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [exams, search, categoryFilter]);

  const handleEdit = (exam: Exam) => {
    setEditingExam({ 
      ...exam, 
      stages: exam.stages || [], 
      subjects: exam.subjects || [] 
    });
    setIsSheetOpen(true);
  };

  const handleAddExam = () => {
    const newId = (exams.length + 1).toString();
    const newExam: Exam = {
      id: newId,
      slug: `new-exam-${newId}`,
      title: "New Exam Title",
      category: CATEGORIES[0],
      description: "Brief description of the exam.",
      trending: false,
      image: `https://picsum.photos/seed/${newId}/600/400`,
      stages: [],
      subjects: []
    };
    setExams([...exams, newExam]);
    handleEdit(newExam);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setExams(exams.filter(e => e.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const handleSave = () => {
    if (editingExam) {
      setExams(exams.map(e => e.id === editingExam.id ? editingExam : e));
      setIsSheetOpen(false);
    }
  };

  const addItem = (type: 'stage' | 'subject') => {
    if (type === 'stage' && newStage.trim() && editingExam) {
      setEditingExam({
        ...editingExam,
        stages: [...(editingExam.stages || []), newStage.trim()]
      });
      setNewStage("");
    } else if (type === 'subject' && newSubject.trim() && editingExam) {
      setEditingExam({
        ...editingExam,
        subjects: [...(editingExam.subjects || []), newSubject.trim()]
      });
      setNewSubject("");
    }
  };

  const removeItem = (type: 'stage' | 'subject', index: number) => {
    if (editingExam) {
      if (type === 'stage') {
        const updated = [...editingExam.stages];
        updated.splice(index, 1);
        setEditingExam({ ...editingExam, stages: updated });
      } else {
        const updated = [...editingExam.subjects];
        updated.splice(index, 1);
        setEditingExam({ ...editingExam, subjects: updated });
      }
    }
  };

  const handleSelectMedia = (item: any) => {
    if (editingExam) {
      setEditingExam({
        ...editingExam,
        image: item.url
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Exam Management</h1>
          <p className="text-muted-foreground text-sm">Add new exams, define stages (levels/sections), and assign subjects.</p>
        </div>
        <Button onClick={handleAddExam} className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Create New Exam
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by exam title..." 
            className="pl-10 rounded-xl bg-background border-none shadow-sm h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
              <div className="flex items-center gap-2">
                <Filter className="h-3 w-3 text-muted-foreground" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExams.map((exam) => {
          // Analytics calculations
          const mockCount = getMockTests(exam.slug).length;
          const sectionalCount = getTests(exam.slug).length;
          const prevCount = getPrevPapers(exam.slug).length;
          const quizCount = getQuizzes(exam.slug).length;
          const contentCount = getContent(exam.slug).length;

          return (
            <Card key={exam.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all flex flex-col bg-card">
              <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                <img src={exam.image} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-white/90 text-primary border-none shadow-sm backdrop-blur-sm text-[10px] font-bold">
                    {exam.category}
                  </Badge>
                </div>
                {exam.trending && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-amber-600 text-white border-none shadow-sm text-[10px] font-bold">
                      <TrendingUp className="h-3 w-3 mr-1" /> TRENDING
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader className="p-4 pb-2">
                <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{exam.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{exam.description}</p>
              </CardHeader>
              <CardContent className="p-4 pt-2 flex-grow space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] uppercase font-black text-muted-foreground tracking-widest block mb-1">Stages / Levels</span>
                    <div className="flex flex-wrap gap-1">
                      {exam.stages?.slice(0, 2).map((st, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] font-bold">
                          {st}
                        </Badge>
                      ))}
                      {(exam.stages?.length || 0) > 2 && (
                        <Badge variant="secondary" className="bg-muted text-[9px] font-bold text-muted-foreground">
                          +{(exam.stages?.length || 0) - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Preparation Analytics Section */}
                  <div className="pt-3 border-t">
                    <span className="text-[9px] uppercase font-black text-muted-foreground tracking-widest block mb-2">Preparation Analytics</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center justify-center p-1.5 bg-amber-500/5 rounded-xl border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                        <Trophy className="h-3 w-3 text-amber-600 mb-1" />
                        <span className="text-[10px] font-black text-amber-700">{mockCount}</span>
                        <span className="text-[7px] uppercase font-bold text-amber-600/70">Mocks</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1.5 bg-blue-500/5 rounded-xl border border-blue-500/10 hover:bg-blue-500/10 transition-colors">
                        <ClipboardCheck className="h-3 w-3 text-blue-600 mb-1" />
                        <span className="text-[10px] font-black text-blue-700">{sectionalCount}</span>
                        <span className="text-[7px] uppercase font-bold text-blue-600/70">Tests</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                        <History className="h-3 w-3 text-emerald-600 mb-1" />
                        <span className="text-[10px] font-black text-emerald-700">{prevCount}</span>
                        <span className="text-[7px] uppercase font-bold text-emerald-600/70">Papers</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1.5 bg-purple-500/5 rounded-xl border border-purple-500/10 hover:bg-purple-500/10 transition-colors">
                        <LibraryBig className="h-3 w-3 text-purple-600 mb-1" />
                        <span className="text-[10px] font-black text-purple-700">{contentCount}</span>
                        <span className="text-[7px] uppercase font-bold text-purple-600/70">Files</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1.5 bg-orange-500/5 rounded-xl border border-orange-500/10 hover:bg-orange-500/10 transition-colors">
                        <Layout className="h-3 w-3 text-orange-600 mb-1" />
                        <span className="text-[10px] font-black text-orange-700">{quizCount}</span>
                        <span className="text-[7px] uppercase font-bold text-orange-600/70">Quiz</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between border-t bg-muted/5 mt-auto">
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(exam)}
                    className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(exam.id)}
                    className={cn(
                      "h-8 w-8 rounded-lg transition-all",
                      confirmDeleteId === exam.id 
                        ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                        : "hover:bg-destructive/10 hover:text-destructive"
                    )}
                  >
                    {confirmDeleteId === exam.id ? <div className="flex items-center gap-1 text-[10px] font-bold"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">ID: {exam.id}</span>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No exams found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* Edit Exam Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Manage Exam Details</SheetTitle>
            <SheetDescription>Configure metadata, hierarchical stages (sections/levels), and curriculum subjects.</SheetDescription>
          </SheetHeader>
          
          {editingExam && (
            <div className="space-y-8 py-4">
              {/* Exam Icon Section */}
              <div className="space-y-4">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Exam Icon / Banner</Label>
                <div className="flex items-center gap-6 p-6 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/30 group">
                  <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden bg-background shadow-inner ring-1 ring-border group-hover:ring-primary/50 transition-all">
                    <img src={editingExam.image} alt="" className="object-cover w-full h-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => setIsMediaDialogOpen(true)}
                        variant="outline" 
                        size="sm" 
                        className="h-9 rounded-xl text-[11px] font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/5"
                      >
                        <ImageIcon className="h-3.5 w-3.5 mr-2 text-primary" /> Select from Library
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 rounded-xl text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        <Upload className="h-3.5 w-3.5 mr-2" /> Upload New
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Recommended: High resolution square or 16:10 aspect ratio image. Max 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Info */}
              <div className="space-y-4 pt-6 border-t">
                <div className="space-y-2">
                  <Label htmlFor="edit-exam-title">Exam Title</Label>
                  <Input 
                    id="edit-exam-title" 
                    value={editingExam.title} 
                    onChange={(e) => setEditingExam({...editingExam, title: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Exam Slug</Label>
                    <Input 
                      value={editingExam.slug} 
                      onChange={(e) => setEditingExam({...editingExam, slug: e.target.value})}
                      className="rounded-xl h-11 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={editingExam.category} 
                      onValueChange={(val) => setEditingExam({...editingExam, category: val})}
                    >
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    value={editingExam.description} 
                    onChange={(e) => setEditingExam({...editingExam, description: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Trending Status</p>
                    <p className="text-xs text-muted-foreground">Showcase this exam on the home page trending section.</p>
                  </div>
                  <Switch 
                    checked={editingExam.trending} 
                    onCheckedChange={(val) => setEditingExam({...editingExam, trending: val})} 
                  />
                </div>
              </div>

              {/* Stages Management */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="h-4 w-4 text-primary" />
                    <Label className="text-base font-bold">Exam Stages / Levels</Label>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary uppercase text-[9px] font-bold">{editingExam.stages?.length || 0} Defined</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Add sections like "Section A", "Prelims", or "Level 1".</p>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. Section A" 
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('stage')}
                    className="rounded-xl h-11"
                  />
                  <Button onClick={() => addItem('stage')} type="button" size="icon" className="shrink-0 h-11 w-11 rounded-xl">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {editingExam.stages?.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group">
                      <span className="text-xs font-bold">{stage}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem('stage', index)}
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subjects Management */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <Label className="text-base font-bold">Exam Subjects</Label>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 uppercase text-[9px] font-bold">{editingExam.subjects?.length || 0} Added</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Define subjects like "Mathematics", "Logical Reasoning", etc.</p>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. Quantitative Aptitude" 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('subject')}
                    className="rounded-xl h-11"
                  />
                  <Button onClick={() => addItem('subject')} type="button" size="icon" className="shrink-0 h-11 w-11 rounded-xl">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {editingExam.subjects?.map((subject, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-full group transition-colors hover:border-primary">
                      <span className="text-[11px] font-bold">{subject}</span>
                      <button 
                        onClick={() => removeItem('subject', index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
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
              Save Exam Configuration
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Media Picker Dialog */}
      <MediaLibraryDialog 
        open={isMediaDialogOpen} 
        onOpenChange={setIsMediaDialogOpen} 
        onSelect={handleSelectMedia}
        allowedTypes={['image']}
      />
    </div>
  );
}
