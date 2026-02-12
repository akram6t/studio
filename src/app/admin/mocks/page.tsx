"use client";

import { getMockTests, TestItem, getExams, Exam, Question } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Trophy, 
  Timer, 
  Edit2,
  Trash2,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Filter,
  GraduationCap,
  Loader2,
  CheckCircle2,
  CircleDashed,
  Calendar,
  ArrowUpDown,
  FileJson,
  ListOrdered,
  X,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  AlertCircle
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
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const ITEMS_PER_PAGE = 5;
const AVAILABLE_LANGUAGES = ["English", "Hindi", "Marathi", "Bengali", "Telugu", "Tamil"];

type SortOption = 'newest' | 'oldest' | 'date-asc' | 'date-desc';

export default function AdminMocksPage() {
  const [mocks, setMocks] = useState<TestItem[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Main Edit State
  const [editingMock, setEditingMock] = useState<TestItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Questions Management State
  const [managingQuestionsMock, setManagingQuestionsMock] = useState<TestItem | null>(null);
  const [isQuestionsSheetOpen, setIsQuestionsSheetOpen] = useState(false);
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [activeLang, setActiveLang] = useState<string>("");
  const [questionsByLang, setQuestionsByLang] = useState<Record<string, Question[]>>({});
  const [jsonByLang, setJsonByLang] = useState<Record<string, string>>({});
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [tempQuestion, setTempQuestion] = useState<Question | null>(null);

  // Deletion Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [mocksData, examsData] = await Promise.all([
          getMockTests('all'),
          getExams()
        ]);
        setMocks(mocksData);
        setExams(examsData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredAndSortedMocks = useMemo(() => {
    let result = mocks.filter(mock => {
      const matchesSearch = mock.title.toLowerCase().includes(search.toLowerCase());
      const matchesExam = examFilter === "all" || mock.examSlug === examFilter;
      const matchesSection = sectionFilter === "all" || mock.subject === sectionFilter;
      return matchesSearch && matchesExam && matchesSection;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      switch (sortBy) {
        case 'newest': return dateB - dateA;
        case 'oldest': return dateA - dateB;
        case 'date-asc': return dateA - dateB;
        case 'date-desc': return dateB - dateA;
        default: return 0;
      }
    });

    return result;
  }, [mocks, search, sectionFilter, examFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedMocks.length / ITEMS_PER_PAGE);
  const paginatedMocks = filteredAndSortedMocks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (mock: TestItem) => {
    setEditingMock({ ...mock, status: mock.status || 'published', languages: mock.languages || ['English'] });
    setIsSheetOpen(true);
  };

  const handleManageQuestions = (mock: TestItem) => {
    setManagingQuestionsMock(mock);
    const langs = mock.languages || ['English'];
    const initialQs: Record<string, Question[]> = {};
    const initialJson: Record<string, string> = {};
    
    langs.forEach(lang => {
      const mockQs: Question[] = [
        { id: `q1-mock-${mock.id}-${lang}`, q: `[${lang}] Mock test sample question content...`, options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 0, mdx: true },
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
        setQuestionsByLang({ ...questionsByLang, [activeLang]: parsed });
      } catch (e) {
        setJsonError(`Please fix JSON errors in ${activeLang} before switching languages.`);
        return;
      }
    }
    setActiveLang(lang);
    setJsonError(null);
    setEditingQuestionIndex(null);
  };

  const handleSave = () => {
    if (editingMock) {
      setMocks(mocks.map(m => m.id === editingMock.id ? editingMock : m));
      setIsSheetOpen(false);
    }
  };

  const handleSaveQuestions = () => {
    try {
      const finalQuestions = { ...questionsByLang };
      if (isJsonMode) {
        const parsed = JSON.parse(jsonByLang[activeLang]);
        if (!Array.isArray(parsed)) throw new Error("JSON must be an array of questions");
        finalQuestions[activeLang] = parsed;
      }
      setIsQuestionsSheetOpen(false);
      setManagingQuestionsMock(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const updated = [...questionsByLang[activeLang]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < updated.length) {
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      const newQs = { ...questionsByLang, [activeLang]: updated };
      setQuestionsByLang(newQs);
      setJsonByLang({ ...jsonByLang, [activeLang]: JSON.stringify(updated, null, 2) });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const currentExam = exams.find(e => e.slug === editingMock?.examSlug);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Mock Test Management</h1>
          <p className="text-muted-foreground text-sm font-medium">Review and manage full-length official mock assessments.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
          <Plus className="h-4 w-4" />
          Create Mock Test
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search mocks by title..." 
                  className="pl-10 rounded-xl bg-background border-none shadow-sm h-11" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={(val: SortOption) => setSortBy(val)}>
                <SelectTrigger className="h-11 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4 md:w-48">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    <SelectValue placeholder="Sort By" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="date-asc">Date ASC</SelectItem>
                  <SelectItem value="date-desc">Date DESC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="font-bold text-[10px] uppercase pl-6 h-14">Mock Details</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase">Associated Exam</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase">Status</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMocks.map((mock) => (
                  <TableRow key={mock.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center ring-1 ring-amber-500/20 shadow-sm">
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight text-foreground">{mock.title}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                            <Calendar className="h-2.5 w-2.5" />
                            {formatDistanceToNow(new Date(mock.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/5 rounded-lg border border-primary/10">
                        {exams.find(e => e.slug === mock.examSlug)?.title || "General"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {mock.status === 'published' ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Live
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[11px] uppercase tracking-wider">
                          <CircleDashed className="h-3.5 w-3.5" /> Draft
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider" 
                          onClick={() => handleManageQuestions(mock)}
                        >
                          Manage Questions
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(mock)} 
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => { if(confirm("Delete this mock test?")) setMocks(mocks.filter(m => m.id !== mock.id))}} 
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredAndSortedMocks.length === 0 && (
            <div className="text-center py-20 bg-muted/5 border-t">
              <p className="text-sm text-muted-foreground font-medium">No mock tests found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Configuration Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6 border-b pb-4">
            <SheetTitle className="text-xl font-headline font-bold text-foreground">Mock Configuration</SheetTitle>
            <SheetDescription className="font-medium">Define parameters and visibility for this full-length assessment.</SheetDescription>
          </SheetHeader>
          
          {editingMock && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="mock-title" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Mock Title</Label>
                <Input 
                  id="mock-title" 
                  value={editingMock.title} 
                  onChange={(e) => setEditingMock({...editingMock, title: e.target.value})}
                  className="rounded-xl h-11 font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Exam Section / Stage</Label>
                <Select 
                  value={editingMock.subject} 
                  onValueChange={(val) => setEditingMock({...editingMock, subject: val})}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Length">Full Length Mock</SelectItem>
                    {currentExam?.stages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Total Questions</Label>
                  <Input 
                    type="number" 
                    value={editingMock.numberOfQuestions} 
                    onChange={(e) => setEditingMock({...editingMock, numberOfQuestions: parseInt(e.target.value) || 0})}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Duration (Mins)</Label>
                  <Input 
                    type="number" 
                    value={editingMock.durationInMinutes} 
                    onChange={(e) => setEditingMock({...editingMock, durationInMinutes: parseInt(e.target.value) || 0})}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Supported Languages</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_LANGUAGES.map(lang => {
                    const isSelected = editingMock.languages?.includes(lang);
                    return (
                      <button 
                        key={lang} 
                        onClick={() => {
                          const cur = editingMock.languages || [];
                          const next = cur.includes(lang) ? (cur.length > 1 ? cur.filter(l => l !== lang) : cur) : [...cur, lang];
                          setEditingMock({...editingMock, languages: next});
                        }}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all",
                          isSelected 
                            ? "bg-primary/5 border-primary text-primary shadow-sm" 
                            : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        {lang}
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Publication Status</Label>
                <Select value={editingMock.status} onValueChange={(v: any) => setEditingMock({...editingMock, status: v})}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Pick status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published (Visible to students)</SelectItem>
                    <SelectItem value="draft">Draft (Hidden)</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* Standardized Questions Editor Drawer */}
      <Sheet open={isQuestionsSheetOpen} onOpenChange={setIsQuestionsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-4xl overflow-y-auto">
          <SheetHeader className="mb-6 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-xl font-headline font-bold flex items-center gap-2">
                  <FileJson className="h-5 w-5 text-primary" /> Full-Length Mock Editor
                </SheetTitle>
                <SheetDescription className="font-medium mt-1">
                  Test: <span className="text-foreground font-bold italic">"{managingQuestionsMock?.title}"</span>
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
            {managingQuestionsMock?.languages && (
              <Tabs value={activeLang} onValueChange={handleLanguageChange} className="w-full">
                <TabsList className="grid w-full h-12 bg-muted/50 p-1 rounded-xl mb-6" style={{ gridTemplateColumns: `repeat(${managingQuestionsMock.languages.length}, 1fr)` }}>
                  {managingQuestionsMock.languages.map(lang => (
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
                    <AlertTitle className="text-[10px] font-black uppercase tracking-widest">Syntax Error</AlertTitle>
                    <AlertDescription className="text-xs font-mono mt-1 opacity-80">{jsonError}</AlertDescription>
                  </Alert>
                )}

                {editingQuestionIndex !== null && tempQuestion ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 bg-muted/10 p-6 rounded-3xl border border-primary/5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Question prompt ({activeLang})</Label>
                        <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border shadow-sm">
                          <Label className="text-[10px] font-bold uppercase text-primary">Rich MDX</Label>
                          <Switch 
                            checked={tempQuestion.mdx} 
                            onCheckedChange={(val) => setTempQuestion({...tempQuestion, mdx: val})} 
                          />
                        </div>
                      </div>
                      <Textarea 
                        value={tempQuestion.q}
                        onChange={(e) => setTempQuestion({...tempQuestion, q: e.target.value})}
                        className="min-h-[140px] rounded-2xl font-semibold leading-relaxed border-primary/10"
                        placeholder="Type question content..."
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block mb-4">Response Options</Label>
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
                            <RadioGroupItem value={idx.toString()} className="h-5 w-5 ml-3" />
                            <Input 
                              value={opt}
                              onChange={(e) => {
                                const next = [...tempQuestion.options];
                                next[idx] = e.target.value;
                                setTempQuestion({...tempQuestion, options: next});
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
                      <Button className="flex-1 rounded-xl h-12 gap-2 shadow-lg font-bold" onClick={() => {
                        const updated = [...questionsByLang[activeLang]];
                        updated[editingQuestionIndex] = tempQuestion;
                        setQuestionsByLang({...questionsByLang, [activeLang]: updated});
                        setEditingQuestionIndex(null);
                      }}>
                        <Save className="h-4 w-4" /> Save Question
                      </Button>
                    </div>
                  </div>
                ) : isJsonMode ? (
                  <div className="space-y-4">
                    <Textarea 
                      value={jsonByLang[activeLang]}
                      onChange={(e) => setJsonByLang({ ...jsonByLang, [activeLang]: e.target.value })}
                      className="min-h-[450px] font-mono text-[11px] p-6 rounded-2xl leading-relaxed bg-slate-900 text-slate-100 resize-none border-primary/10"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questionsByLang[activeLang]?.map((q, idx) => (
                      <Card key={q.id} className="p-0 border rounded-2xl group overflow-hidden hover:border-primary/30 transition-all bg-card shadow-sm">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-b border-dashed">
                          <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black px-2 h-5"># {idx + 1}</Badge>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" disabled={idx === 0} onClick={() => moveQuestion(idx, 'up')} className="h-7 w-7"><ChevronUp className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" disabled={idx === questionsByLang[activeLang].length - 1} onClick={() => moveQuestion(idx, 'down')} className="h-7 w-7"><ChevronDown className="h-3.5 w-3.5" /></Button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <Button variant="ghost" size="icon" onClick={() => { setEditingQuestionIndex(idx); setTempQuestion({...q}); }} className="h-7 w-7"><Edit2 className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => {
                              const next = [...questionsByLang[activeLang]];
                              next.splice(idx, 1);
                              setQuestionsByLang({...questionsByLang, [activeLang]: next});
                            }} className="h-7 w-7 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                        <div className="p-5">
                          <p className="text-sm font-bold leading-relaxed text-foreground mb-4 line-clamp-3">{q.q}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className={cn(
                                "px-3 py-2 rounded-xl text-[10px] font-bold border flex items-center gap-2",
                                q.answer === oIdx ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted/30 border-transparent text-muted-foreground"
                              )}>
                                <span className={cn(
                                  "h-5 w-5 rounded flex items-center justify-center text-[9px] font-black border",
                                  q.answer === oIdx ? "bg-emerald-500 text-white border-emerald-500" : "bg-background border-border"
                                )}>{String.fromCharCode(65 + oIdx)}</span>
                                <span className="truncate">{opt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed rounded-2xl h-14 gap-2 text-muted-foreground hover:text-primary transition-all hover:bg-primary/5"
                      onClick={() => {
                        const newQ = { id: `q-${Date.now()}`, q: "", options: ["", "", "", ""], answer: 0, mdx: false };
                        const next = [...(questionsByLang[activeLang] || []), newQ];
                        setQuestionsByLang({...questionsByLang, [activeLang]: next});
                        setEditingQuestionIndex(next.length - 1);
                        setTempQuestion(newQ);
                      }}
                    >
                      <Plus className="h-4 w-4" /> Add Individual Question ({activeLang})
                    </Button>
                  </div>
                )}
              </Tabs>
            )}
          </div>
          <SheetFooter className="mt-8 pt-4 border-t">
            <Button 
              disabled={editingQuestionIndex !== null}
              onClick={handleSaveQuestions} 
              className="w-full h-11 font-bold rounded-xl shadow-lg shadow-primary/20"
            >
              Commit All Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
