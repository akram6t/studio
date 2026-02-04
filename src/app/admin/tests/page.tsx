"use client";

import { getTests, TestItem } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  FileText, 
  Timer, 
  Award, 
  HelpCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Filter
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
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

export default function AdminTestsPage() {
  const testsData = getTests('all');
  const [tests, setTests] = useState<TestItem[]>(testsData);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Column Selector
  const [visibleColumns, setVisibleColumns] = useState({
    category: true,
    stats: true,
    access: true,
    status: true
  });

  // Drawer State
  const [editingTest, setEditingTest] = useState<TestItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Deletion Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subjectFilter === "all" || test.subject === subjectFilter;
      const matchesAccess = accessFilter === "all" || (accessFilter === "free" ? test.isFree : !test.isFree);
      return matchesSearch && matchesSubject && matchesAccess;
    });
  }, [tests, search, subjectFilter, accessFilter]);

  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (test: TestItem) => {
    setEditingTest(test);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setTests(tests.filter(t => t.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const handleSave = () => {
    if (editingTest) {
      setTests(tests.map(t => t.id === editingTest.id ? editingTest : t));
      setIsSheetOpen(false);
    }
  };

  const subjects = Array.from(new Set(testsData.map(t => t.subject))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Sectional Tests</h1>
          <p className="text-muted-foreground text-sm">Create and manage topic-specific practice assessments.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Create Test
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tests..." 
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
                    <DropdownMenuCheckboxItem checked={visibleColumns.category} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, category: v }))}>
                      Category
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.stats} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, stats: v }))}>
                      Stats (Qs/Time)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.access} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, access: v }))}>
                      Access Level
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.status} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, status: v }))}>
                      Status
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-[200px]">
                <Select value={subjectFilter} onValueChange={(val) => { setSubjectFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3 w-3 text-muted-foreground" />
                      <SelectValue placeholder="All Subjects" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(s => <SelectItem key={s!} value={s!}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px]">
                <Select value={accessFilter} onValueChange={(val) => { setAccessFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
                    <SelectValue placeholder="All Access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Access</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
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
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6">Test Details</TableHead>
                  {visibleColumns.category && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Category</TableHead>}
                  {visibleColumns.stats && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Stats</TableHead>}
                  {visibleColumns.access && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Access</TableHead>}
                  {visibleColumns.status && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>}
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTests.map((test) => (
                  <TableRow key={test.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight">{test.title}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                            ID: {test.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    {visibleColumns.category && (
                      <TableCell>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-none text-[10px] font-bold">
                          {test.subject}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.stats && (
                      <TableCell>
                        <div className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <HelpCircle className="h-3 w-3" /> {test.numberOfQuestions} Qs
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Timer className="h-3 w-3" /> {test.durationInMinutes}m
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.access && (
                      <TableCell>
                        {test.isFree ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-bold">FREE</Badge>
                        ) : (
                          <Badge className="bg-amber-600/10 text-amber-600 border-none text-[10px] font-bold">PREMIUM</Badge>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                          <CheckCircle2 className="h-3 w-3" /> Published
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(test)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(test.id)}
                          className={cn(
                            "h-8 w-8 rounded-lg transition-all",
                            confirmDeleteId === test.id 
                              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                              : "hover:bg-destructive/10 hover:text-destructive"
                          )}
                        >
                          {confirmDeleteId === test.id ? <div className="flex items-center gap-1 text-[10px] font-bold"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
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
              Showing <span className="font-bold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredTests.length)}</span> of <span className="font-bold text-foreground">{filteredTests.length}</span> tests
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

      {/* Edit Test Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Edit Sectional Test</SheetTitle>
            <SheetDescription>Update test parameters, questions, and access levels.</SheetDescription>
          </SheetHeader>
          
          {editingTest && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-test-title">Test Title</Label>
                <Input 
                  id="edit-test-title" 
                  value={editingTest.title} 
                  onChange={(e) => setEditingTest({...editingTest, title: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Questions</Label>
                  <Input 
                    type="number"
                    value={editingTest.numberOfQuestions} 
                    onChange={(e) => setEditingTest({...editingTest, numberOfQuestions: parseInt(e.target.value) || 0})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (Mins)</Label>
                  <Input 
                    type="number"
                    value={editingTest.durationInMinutes} 
                    onChange={(e) => setEditingTest({...editingTest, durationInMinutes: parseInt(e.target.value) || 0})}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Access Level</Label>
                <Select 
                  value={editingTest.isFree ? "free" : "premium"} 
                  onValueChange={(val: any) => setEditingTest({...editingTest, isFree: val === "free"})}
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
