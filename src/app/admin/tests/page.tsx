"use client";

import { getTests, TestItem, getExams, Exam, Question } from "@/lib/api";
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
  FileText, 
  Timer, 
  Edit2,
  Trash2,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Filter,
  Loader2,
  GraduationCap,
  CircleDashed,
  Calendar,
  ArrowUpDown,
  CheckCircle2,
  ListOrdered,
  FileJson,
  X,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  HelpCircle,
  Settings
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

export default function AdminTestsPage() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Column Selector
  const [visibleColumns, setVisibleColumns] = useState({
    subject: true,
    exams: true,
    stats: true,
    access: true,
    status: true
  });

  // Main Edit State
  const [editingTest, setEditingTest] = useState<TestItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Questions Management State
  const [managingQuestionsTest, setManagingQuestionsTest] = useState<TestItem | null>(null);
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
        const testsData = getTests('all');
        const examsData = getExams();
        setTests(testsData);
        setExams(examsData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredAndSortedTests = useMemo(() => {
    let result = tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(search.toLowerCase());
      const matchesExam = examFilter === "all" || (test.examSlugs?.includes(examFilter) || test.examSlug === examFilter);
      const matchesSubject = subjectFilter === "all" || test.subject === subjectFilter;
      const matchesAccess = accessFilter === "all" || (accessFilter === "free" ? test.isFree : !test.isFree);
      return matchesSearch && matchesExam && matchesSubject && matchesAccess;
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
  }, [tests, search, examFilter, subjectFilter, accessFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedTests.length / ITEMS_PER_PAGE);
  const paginatedTests = filteredAndSortedTests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (test: TestItem) => {
    setEditingTest({
      ...test,
      status: test.status || 'published',
      examSlugs: test.examSlugs || (test.examSlug ? [test.examSlug] : []),
      languages: test.languages || ['English']
    });
    setIsSheetOpen(true);
  };

  const handleManageQuestions = (test: TestItem) => {
    setManagingQuestionsTest(test);
    const langs = test.languages || ['English'];
    const initialQs: Record<string, Question[]> = {};
    const initialJson: Record<string, string> = {};
    
    langs.forEach(lang => {
      const mockQs: Question[] = [
        { id: `q1-${test.id}-${lang}`, q: `[${lang}] Sample question content...`, options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 0, mdx: true },
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
        setJsonError(`Fix JSON errors in ${activeLang} before switching.`);
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
        finalQuestions[activeLang] = parsed;
      }
      setIsQuestionsSheetOpen(false);
      setManagingQuestionsTest(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const handleSave = () => {
    if (editingTest) {
      setTests(tests.map(t => t.id === editingTest.id ? editingTest : t));
      setIsSheetOpen(false);
    }
  };

  const toggleExamSelection = (slug: string) => {
    if (!editingTest) return;
    const currentSlugs = editingTest.examSlugs || [];
    setEditingTest({
      ...editingTest,
      examSlugs: currentSlugs.includes(slug) ? currentSlugs.filter(s => s !== slug) : [...currentSlugs, slug]
    });
  };

  const toggleLanguage = (lang: string) => {
    if (!editingTest) return;
    const currentLangs = editingTest.languages || [];
    setEditingTest({
      ...editingTest,
      languages: currentLangs.includes(lang) 
        ? (currentLangs.length > 1 ? currentLangs.filter(l => l !== lang) : currentLangs)
        : [...currentLangs, lang]
    });
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

  const subjects = useMemo(() => Array.from(new Set(tests.map(t => t.subject))).filter(Boolean) as string[], [tests]);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Sectional Tests</h1>
          <p className="text-muted-foreground text-sm">Create and manage topic-specific practice assessments.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20"><Plus className="h-4 w-4" />Create Test</Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tests..." className="pl-10 rounded-xl bg-background border-none shadow-sm h-11" value={search} onChange={(e) => setSearch(e.target.value)}/>
              </div>
              <Select value={sortBy} onValueChange={(val: SortOption) => setSortBy(val)}>
                <SelectTrigger className="h-11 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4 md:w-48">
                  <div className="flex items-center gap-2"><ArrowUpDown className="h-3 w-3" /><SelectValue placeholder="Sort By" /></div>
                </SelectTrigger>
                <SelectContent><SelectItem value="newest">Newest First</SelectItem><SelectItem value="oldest">Oldest First</SelectItem><SelectItem value="date-asc">Date ASC</SelectItem><SelectItem value="date-desc">Date DESC</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={examFilter} onValueChange={setExamFilter}><SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4 w-40"><SelectValue placeholder="All Exams"/></SelectTrigger><SelectContent><SelectItem value="all">All Exams</SelectItem>{exams.map(e => <SelectItem key={e.id} value={e.slug}>{e.title}</SelectItem>)}</SelectContent></Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}><SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4 w-40"><SelectValue placeholder="All Subjects"/></SelectTrigger><SelectContent><SelectItem value="all">All Subjects</SelectItem>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              <Select value={accessFilter} onValueChange={setAccessFilter}><SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4 w-40"><SelectValue placeholder="All Access"/></SelectTrigger><SelectContent><SelectItem value="all">All Access</SelectItem><SelectItem value="free">Free</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6">Test Details</TableHead>
                  {visibleColumns.subject && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Subject</TableHead>}
                  {visibleColumns.stats && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Stats</TableHead>}
                  {visibleColumns.status && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>}
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTests.map((test) => (
                  <TableRow key={test.id} className="group hover:bg-muted/5">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight">{test.title}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="h-2.5 w-2.5" />{formatDistanceToNow(new Date(test.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px]">{test.subject}</Badge></TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1.5"><HelpCircle className="h-3 w-3" /> {test.numberOfQuestions} Qs</span>
                        <span className="flex items-center gap-1.5"><Timer className="h-3 w-3" /> {test.durationInMinutes}m</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {test.status === 'published' ? <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]"><CheckCircle2 className="h-3 w-3" /> Published</div> : <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[11px]"><CircleDashed className="h-3 w-3" /> Draft</div>}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" onClick={() => handleManageQuestions(test)}>Manage Questions</Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(test)} className="h-8 w-8 hover:text-primary"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(test.id)} className="h-8 w-8 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Main Configuration Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6"><SheetTitle>Edit Sectional Test</SheetTitle><SheetDescription>Modify test parameters and visibility.</SheetDescription></SheetHeader>
          {editingTest && (
            <div className="space-y-6">
              <div className="space-y-2"><Label>Test Title</Label><Input value={editingTest.title} onChange={(e) => setEditingTest({...editingTest, title: e.target.value})}/></div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={editingTest.subject} onValueChange={(v) => setEditingTest({...editingTest, subject: v})}>
                  <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                  <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Qs</Label><Input type="number" value={editingTest.numberOfQuestions} onChange={(e) => setEditingTest({...editingTest, numberOfQuestions: parseInt(e.target.value)})}/></div>
                <div className="space-y-2"><Label>Time (m)</Label><Input type="number" value={editingTest.durationInMinutes} onChange={(e) => setEditingTest({...editingTest, durationInMinutes: parseInt(e.target.value)})}/></div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-[11px] font-black uppercase text-muted-foreground">Languages</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_LANGUAGES.map(lang => {
                    const isSelected = editingTest.languages?.includes(lang);
                    return (
                      <Button key={lang} variant={isSelected ? "default" : "outline"} className="h-9 text-xs justify-between" onClick={() => toggleLanguage(lang)}>
                        {lang} {isSelected && <Check className="h-3 w-3" />}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t">
                <Label>Status</Label>
                <Select value={editingTest.status} onValueChange={(v: any) => setEditingTest({...editingTest, status: v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}
          <SheetFooter className="mt-8"><Button onClick={handleSave} className="w-full">Save Changes</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Questions Editor Drawer */}
      <Sheet open={isQuestionsSheetOpen} onOpenChange={setIsQuestionsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-4xl overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div><SheetTitle className="text-xl flex items-center gap-2"><FileJson className="h-5 w-5 text-primary" /> Questions Editor</SheetTitle><SheetDescription>Test: {managingQuestionsTest?.title}</SheetDescription></div>
              {editingQuestionIndex !== null && <Button variant="ghost" size="sm" onClick={() => setEditingQuestionIndex(null)} className="h-8 gap-1.5 font-bold uppercase text-[10px]"><X className="h-4 w-4" /> Cancel</Button>}
            </div>
          </SheetHeader>

          <div className="py-6">
            {managingQuestionsTest && (
              <Tabs value={activeLang} onValueChange={handleLanguageChange}>
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-12 bg-muted/50 mb-6">
                  {managingQuestionsTest.languages?.map(lang => (
                    <TabsTrigger key={lang} value={lang} className="text-[10px] font-bold uppercase tracking-wider">{lang}</TabsTrigger>
                  ))}
                </TabsList>

                {editingQuestionIndex === null && (
                  <div className="flex gap-2 mb-6">
                    <Button variant={isJsonMode ? "ghost" : "secondary"} className="flex-1 rounded-xl" onClick={() => setIsJsonMode(false)}><ListOrdered className="h-4 w-4 mr-2" /> Visual List</Button>
                    <Button variant={isJsonMode ? "secondary" : "ghost"} className="flex-1 rounded-xl" onClick={() => setIsJsonMode(true)}><FileJson className="h-4 w-4 mr-2" /> Raw JSON</Button>
                  </div>
                )}

                {editingQuestionIndex !== null && tempQuestion ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center"><Label className="text-[11px] font-black uppercase text-muted-foreground">Question Prompt ({activeLang})</Label><div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-full"><Label className="text-[10px] font-bold text-primary">MDX</Label><Switch checked={tempQuestion.mdx} onCheckedChange={(v) => setTempQuestion({...tempQuestion, mdx: v})} /></div></div>
                      <Textarea value={tempQuestion.q} onChange={(e) => setTempQuestion({...tempQuestion, q: e.target.value})} className="min-h-[140px] rounded-2xl font-semibold"/>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground">Options</Label>
                      <RadioGroup value={tempQuestion.answer.toString()} onValueChange={(v) => setTempQuestion({...tempQuestion, answer: parseInt(v)})} className="space-y-3">
                        {tempQuestion.options.map((opt, i) => (
                          <div key={i} className={cn("flex items-center gap-3 p-2 rounded-2xl border", tempQuestion.answer === i && "bg-emerald-50 border-emerald-200")}>
                            <RadioGroupItem value={i.toString()} className="h-5 w-5 ml-2" />
                            <Input value={opt} onChange={(e) => { const next = [...tempQuestion.options]; next[i] = e.target.value; setTempQuestion({...tempQuestion, options: next})}} className="border-none shadow-none focus-visible:ring-0 font-medium" placeholder={`Option ${String.fromCharCode(65+i)}`}/>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="pt-4 flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setEditingQuestionIndex(null)}>Discard</Button><Button className="flex-1" onClick={() => { const next = [...questionsByLang[activeLang]]; next[editingQuestionIndex] = tempQuestion; setQuestionsByLang({...questionsByLang, [activeLang]: next}); setEditingQuestionIndex(null); }}>Save Question</Button></div>
                  </div>
                ) : isJsonMode ? (
                  <Textarea value={jsonByLang[activeLang]} onChange={(e) => setJsonByLang({...jsonByLang, [activeLang]: e.target.value})} className="min-h-[450px] font-mono text-[11px] p-6 bg-slate-900 text-slate-100 rounded-2xl" />
                ) : (
                  <div className="space-y-4">
                    {questionsByLang[activeLang]?.map((q, i) => (
                      <Card key={q.id} className="overflow-hidden border-none shadow-sm bg-muted/20">
                        <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b">
                          <Badge className="bg-primary/10 text-primary text-[9px]"># {i + 1}</Badge>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" disabled={i === 0} onClick={() => moveQuestion(i, 'up')} className="h-7 w-7"><ChevronUp className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" disabled={i === questionsByLang[activeLang].length - 1} onClick={() => moveQuestion(i, 'down')} className="h-7 w-7"><ChevronDown className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setEditingQuestionIndex(i); setTempQuestion({...q}); }} className="h-7 w-7"><Edit2 className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { const next = [...questionsByLang[activeLang]]; next.splice(i, 1); setQuestionsByLang({...questionsByLang, [activeLang]: next}); }} className="h-7 w-7 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-4 text-sm font-bold line-clamp-2">{q.q}</div>
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oIdx) => <div key={oIdx} className={cn("text-[10px] p-2 rounded-lg border", q.answer === oIdx ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold" : "bg-background")}>{opt}</div>)}
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button variant="outline" className="w-full border-dashed h-12" onClick={() => { const newQ = { id: `q-${Date.now()}`, q: "New Question", options: ["A", "B", "C", "D"], answer: 0, mdx: false }; const next = [...(questionsByLang[activeLang] || []), newQ]; setQuestionsByLang({...questionsByLang, [activeLang]: next}); setEditingQuestionIndex(next.length - 1); setTempQuestion(newQ); }}><Plus className="h-4 w-4 mr-2" /> Add Question</Button>
                  </div>
                )}
              </Tabs>
            )}
          </div>
          <SheetFooter className="mt-8 pt-4 border-t"><Button onClick={handleSaveQuestions} className="w-full">Commit All Changes</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
