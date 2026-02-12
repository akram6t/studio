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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Languages,
  Globe,
  Settings2
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
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

const AVAILABLE_LANGUAGES = [
  "English", "Hindi", "Marathi", "Bengali", "Telugu", "Tamil", "Gujarati", "Kannada", "Odia", "Malayalam", "Punjabi"
];

export default function AdminTopicSetsPage() {
  const params = useParams();
  const subjectId = params.subject_id as string;
  const topicId = params.topic_id as string;
  
  const [sets, setSets] = useState<TopicSet[]>([]);
  const [currentTopic, setCurrentTopic] = useState<any>(null);

  useEffect(() => {
    setSets(getTopicSets(topicId));
    const topics = getPracticeSets(subjectId);
    setCurrentTopic(topics.find(t => t.id === topicId));
  }, [topicId, subjectId]);

  // CRUD State
  const [editingSet, setEditingSet] = useState<TopicSet | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Questions Management State
  const [managingQuestionsSet, setManagingQuestionsSet] = useState<TopicSet | null>(null);
  const [isQuestionsSheetOpen, setIsQuestionsSheetOpen] = useState(false);
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [activeLang, setActiveLang] = useState<string>("");
  
  // Dynamic language questions state
  const [questionsByLang, setQuestionsByLang] = useState<Record<string, Question[]>>({});
  const [jsonByLang, setJsonByLang] = useState<Record<string, string>>({});
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  // Individual Question Editing State
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [tempQuestion, setTempQuestion] = useState<Question | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleEdit = (set: TopicSet) => {
    setEditingSet({ ...set, languages: set.languages || ['English'] });
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
      isFree: true,
      languages: ['English']
    });
    setIsSheetOpen(true);
  };

  const toggleLanguage = (lang: string) => {
    if (!editingSet) return;
    const currentLangs = editingSet.languages || [];
    if (currentLangs.includes(lang)) {
      if (currentLangs.length > 1) {
        setEditingSet({ ...editingSet, languages: currentLangs.filter(l => l !== lang) });
      }
    } else {
      setEditingSet({ ...editingSet, languages: [...currentLangs, lang] });
    }
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
    const langs = set.languages || ['English'];
    
    // Initialize state for each selected language
    const initialQs: Record<string, Question[]> = {};
    const initialJson: Record<string, string> = {};
    
    langs.forEach(lang => {
      // Mock initial data based on language
      const mockQs: Question[] = [
        { id: `q1-${lang}`, q: `[${lang}] Find the value of $x$ in the equation $2^x = 1024$.`, options: ['8', '9', '10', '12'], answer: 2, mdx: true },
        { id: `q2-${lang}`, q: `[${lang}] What is the largest 3-digit prime number?`, options: ['991', '997', '993', '987'], answer: 1, mdx: false }
      ];
      initialQs[lang] = mockQs;
      initialJson[lang] = JSON.stringify(mockQs, null, 2);
    });

    setQuestionsByLang(initialQs);
    setJsonByLang(initialJson);
    setActiveLang(langs[0]);
    setIsQuestionsSheetOpen(true);
    setJsonError(null);
    setEditingQuestionIndex(null);
    setIsJsonMode(false);
  };

  const handleLanguageChange = (lang: string) => {
    if (isJsonMode) {
      try {
        const parsed = JSON.parse(jsonByLang[activeLang]);
        const updatedQs = { ...questionsByLang, [activeLang]: parsed };
        setQuestionsByLang(updatedQs);
      } catch (e: any) {
        setJsonError(`Please fix JSON errors in ${activeLang} before switching.`);
        return;
      }
    }
    
    setActiveLang(lang);
    setJsonError(null);
    setEditingQuestionIndex(null);
  };

  const handleSaveQuestions = () => {
    try {
      const finalQuestions = { ...questionsByLang };
      
      if (isJsonMode) {
        const parsed = JSON.parse(jsonByLang[activeLang]);
        if (!Array.isArray(parsed)) throw new Error("Questions must be an array");
        finalQuestions[activeLang] = parsed;
      }
      
      if (managingQuestionsSet) {
        setSets(sets.map(s => s.id === managingQuestionsSet.id ? { ...s, questions: finalQuestions[activeLang].length } : s));
      }
      setIsQuestionsSheetOpen(false);
      setManagingQuestionsSet(null);
    } catch (e: any) {
      setJsonError(e.message);
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

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const currentQuestions = questionsByLang[activeLang];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentQuestions.length) return;
    
    const updated = [...currentQuestions];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(newIndex, 0, movedItem);
    
    const newQuestionsByLang = { ...questionsByLang, [activeLang]: updated };
    setQuestionsByLang(newQuestionsByLang);
    setJsonByLang({ ...jsonByLang, [activeLang]: JSON.stringify(updated, null, 2) });
  };

  const startEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setTempQuestion({ ...questionsByLang[activeLang][index] });
  };

  const saveIndividualQuestion = () => {
    if (editingQuestionIndex !== null && tempQuestion) {
      const updated = [...questionsByLang[activeLang]];
      updated[editingQuestionIndex] = tempQuestion;
      
      const newQuestionsByLang = { ...questionsByLang, [activeLang]: updated };
      setQuestionsByLang(newQuestionsByLang);
      setJsonByLang({ ...jsonByLang, [activeLang]: JSON.stringify(updated, null, 2) });
      
      setEditingQuestionIndex(null);
      setTempQuestion(null);
    }
  };

  const deleteQuestion = (index: number) => {
    const updated = [...questionsByLang[activeLang]];
    updated.splice(index, 1);
    
    const newQuestionsByLang = { ...questionsByLang, [activeLang]: updated };
    setQuestionsByLang(newQuestionsByLang);
    setJsonByLang({ ...jsonByLang, [activeLang]: JSON.stringify(updated, null, 2) });
  };

  const handleAddQuestionManually = () => {
    const newQ: Question = { 
      id: `q-${activeLang}-${Date.now()}`, 
      q: "", 
      options: ["", "", "", ""], 
      answer: 0, 
      mdx: false 
    };
    const updated = [...questionsByLang[activeLang], newQ];
    
    const newQuestionsByLang = { ...questionsByLang, [activeLang]: updated };
    setQuestionsByLang(newQuestionsByLang);
    setJsonByLang({ ...jsonByLang, [activeLang]: JSON.stringify(updated, null, 2) });
    
    setEditingQuestionIndex(updated.length - 1);
    setTempQuestion({ ...newQ });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link href={`/admin/practice/${subjectId}`} className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-2">
            <ArrowLeft className="mr-1.5 h-3 w-3" /> Back to Topics
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary ring-1 ring-primary/20 shadow-sm">
              <Layers className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-foreground tracking-tight">
              {currentTopic?.title || 'Practice Sets'}
            </h1>
          </div>
        </div>
        <Button onClick={handleAdd} className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
          <Plus className="h-4 w-4" />
          Add Practice Set
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sets.map((set, index) => (
          <Card 
            key={set.id} 
            className="group border-none shadow-sm overflow-hidden hover:shadow-md transition-all bg-card"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center p-5 gap-6">
                <div className="flex flex-col gap-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                    disabled={index === 0}
                    onClick={() => moveSet(index, 'up')}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                    disabled={index === sets.length - 1}
                    onClick={() => moveSet(index, 'down')}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className={cn(
                  "h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl font-headline text-xl font-bold transition-all border shadow-sm",
                  "bg-muted/50 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                )}>
                  {index + 1}
                </div>

                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{set.title}</h3>
                    {set.isFree ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-black uppercase tracking-widest px-2.5 h-5">
                        Free Access
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-600/10 text-amber-600 border-none text-[9px] font-black uppercase tracking-widest flex gap-1 items-center px-2.5 h-5">
                        <Lock className="h-2.5 w-2.5" /> Pro Only
                      </Badge>
                    )}
                    <div className="flex gap-1">
                      {set.languages?.map(lang => (
                        <Badge key={lang} variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary py-0 h-4">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-primary" />
                      <span>{set.questions} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{set.timeLimit} Mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      <span>ID: {set.id}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button 
                    variant="outline"
                    className="rounded-xl"
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

      {/* Main Set Configuration Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6 border-b pb-4">
            <SheetTitle className="text-xl font-headline font-bold text-foreground">
              Set Configuration
            </SheetTitle>
            <SheetDescription className="font-medium">Define parameters and access requirements for this practice set.</SheetDescription>
          </SheetHeader>
          
          {editingSet && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="set-id" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Unique Slug ID</Label>
                <Input 
                  id="set-id" 
                  value={editingSet.id} 
                  onChange={(e) => setEditingSet({...editingSet, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="rounded-xl h-11 font-mono text-xs"
                  placeholder="e.g. advanced-quant-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="set-title" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Set Title</Label>
                <Input 
                  id="set-title" 
                  value={editingSet.title} 
                  onChange={(e) => setEditingSet({...editingSet, title: e.target.value})}
                  className="rounded-xl h-11 font-bold"
                  placeholder="e.g. Practice Set 1: Basics"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Timer (Mins)</Label>
                  <Input 
                    type="number"
                    value={editingSet.timeLimit} 
                    onChange={(e) => setEditingSet({...editingSet, timeLimit: parseInt(e.target.value) || 0})}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Access Policy</Label>
                  <Select 
                    value={editingSet.isFree ? "free" : "premium"} 
                    onValueChange={(val: any) => setEditingSet({...editingSet, isFree: val === "free"})}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free Practice</SelectItem>
                      <SelectItem value="premium">Premium Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-primary" />
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Language Configuration</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_LANGUAGES.map(lang => {
                    const isSelected = editingSet.languages?.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all",
                          isSelected 
                            ? "bg-primary/5 border-primary text-primary shadow-sm" 
                            : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        {lang}
                        {isSelected && <Check className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">Selected languages will be available for question management.</p>
              </div>
            </div>
          )}

          <SheetFooter className="mt-8 gap-2 pb-8">
            <SheetClose asChild>
              <Button variant="outline" className="w-full rounded-xl h-11 font-bold">Discard</Button>
            </SheetClose>
            <Button onClick={handleSave} className="w-full gap-2 rounded-xl h-11 font-bold shadow-lg shadow-primary/20">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Questions Management Drawer */}
      <Sheet open={isQuestionsSheetOpen} onOpenChange={setIsQuestionsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-4xl overflow-y-auto">
          <SheetHeader className="mb-6 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-xl font-headline font-bold flex items-center gap-2">
                  <FileJson className="h-5 w-5 text-primary" /> Questions Editor
                </SheetTitle>
                <SheetDescription className="font-medium mt-1">
                  Manage test content for <span className="text-foreground font-bold italic">"{managingQuestionsSet?.title}"</span>
                </SheetDescription>
              </div>
              {editingQuestionIndex !== null && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditingQuestionIndex(null)}
                  className="rounded-lg h-8 gap-1.5 text-muted-foreground font-bold uppercase text-[10px]"
                >
                  <X className="h-4 w-4" /> Cancel Edit
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="space-y-6 py-2">
            {/* Language Selector Tabs */}
            {managingQuestionsSet?.languages && (
              <Tabs value={activeLang} onValueChange={handleLanguageChange} className="w-full">
                <TabsList className="grid w-full h-12 bg-muted/50 p-1 rounded-xl mb-6" style={{ gridTemplateColumns: `repeat(${managingQuestionsSet.languages.length}, 1fr)` }}>
                  {managingQuestionsSet.languages.map(lang => (
                    <TabsTrigger key={lang} value={lang} className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <span className="font-bold uppercase text-[10px] tracking-wider truncate">{lang}</span>
                      <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 bg-primary/10 text-primary border-none font-black text-[8px]">
                        {questionsByLang[lang]?.length || 0}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {editingQuestionIndex === null && (
                  <div className="flex items-center justify-between bg-muted/30 p-1 rounded-xl border border-primary/10 mb-6">
                    <Button 
                      variant={isJsonMode ? "ghost" : "secondary"} 
                      className={cn("flex-1 gap-2 rounded-lg text-xs font-bold uppercase tracking-wider", !isJsonMode && "shadow-sm bg-background")}
                      onClick={() => setIsJsonMode(false)}
                    >
                      <ListOrdered className="h-4 w-4" /> Visual List
                    </Button>
                    <Button 
                      variant={isJsonMode ? "secondary" : "ghost"} 
                      className={cn("flex-1 gap-2 rounded-lg text-xs font-bold uppercase tracking-wider", isJsonMode && "shadow-sm bg-background")}
                      onClick={() => setIsJsonMode(true)}
                    >
                      <FileJson className="h-4 w-4" /> Raw JSON
                    </Button>
                  </div>
                )}

                {jsonError && (
                  <Alert variant="destructive" className="rounded-xl bg-destructive/5 border-destructive/20 mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-[10px] font-black uppercase tracking-widest">Action Required</AlertTitle>
                    <AlertDescription className="text-xs font-mono mt-1 opacity-80">{jsonError}</AlertDescription>
                  </Alert>
                )}

                {editingQuestionIndex !== null && tempQuestion ? (
                  // Individual Question Edit Mode
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 bg-muted/10 p-6 rounded-3xl border border-primary/5">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="px-3 py-1 font-black text-[10px] tracking-widest uppercase border-primary/20 text-primary bg-primary/5">
                        Editing Question #{editingQuestionIndex + 1} ({activeLang})
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Question Prompt</Label>
                        <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border shadow-sm">
                          <Label htmlFor="q-mdx" className="text-[10px] font-bold uppercase cursor-pointer text-primary">Rich MDX</Label>
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
                        className="min-h-[140px] rounded-2xl font-semibold leading-relaxed border-primary/10 focus-visible:ring-primary/20"
                        placeholder="Type your question content here (supports LaTeX if MDX is on)..."
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block mb-4">Multiple Choice Options (Select Correct Answer)</Label>
                      <RadioGroup 
                        value={tempQuestion.answer?.toString() ?? "0"} 
                        onValueChange={(val) => setTempQuestion({...tempQuestion, answer: parseInt(val)})}
                        className="space-y-3"
                      >
                        {tempQuestion.options.map((opt, idx) => (
                          <div key={idx} className={cn(
                            "flex items-center gap-3 p-2 rounded-2xl border transition-all",
                            tempQuestion.answer === idx ? "bg-emerald-500/5 border-emerald-500/20" : "bg-background border-border"
                          )}>
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
                              className="rounded-xl h-11 border-none shadow-none focus-visible:ring-0 font-medium"
                              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setEditingQuestionIndex(null)}>
                        Discard
                      </Button>
                      <Button className="flex-1 rounded-xl h-12 gap-2 shadow-lg font-bold" onClick={saveIndividualQuestion}>
                        <Save className="h-4 w-4" /> Save Question
                      </Button>
                    </div>
                  </div>
                ) : isJsonMode ? (
                  // Raw JSON Editor Mode
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Raw Data Interface ({activeLang.toUpperCase()})</Label>
                      <Badge variant="outline" className="text-[8px] font-black uppercase opacity-60">JSON Array</Badge>
                    </div>
                    <Textarea 
                      value={jsonByLang[activeLang]}
                      onChange={(e) => {
                        setJsonByLang({ ...jsonByLang, [activeLang]: e.target.value });
                        setJsonError(null);
                      }}
                      className="min-h-[450px] font-mono text-[11px] p-6 rounded-2xl leading-relaxed resize-none border-primary/10 bg-slate-900 text-slate-100 dark:bg-black focus-visible:ring-primary/20"
                      placeholder='[ { "id": "q1", "q": "Question content...", "options": ["A", "B", "C", "D"], "answer": 0, "mdx": true } ]'
                    />
                  </div>
                ) : (
                  // Visual List View Mode
                  <div className="space-y-4">
                    {questionsByLang[activeLang]?.map((q, idx) => (
                      <Card key={q.id} className="p-0 border rounded-2xl group overflow-hidden hover:border-primary/30 transition-all bg-card shadow-sm">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-b border-dashed">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black px-2 h-5"># {idx + 1}</Badge>
                            {q.mdx && <Badge className="bg-purple-500/10 text-purple-600 border-none text-[8px] font-black uppercase h-4 px-1.5">Rich Content</Badge>}
                          </div>
                          <div className="flex items-center gap-1">
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
                              disabled={idx === questionsByLang[activeLang].length - 1}
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
                        
                        <div className="p-5">
                          <div className="mb-5">
                            {q.mdx ? (
                              <MarkdownRenderer content={q.q} className="prose-sm font-bold leading-relaxed text-foreground" />
                            ) : (
                              <p className="text-sm font-bold leading-relaxed text-foreground line-clamp-3">{q.q}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className={cn(
                                "px-3 py-2 rounded-xl text-[10px] font-bold border transition-colors flex items-center gap-2.5 shadow-sm",
                                q.answer === oIdx ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-muted/30 text-muted-foreground border-transparent"
                              )}>
                                <div className={cn(
                                  "h-5 w-5 shrink-0 rounded-md flex items-center justify-center border text-[9px] font-black",
                                  q.answer === oIdx ? "bg-emerald-500 text-white border-emerald-500 shadow-md" : "bg-background border-border text-muted-foreground"
                                )}>
                                  {String.fromCharCode(65 + oIdx)}
                                </div>
                                <div className="flex-grow">
                                  {q.mdx ? (
                                    <MarkdownRenderer content={opt} className="prose-sm prose-p:m-0 font-semibold" />
                                  ) : (
                                    <span className="line-clamp-1 font-semibold">{opt}</span>
                                  )}
                                </div>
                                {q.answer === oIdx && <Check className="h-3 w-3 text-emerald-600 ml-auto" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    <Button 
                      onClick={handleAddQuestionManually}
                      variant="outline" 
                      className="w-full border-dashed rounded-2xl h-14 gap-2 text-muted-foreground hover:text-primary transition-all hover:bg-primary/5 hover:border-primary/30"
                    >
                      <Plus className="h-4 w-4" /> Add Individual Question ({activeLang})
                    </Button>
                  </div>
                )}
              </Tabs>
            )}
          </div>

          <SheetFooter className="mt-8 gap-2 pb-8">
            <SheetClose asChild>
              <Button variant="outline" className="w-full rounded-xl h-11 font-bold">Cancel</Button>
            </SheetClose>
            <Button 
              disabled={editingQuestionIndex !== null}
              onClick={handleSaveQuestions} 
              className="w-full gap-2 rounded-xl h-11 font-bold shadow-lg shadow-primary/20"
            >
              <Save className="h-4 w-4" />
              Commit All Languages
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
