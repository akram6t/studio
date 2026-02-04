"use client";

import { EXAMS, CATEGORIES, Exam } from "@/lib/api";
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
  X
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
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>(EXAMS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Drawer State
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newSection, setNewSection] = useState("");

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
    setEditingExam({ ...exam, sections: exam.sections || [] });
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
      sections: []
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

  const addSection = () => {
    if (newSection.trim() && editingExam) {
      setEditingExam({
        ...editingExam,
        sections: [...(editingExam.sections || []), newSection.trim()]
      });
      setNewSection("");
    }
  };

  const removeSection = (index: number) => {
    if (editingExam) {
      const updatedSections = [...editingExam.sections];
      updatedSections.splice(index, 1);
      setEditingExam({ ...editingExam, sections: updatedSections });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Exam Management</h1>
          <p className="text-muted-foreground text-sm">Add new exams, define sections, and assign categories.</p>
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
        {filteredExams.map((exam) => (
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
            <CardContent className="p-4 pt-2 flex-grow">
              <div className="flex flex-wrap gap-1 mt-2">
                {exam.sections?.slice(0, 3).map((sec, i) => (
                  <Badge key={i} variant="secondary" className="bg-muted text-[9px] font-bold text-muted-foreground">
                    {sec}
                  </Badge>
                ))}
                {(exam.sections?.length || 0) > 3 && (
                  <Badge variant="secondary" className="bg-muted text-[9px] font-bold text-muted-foreground">
                    +{(exam.sections?.length || 0) - 3} more
                  </Badge>
                )}
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
              <span className="text-[10px] text-muted-foreground font-bold">SLUG: {exam.slug}</span>
            </CardFooter>
          </Card>
        ))}
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
            <SheetDescription>Configure exam metadata, categories, and core sections.</SheetDescription>
          </SheetHeader>
          
          {editingExam && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-exam-title">Exam Title</Label>
                  <Input 
                    id="edit-exam-title" 
                    value={editingExam.title} 
                    onChange={(e) => setEditingExam({...editingExam, title: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Exam Slug</Label>
                    <Input 
                      value={editingExam.slug} 
                      onChange={(e) => setEditingExam({...editingExam, slug: e.target.value})}
                      className="rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={editingExam.category} 
                      onValueChange={(val) => setEditingExam({...editingExam, category: val})}
                    >
                      <SelectTrigger className="rounded-xl">
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
                    className="rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Trending Status</p>
                    <p className="text-xs text-muted-foreground">Promote this exam on the home page trending section.</p>
                  </div>
                  <Switch 
                    checked={editingExam.trending} 
                    onCheckedChange={(val) => setEditingExam({...editingExam, trending: val})} 
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold">Exam Sections</Label>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">{editingExam.sections?.length || 0} Total</Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a section name (e.g. Reasoning)" 
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSection()}
                      className="rounded-xl"
                    />
                    <Button onClick={addSection} type="button" size="icon" className="shrink-0 rounded-xl">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                    {editingExam.sections?.map((section, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group">
                        <span className="text-sm font-medium">{section}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeSection(index)}
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    {(!editingExam.sections || editingExam.sections.length === 0) && (
                      <p className="text-xs text-center text-muted-foreground italic py-4">No sections added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="mt-8 gap-2">
            <SheetClose asChild>
              <Button variant="outline" className="w-full rounded-xl">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave} className="w-full gap-2 rounded-xl shadow-lg">
              <Save className="h-4 w-4" />
              Save Exam
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
