"use client";

import { useParams } from "next/navigation";
import { getTopicSets, getPracticeSets, TopicSet } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Layers,
  ChevronUp,
  ChevronDown,
  Save,
  Check
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

export default function AdminTopicSetsPage() {
  const params = useParams();
  const subjectId = params.subject_id as string;
  const topicId = params.topic_id as string;
  
  const [sets, setSets] = useState<TopicSet[]>(getTopicSets(topicId));
  const topics = getPracticeSets(subjectId);
  const currentTopic = topics.find(t => t.id === topicId);

  // CRUD State
  const [editingSet, setEditingSet] = useState<TopicSet | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleEdit = (set: TopicSet) => {
    setEditingSet({ ...set });
    setIsSheetOpen(true);
  };

  const handleAdd = () => {
    const newId = `set-${sets.length + 1}`;
    setEditingSet({
      id: newId,
      title: "New Practice Set",
      questions: 10,
      timeLimit: 10,
      isCompleted: false,
      isFree: true
    });
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (editingSet) {
      const exists = sets.some(s => s.id === editingSet.id);
      if (exists) {
        setSets(sets.map(s => s.id === editingSet.id ? editingSet : s));
      } else {
        setSets([...sets, editingSet]);
      }
      setIsSheetOpen(false);
      setEditingSet(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setSets(sets.filter(s => s.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const moveSet = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sets.length) return;

    const newSets = [...sets];
    const [movedItem] = newSets.splice(index, 1);
    newSets.splice(newIndex, 0, movedItem);
    setSets(newSets);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link href={`/admin/practice/${subjectId}`} className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-2">
            <ArrowLeft className="mr-1.5 h-3 w-3" /> Back to Topics
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Layers className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-foreground">{currentTopic?.title || 'Practice Sets'}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd} className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
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
                {/* Reordering Controls - Vertical */}
                <div className="flex flex-col gap-1 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg hover:bg-primary/10"
                    disabled={index === 0}
                    onClick={() => moveSet(index, 'up')}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg hover:bg-primary/10"
                    disabled={index === sets.length - 1}
                    onClick={() => moveSet(index, 'down')}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

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
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                        Free Access
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-600/10 text-amber-600 border-none text-[9px] font-black uppercase tracking-widest flex gap-1 items-center px-2 py-0.5">
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
                      <span>ID: {set.id}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(set)}
                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(set.id)}
                    className={cn(
                      "h-10 w-10 rounded-xl transition-all",
                      confirmDeleteId === set.id 
                        ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                        : "hover:bg-destructive/10 hover:text-destructive"
                    )}
                  >
                    {confirmDeleteId === set.id ? <div className="flex items-center gap-1 text-[10px] font-black uppercase"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
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

      {/* Edit/Add Set Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6 border-b pb-4">
            <SheetTitle className="text-xl font-headline font-bold text-foreground">
              {sets.some(s => s.id === editingSet?.id) ? 'Edit Practice Set' : 'Add New Set'}
            </SheetTitle>
            <SheetDescription className="font-medium">Define parameters and access requirements for this set.</SheetDescription>
          </SheetHeader>
          
          {editingSet && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="set-id" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Unique ID</Label>
                <Input 
                  id="set-id" 
                  value={editingSet.id} 
                  onChange={(e) => setEditingSet({...editingSet, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="rounded-xl h-11 font-mono text-xs"
                  placeholder="e.g. basic-test-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="set-title" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Set Title</Label>
                <Input 
                  id="set-title" 
                  value={editingSet.title} 
                  onChange={(e) => setEditingSet({...editingSet, title: e.target.value})}
                  className="rounded-xl h-11 font-bold"
                  placeholder="e.g. Practice Set 1: Basic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Questions</Label>
                  <Input 
                    type="number"
                    value={editingSet.questions} 
                    onChange={(e) => setEditingSet({...editingSet, questions: parseInt(e.target.value) || 0})}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Time (Mins)</Label>
                  <Input 
                    type="number"
                    value={editingSet.timeLimit} 
                    onChange={(e) => setEditingSet({...editingSet, timeLimit: parseInt(e.target.value) || 0})}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Access Mode</Label>
                <Select 
                  value={editingSet.isFree ? "free" : "premium"} 
                  onValueChange={(val: any) => setEditingSet({...editingSet, isFree: val === "free"})}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free Access</SelectItem>
                    <SelectItem value="premium">Premium Holders Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-6 bg-muted/30 rounded-2xl border space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Set Preview</p>
                <div className="bg-background p-4 rounded-xl border shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-10 w-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary font-bold">
                      #
                    </div>
                    {editingSet.isFree ? (
                      <Badge className="bg-emerald-500 text-white text-[8px] uppercase font-black">Free</Badge>
                    ) : (
                      <Badge className="bg-amber-600 text-white text-[8px] uppercase font-black">Premium</Badge>
                    )}
                  </div>
                  <p className="font-bold text-base">{editingSet.title || 'Untitled Set'}</p>
                  <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground font-bold">
                    <span>{editingSet.questions} Qs</span>
                    <span>{editingSet.timeLimit} Mins</span>
                  </div>
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
              Save Practice Set
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
