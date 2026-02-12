
"use client";

import { useParams } from "next/navigation";
import { getTopicSets, getPracticeSets, TopicSet, Question } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft, 
  Lock, 
  Clock, 
  HelpCircle, 
  Trophy, 
  Plus, 
  Edit2, 
  Trash2,
  Layers,
  ChevronUp,
  ChevronDown,
  Save,
  Check,
  FileJson,
  ListOrdered,
  AlertCircle,
  X,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import Link from "next/link";
import { useState } from "react";
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
  
  // Questions Management State
  const [managingQuestionsSet, setManagingQuestionsSet] = useState<TopicSet | null>(null);
  const [isQuestionsSheetOpen, setIsQuestionsSheetOpen] = useState(false);
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [questionsJson, setQuestionsJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Individual Question Editing State
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [tempQuestion, setTempQuestion] = useState<Question | null>(null);

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
      questions: 0,
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

  const handleManageQuestions = (set: TopicSet) => {
    setManagingQuestionsSet(set);
    // Initialize with dummy questions
    const initialQuestions: Question[] = [
      { id: 'q1', q: 'Find the value of $x$ in the equation $2^x = 1024$.', options: ['8', '9', '10', '12'], answer: 2, mdx: true },
      { id: 'q2', q: 'What is the largest 3-digit prime number?', options: ['991', '997', '993', '987'], answer: 1, mdx: false },
      { id: 'q3', q: 'Evaluate the integral: $\\int_{0}^{1} x^2 dx$', options: ['$1/2$', '$1/3$', '$1/4$', '$1$'], answer: 1, mdx: true },
      { id: 'q4', q: 'The sum of the first $n$ natural numbers is given by which formula?', options: ['$n^2$', '$\\frac{n(n+1)}{2}$', '$n(n+1)$', '$\\frac{n(n-1)}{2}$'], answer: 1, mdx: true },
      { id: 'q5', q: 'Which of these is NOT an irrational number?', options: ['$\\sqrt{2}$', '$\\pi$', '$\\sqrt{9}$', '$e$'], answer: 2, mdx: true }
    ];
    setQuestions(initialQuestions);
    setQuestionsJson(JSON.stringify(initialQuestions, null, 2));
    setIsQuestionsSheetOpen(true);
    setJsonError(null);
    setEditingQuestionIndex(null);
  };

  const handleSaveQuestions = () => {
    try {
      let finalQuestions = [...questions];
      if (isJsonMode) {
        const parsed = JSON.parse(questionsJson);
        if (!Array.isArray(parsed)) throw new Error("Questions must be an array");
        finalQuestions = parsed;
      }
      
      setQuestions(finalQuestions);
      if (managingQuestionsSet) {
        setSets(sets.map(s => s.id === managingQuestionsSet.id ? { ...s, questions: finalQuestions.length } : s));
      }
      setIsQuestionsSheetOpen(false);
      setManagingQuestionsSet(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  // Individual Question Actions
  const startEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setTempQuestion({ ...questions[index] });
  };

  const addNewQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      q: "",
      options: ["", "", "", ""],
      answer: 0,
      mdx: false
    };
    setQuestions([...questions, newQ]);
    startEditQuestion(questions.length);
  };

  const deleteQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
    setQuestionsJson(JSON.stringify(updated, null, 2));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const newQuestions = [...questions];
    const [movedItem] = newQuestions.splice(index, 1);
    newQuestions.splice(newIndex, 0, movedItem);
    setQuestions(newQuestions);
    setQuestionsJson(JSON.stringify(newQuestions, null, 2));
  };

  const saveIndividualQuestion = () => {
    if (editingQuestionIndex !== null && tempQuestion) {
      const updated = [...questions];
      updated[editingQuestionIndex] = tempQuestion;
      setQuestions(updated);
      setQuestionsJson(JSON.stringify(updated, null, 2));
      setEditingQuestionIndex(null);
      setTempQuestion(null);
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

                <div className={cn(
                  "h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl font-headline text-xl font-bold transition-colors",
                  "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                )}>
                  {index + 1}
                </div>

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

                <div className="shrink-0 flex items-center gap-2">
                  <Button 
                    variant="outline"
                    className="rounded-xl h-10 px-4 font-bold border-primary/20 text-primary hover:bg-primary/5"
                    onClick={() => handleManageQuestions(set)}
                  >
                    Manage Questions
                  </Button>
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
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Time (Mins)</Label>
                  <Input 
                    type="number"
                    value={editingSet.timeLimit} 
                    onChange={(e) => setEditingSet({...editingSet, timeLimit: parseInt(e.target.value) || 0})}
                    className="rounded-xl h-11"
                  />
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
                      <SelectItem value="premium">Premium Only</SelectItem>
                    </SelectContent>
                  </Select>
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

      <Sheet open={isQuestionsSheetOpen} onOpenChange={setIsQuestionsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6 border-b pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-headline font-bold flex items-center gap-2">
                <FileJson className="h-5 w-5 text-primary" /> Manage Questions
              </SheetTitle>
              {editingQuestionIndex !== null && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditingQuestionIndex(null)}
                  className="rounded-lg h-8 gap-1.5 text-muted-foreground"
                >
                  <X className="h-4 w-4" /> Back to List
                </Button>
              )}
            </div>
            <SheetDescription className="font-medium">
              Update test questions for <span className="text-foreground font-bold">"{managingQuestionsSet?.title}"</span>.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-4">
            {editingQuestionIndex === null && (
              <div className="flex items-center justify-between bg-muted/30 p-1 rounded-xl border">
                <Button 
                  variant={isJsonMode ? "ghost" : "secondary"} 
                  className={cn("flex-1 gap-2 rounded-lg", !isJsonMode && "shadow-sm")}
                  onClick={() => setIsJsonMode(false)}
                >
                  <ListOrdered className="h-4 w-4" /> List View
                </Button>
                <Button 
                  variant={isJsonMode ? "secondary" : "ghost"} 
                  className={cn("flex-1 gap-2 rounded-lg", isJsonMode && "shadow-sm")}
                  onClick={() => setIsJsonMode(true)}
                >
                  <FileJson className="h-4 w-4" /> JSON Editor
                </Button>
              </div>
            )}

            {jsonError && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>JSON Error</AlertTitle>
                <AlertDescription className="text-xs font-mono">{jsonError}</AlertDescription>
              </Alert>
            )}

            {editingQuestionIndex !== null && tempQuestion ? (
              // Individual Question Edit Form
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Question Text</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="q-mdx" className="text-[10px] font-bold uppercase cursor-pointer">MDX Mode</Label>
                      <Switch 
                        id="q-mdx"
                        checked={tempQuestion.mdx} 
                        onCheckedChange={(val) => setTempQuestion({...tempQuestion, mdx: val})} 
                      />
                    </div>
                  </div>
                  <Textarea 
                    value={tempQuestion.q}
                    onChange={(e) => setTempQuestion({...tempQuestion, q: e.target.value})}
                    className="min-h-[120px] rounded-xl font-semibold leading-relaxed"
                    placeholder="Enter the question text here..."
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Answer Options</Label>
                  <RadioGroup 
                    value={tempQuestion.answer.toString()} 
                    onValueChange={(val) => setTempQuestion({...tempQuestion, answer: parseInt(val)})}
                    className="space-y-3"
                  >
                    {tempQuestion.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 shrink-0">
                          <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="h-5 w-5" />
                        </div>
                        <Input 
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...tempQuestion.options];
                            newOptions[idx] = e.target.value;
                            setTempQuestion({...tempQuestion, options: newOptions});
                          }}
                          className="rounded-xl h-11"
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditingQuestionIndex(null)}>
                    Discard
                  </Button>
                  <Button className="flex-1 rounded-xl gap-2 shadow-lg" onClick={saveIndividualQuestion}>
                    <Save className="h-4 w-4" /> Save Question
                  </Button>
                </div>
              </div>
            ) : isJsonMode ? (
              // JSON Mode
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Raw Question Bank (JSON)</Label>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase font-bold">Array Format</span>
                </div>
                <Textarea 
                  value={questionsJson}
                  onChange={(e) => {
                    setQuestionsJson(e.target.value);
                    setJsonError(null);
                  }}
                  className="min-h-[400px] font-mono text-xs p-4 rounded-xl leading-relaxed resize-none border-primary/10"
                  placeholder='[ { "id": "q1", "q": "Question text...", "options": [...], "answer": 0, "mdx": true } ]'
                />
              </div>
            ) : (
              // List View Mode
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-muted/20 border rounded-2xl group relative hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase">Q{idx + 1}</Badge>
                        {q.mdx && <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary uppercase">MDX</Badge>}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={idx === 0}
                          onClick={() => moveQuestion(idx, 'up')}
                          className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={idx === questions.length - 1}
                          onClick={() => moveQuestion(idx, 'down')}
                          className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => startEditQuestion(idx)}
                          className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteQuestion(idx)}
                          className="h-7 w-7 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      {q.mdx ? (
                        <MarkdownRenderer content={q.q} className="prose-sm font-bold" />
                      ) : (
                        <p className="text-sm font-bold leading-relaxed line-clamp-3">{q.q}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={cn(
                          "p-2 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-2",
                          q.answer === oIdx ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" : "bg-background text-muted-foreground"
                        )}>
                          <span className="opacity-50 shrink-0">{String.fromCharCode(65 + oIdx)}.</span>
                          <div className="flex-grow">
                            {q.mdx ? (
                              <MarkdownRenderer content={opt} className="prose-sm prose-p:m-0" />
                            ) : (
                              <span className="line-clamp-1">{opt}</span>
                            )}
                          </div>
                          {q.answer === oIdx && <Check className="h-3 w-3 ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Button 
                  onClick={addNewQuestion}
                  variant="outline" 
                  className="w-full border-dashed rounded-xl h-12 gap-2 text-muted-foreground hover:text-primary transition-all hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4" /> Add Individual Question
                </Button>
              </div>
            )}
          </div>

          <SheetFooter className="mt-8 gap-2 pb-8">
            <SheetClose asChild>
              <Button variant="outline" className="w-full rounded-xl h-11 font-bold">Discard</Button>
            </SheetClose>
            <Button 
              disabled={editingQuestionIndex !== null}
              onClick={handleSaveQuestions} 
              className="w-full gap-2 rounded-xl h-11 font-bold shadow-lg shadow-primary/20"
            >
              <Save className="h-4 w-4" />
              Commit Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
