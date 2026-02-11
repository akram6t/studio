
"use client";

import { getMockTests, TestItem, getExams, Exam } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Trophy, 
  Timer, 
  Award, 
  Edit2,
  Trash2,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Filter,
  GraduationCap,
  Loader2
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
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

export default function AdminMocksPage() {
  const [mocks, setMocks] = useState<TestItem[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Column Selector
  const [visibleColumns, setVisibleColumns] = useState({
    exam: true,
    section: true,
    questions: true,
    time: true,
    access: true
  });

  // Drawer State
  const [editingMock, setEditingMock] = useState<TestItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  // Dynamic Sections based on selected exam
  const availableSections = useMemo(() => {
    const relevantTests = examFilter === "all" 
      ? mocks 
      : mocks.filter(m => m.examSlug === examFilter);
    return Array.from(new Set(relevantTests.map(m => m.subject))).filter(Boolean) as string[];
  }, [mocks, examFilter]);

  const filteredMocks = useMemo(() => {
    return mocks.filter(mock => {
      const matchesSearch = mock.title.toLowerCase().includes(search.toLowerCase());
      const matchesExam = examFilter === "all" || mock.examSlug === examFilter;
      const matchesSection = sectionFilter === "all" || mock.subject === sectionFilter;
      return matchesSearch && matchesExam && matchesSection;
    });
  }, [mocks, search, sectionFilter, examFilter]);

  const totalPages = Math.ceil(filteredMocks.length / ITEMS_PER_PAGE);
  const paginatedMocks = filteredMocks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (mock: TestItem) => {
    setEditingMock(mock);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setMocks(mocks.filter(m => m.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const handleSave = () => {
    if (editingMock) {
      setMocks(mocks.map(m => m.id === editingMock.id ? editingMock : m));
      setIsSheetOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Mock Test Management</h1>
          <p className="text-muted-foreground text-sm">Review and manage full-length official mock assessments.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Create Mock Test
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search mocks..." 
                  className="pl-10 rounded-xl bg-background border-none shadow-sm h-11"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 h-11 rounded-xl">
                      <Settings2 className="h-4 w-4" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={visibleColumns.exam} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, exam: v }))}>
                      Exam
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.section} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, section: v }))}>
                      Section
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.questions} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, questions: v }))}>
                      Questions
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.time} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, time: v }))}>
                      Time
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.access} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, access: v }))}>
                      Access
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-[200px]">
                <Select 
                  value={examFilter} 
                  onValueChange={(val) => {
                    setExamFilter(val);
                    setSectionFilter("all"); 
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-3 w-3 text-muted-foreground" />
                      <SelectValue placeholder="All Exams" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    {exams.map(exam => (
                      <SelectItem key={exam.id} value={exam.slug}>{exam.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <Select 
                  value={sectionFilter} 
                  onValueChange={(val) => {
                    setSectionFilter(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3 w-3 text-muted-foreground" />
                      <SelectValue placeholder="All Sections" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {availableSections.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6">Mock Details</TableHead>
                  {visibleColumns.exam && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Associated Exam</TableHead>}
                  {visibleColumns.section && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Section</TableHead>}
                  {visibleColumns.questions && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Questions</TableHead>}
                  {visibleColumns.time && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Time</TableHead>}
                  {visibleColumns.access && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Access</TableHead>}
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMocks.map((mock) => (
                  <TableRow key={mock.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight">{mock.title}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                            ID: {mock.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    {visibleColumns.exam && (
                      <TableCell>
                        <span className="text-xs font-bold text-primary">
                          {exams.find(e => e.slug === mock.examSlug)?.title || "General"}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.section && (
                      <TableCell>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-none text-[10px] font-bold">
                          {mock.subject}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.questions && (
                      <TableCell>
                        <span className="font-bold text-sm">{mock.numberOfQuestions} Qs</span>
                      </TableCell>
                    )}
                    {visibleColumns.time && (
                      <TableCell>
                        <span className="font-bold text-sm">{mock.durationInMinutes}m</span>
                      </TableCell>
                    )}
                    {visibleColumns.access && (
                      <TableCell>
                        {mock.isFree ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-bold px-2 py-0.5">FREE</Badge>
                        ) : (
                          <Badge className="bg-amber-600/10 text-amber-600 border-none text-[10px] font-bold px-2 py-0.5">PREMIUM</Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(mock)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(mock.id)}
                          className={cn(
                            "h-8 w-8 rounded-lg transition-all",
                            confirmDeleteId === mock.id 
                              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                              : "hover:bg-destructive/10 hover:text-destructive"
                          )}
                        >
                          {confirmDeleteId === mock.id ? <div className="flex items-center gap-1 text-[10px] font-bold"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 bg-muted/10 border-t flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-bold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredMocks.length)}</span> of <span className="font-bold text-foreground">{filteredMocks.length}</span> mocks
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button key={page} variant={currentPage === page ? "default" : "outline"} className={cn("h-8 w-8 rounded-lg text-xs font-bold", currentPage === page && "shadow-lg")} onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Mock Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Edit Mock Test</SheetTitle>
            <SheetDescription>Update full-length mock test details and requirements.</SheetDescription>
          </SheetHeader>
          
          {editingMock && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-mock-title">Mock Title</Label>
                <Input 
                  id="edit-mock-title" 
                  value={editingMock.title} 
                  onChange={(e) => setEditingMock({...editingMock, title: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Associated Exam</Label>
                <Select 
                  value={editingMock.examSlug || "none"} 
                  onValueChange={(val: any) => setEditingMock({...editingMock, examSlug: val === "none" ? undefined : val})}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select associated exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (General)</SelectItem>
                    {exams.map(exam => (
                      <SelectItem key={exam.id} value={exam.slug}>{exam.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Questions</Label>
                  <Input 
                    type="number"
                    value={editingMock.numberOfQuestions} 
                    onChange={(e) => setEditingMock({...editingMock, numberOfQuestions: parseInt(e.target.value) || 0})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Time (Mins)</Label>
                  <Input 
                    type="number"
                    value={editingMock.durationInMinutes} 
                    onChange={(e) => setEditingMock({...editingMock, durationInMinutes: parseInt(e.target.value) || 0})}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mock Type/Section</Label>
                <Input 
                  value={editingMock.subject || ""} 
                  onChange={(e) => setEditingMock({...editingMock, subject: e.target.value})}
                  className="rounded-xl"
                  placeholder="e.g. Full Length, Section A"
                />
              </div>

              <div className="space-y-2">
                <Label>Access Mode</Label>
                <Select 
                  value={editingMock.isFree ? "free" : "premium"} 
                  onValueChange={(val: any) => setEditingMock({...editingMock, isFree: val === "free"})}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free Access</SelectItem>
                    <SelectItem value="premium">Premium Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <SheetFooter className="mt-8 gap-2">
            <SheetClose asChild>
              <Button variant="outline" className="w-full rounded-xl">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave} className="w-full gap-2 rounded-xl shadow-lg">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
