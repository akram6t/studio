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
  HelpCircle
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
        { id: `q1-mock-${mock.id}-${lang}`, q: `[${lang}] Mock test sample question...`, options: ['A', 'B', 'C', 'D'], answer: 0, mdx: true },
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

  const handleSave = () => {
    if (editingMock) {
      setMocks(mocks.map(m => m.id === editingMock.id ? editingMock : m));
      setIsSheetOpen(false);
    }
  };

  const handleSaveQuestions = () => {
    setIsQuestionsSheetOpen(false);
    setManagingQuestionsMock(null);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const updated = [...questionsByLang[activeLang]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < updated.length) {
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      setQuestionsByLang({ ...questionsByLang, [activeLang]: updated });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Mock Test Management</h1>
          <p className="text-muted-foreground text-sm">Review and manage full-length official mock assessments.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20"><Plus className="h-4 w-4" />Create Mock Test</Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search mocks..." className="pl-10 rounded-xl h-11" value={search} onChange={(e) => setSearch(e.target.value)}/>
              </div>
              <Select value={sortBy} onValueChange={(val: SortOption) => setSortBy(val)}>
                <SelectTrigger className="h-11 rounded-xl w-48 font-bold uppercase text-[10px] tracking-widest"><div className="flex items-center gap-2"><ArrowUpDown className="h-3 w-3" /><SelectValue placeholder="Sort By" /></div></SelectTrigger>
                <SelectContent><SelectItem value="newest">Newest First</SelectItem><SelectItem value="oldest">Oldest First</SelectItem><SelectItem value="date-asc">Date ASC</SelectItem><SelectItem value="date-desc">Date DESC</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="font-bold text-[10px] uppercase pl-6">Mock Details</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase">Associated Exam</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase">Status</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMocks.map((mock) => (
                  <TableRow key={mock.id} className="group hover:bg-muted/5">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center"><Trophy className="h-5 w-5" /></div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight">{mock.title}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="h-2.5 w-2.5" />{formatDistanceToNow(new Date(mock.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs font-bold text-primary">{exams.find(e => e.slug === mock.examSlug)?.title || "General"}</span></TableCell>
                    <TableCell>{mock.status === 'published' ? <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]"><CheckCircle2 className="h-3 w-3" /> Published</div> : <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[11px]"><CircleDashed className="h-3 w-3" /> Draft</div>}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" onClick={() => handleManageQuestions(mock)}>Manage Questions</Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(mock)} className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { if(confirm("Delete mock?")) setMocks(mocks.filter(m => m.id !== mock.id))}} className="h-8 w-8 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Main Edit Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6"><SheetTitle>Edit Mock Test</SheetTitle></SheetHeader>
          {editingMock && (
            <div className="space-y-6">
              <div className="space-y-2"><Label>Mock Title</Label><Input value={editingMock.title} onChange={(e) => setEditingMock({...editingMock, title: e.target.value})}/></div>
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-[11px] font-black uppercase text-muted-foreground">Languages</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_LANGUAGES.map(lang => (
                    <Button key={lang} variant={editingMock.languages?.includes(lang) ? "default" : "outline"} className="h-9 text-xs justify-between" onClick={() => {
                      const cur = editingMock.languages || [];
                      const next = cur.includes(lang) ? (cur.length > 1 ? cur.filter(l => l !== lang) : cur) : [...cur, lang];
                      setEditingMock({...editingMock, languages: next});
                    }}>{lang} {editingMock.languages?.includes(lang) && <Check className="h-3 w-3" />}</Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t">
                <Label>Status</Label>
                <Select value={editingMock.status} onValueChange={(v: any) => setEditingMock({...editingMock, status: v})}>
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
              <div><SheetTitle className="text-xl flex items-center gap-2"><FileJson className="h-5 w-5 text-primary" /> Full-Length Mock Editor</SheetTitle><SheetDescription>Mock: {managingQuestionsMock?.title}</SheetDescription></div>
              {editingQuestionIndex !== null && <Button variant="ghost" size="sm" onClick={() => setEditingQuestionIndex(null)} className="h-8 gap-1.5 font-bold uppercase text-[10px]"><X className="h-4 w-4" /> Cancel</Button>}
            </div>
          </SheetHeader>

          <div className="py-6">
            {managingQuestionsMock && (
              <Tabs value={activeLang} onValueChange={setActiveLang}>
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-12 bg-muted/50 mb-6">
                  {managingQuestionsMock.languages?.map(lang => (
                    <TabsTrigger key={lang} value={lang} className="text-[10px] font-bold uppercase tracking-wider">{lang}</TabsTrigger>
                  ))}
                </TabsList>

                {editingQuestionIndex !== null && tempQuestion ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center"><Label className="text-[11px] font-black uppercase text-muted-foreground">Question ({activeLang})</Label><div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-full"><Label className="text-[10px] font-bold text-primary">MDX</Label><Switch checked={tempQuestion.mdx} onCheckedChange={(v) => setTempQuestion({...tempQuestion, mdx: v})} /></div></div>
                      <Textarea value={tempQuestion.q} onChange={(e) => setTempQuestion({...tempQuestion, q: e.target.value})} className="min-h-[140px] rounded-2xl font-semibold"/>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground">Multiple Choice Options</Label>
                      <RadioGroup value={tempQuestion.answer.toString()} onValueChange={(v) => setTempQuestion({...tempQuestion, answer: parseInt(v)})} className="space-y-3">
                        {tempQuestion.options.map((opt, i) => (
                          <div key={i} className={cn("flex items-center gap-3 p-2 rounded-2xl border", tempQuestion.answer === i && "bg-emerald-50 border-emerald-200")}>
                            <RadioGroupItem value={i.toString()} className="h-5 w-5 ml-2" />
                            <Input value={opt} onChange={(e) => { const next = [...tempQuestion.options]; next[i] = e.target.value; setTempQuestion({...tempQuestion, options: next})}} className="border-none shadow-none focus-visible:ring-0 font-medium"/>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="pt-4 flex gap-3"><Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditingQuestionIndex(null)}>Discard</Button><Button className="flex-1 rounded-xl" onClick={() => { const next = [...questionsByLang[activeLang]]; next[editingQuestionIndex] = tempQuestion; setQuestionsByLang({...questionsByLang, [activeLang]: next}); setEditingQuestionIndex(null); }}>Save</Button></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questionsByLang[activeLang]?.map((q, i) => (
                      <Card key={q.id} className="overflow-hidden border shadow-none bg-muted/10">
                        <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b">
                          <span className="text-[10px] font-black"># {i + 1}</span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" disabled={i === 0} onClick={() => moveQuestion(i, 'up')} className="h-7 w-7"><ChevronUp className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" disabled={i === questionsByLang[activeLang].length - 1} onClick={() => moveQuestion(i, 'down')} className="h-7 w-7"><ChevronDown className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setEditingQuestionIndex(i); setTempQuestion({...q}); }} className="h-7 w-7"><Edit2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                        <div className="p-4"><p className="text-xs font-bold leading-relaxed">{q.q}</p></div>
                      </Card>
                    ))}
                    <Button variant="outline" className="w-full border-dashed h-12" onClick={() => { const newQ = { id: `q-${Date.now()}`, q: "New Question", options: ["A", "B", "C", "D"], answer: 0, mdx: false }; const next = [...(questionsByLang[activeLang] || []), newQ]; setQuestionsByLang({...questionsByLang, [activeLang]: next}); setEditingQuestionIndex(next.length - 1); setTempQuestion(newQ); }}><Plus className="h-4 w-4 mr-2" /> Add Question</Button>
                  </div>
                )}
              </Tabs>
            )}
          </div>
          <SheetFooter className="mt-8 pt-4 border-t"><Button onClick={handleSaveQuestions} className="w-full">Save All Questions</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
