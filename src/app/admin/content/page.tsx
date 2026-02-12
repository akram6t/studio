"use client";

import { getContent, ContentItem, getExams, Exam } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Plus, 
  FileText, 
  BookOpen, 
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  LibraryBig,
  Check,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Filter,
  Loader2,
  GraduationCap,
  CircleDashed,
  Calendar,
  ArrowUpDown
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
import { formatDistanceToNow } from "date-fns";

const ITEMS_PER_PAGE = 5;

type SortOption = 'newest' | 'oldest' | 'date-asc' | 'date-desc';

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Column Selector
  const [visibleColumns, setVisibleColumns] = useState({
    exams: true,
    type: true,
    access: true,
    status: true
  });

  // Drawer State
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Deletion Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [contentData, examsData] = await Promise.all([
          getContent('all'),
          getExams()
        ]);
        setContent(contentData);
        setExams(examsData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredAndSortedContent = useMemo(() => {
    let result = content.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchesExam = examFilter === "all" || (item.examSlugs?.includes(examFilter) || item.examSlug === examFilter);
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesAccess = accessFilter === "all" || (accessFilter === "free" ? item.isFree : !item.isFree);
      return matchesSearch && matchesExam && matchesType && matchesAccess;
    });

    // Sorting logic
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
  }, [content, search, examFilter, typeFilter, accessFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedContent.length / ITEMS_PER_PAGE);
  const paginatedContent = filteredAndSortedContent.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (item: ContentItem) => {
    setEditingItem({
      ...item,
      status: item.status || 'published',
      examSlugs: item.examSlugs || (item.examSlug ? [item.examSlug] : [])
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setContent(content.filter(c => c.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const handleSave = () => {
    if (editingItem) {
      setContent(content.map(c => c.id === editingItem.id ? editingItem : c));
      setIsSheetOpen(false);
    }
  };

  const toggleExamSelection = (slug: string) => {
    if (!editingItem) return;
    const currentSlugs = editingItem.examSlugs || [];
    if (currentSlugs.includes(slug)) {
      setEditingItem({ ...editingItem, examSlugs: currentSlugs.filter(s => s !== slug) });
    } else {
      setEditingItem({ ...editingItem, examSlugs: [...currentSlugs, slug] });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-rose-500" />;
      case 'blog': return <BookOpen className="h-4 w-4 text-blue-500" />;
      default: return <BookOpen className="h-4 w-4 text-blue-500" />;
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
          <h1 className="text-2xl font-headline font-bold">Study Content</h1>
          <p className="text-muted-foreground text-sm">Upload and manage PDFs and long-form study articles.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter content..." 
                  className="pl-10 rounded-xl bg-background border-none shadow-sm h-11"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[180px]">
                  <Select value={sortBy} onValueChange={(val: SortOption) => setSortBy(val)}>
                    <SelectTrigger className="h-11 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
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
                    <DropdownMenuCheckboxItem checked={visibleColumns.exams} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, exams: v }))}>
                      Exams
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.type} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, type: v }))}>
                      Type
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.access} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, access: v }))}>
                      Access
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={visibleColumns.status} onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, status: v }))}>
                      Status
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-[180px]">
                <Select value={examFilter} onValueChange={(val) => { setExamFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
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

              <div className="w-[180px]">
                <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3 w-3 text-muted-foreground" />
                      <SelectValue placeholder="All Types" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF Documents</SelectItem>
                    <SelectItem value="blog">Articles (MDX)</SelectItem>
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
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6">Title & Preview</TableHead>
                  {visibleColumns.exams && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Exams</TableHead>}
                  {visibleColumns.type && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Type</TableHead>}
                  {visibleColumns.access && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Access</TableHead>}
                  {visibleColumns.status && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>}
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContent.map((item) => (
                  <TableRow key={item.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-10 rounded-md bg-muted overflow-hidden relative border shrink-0">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt="" className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                              <LibraryBig className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight line-clamp-1">{item.title}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground font-semibold">ID: {item.id}</span>
                            <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" />
                              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {visibleColumns.exams && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(item.examSlugs || (item.examSlug ? [item.examSlug] : [])).map(slug => {
                            const exam = exams.find(e => e.slug === slug);
                            return (
                              <Badge key={slug} variant="outline" className="text-[9px] font-bold border-primary/20 text-primary py-0">
                                {exam?.title || slug}
                              </Badge>
                            );
                          })}
                          {(!item.examSlugs && !item.examSlug) && <span className="text-[10px] text-muted-foreground italic">General</span>}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.type && (
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-muted-foreground">
                          {getIcon(item.type)}
                          {item.type}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.access && (
                      <TableCell>
                        {item.isFree ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-bold px-2 py-0.5">FREE</Badge>
                        ) : (
                          <Badge className="bg-amber-600/10 text-amber-600 border-none text-[10px] font-bold px-2 py-0.5">PREMIUM</Badge>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell>
                        {item.status === 'published' ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> Live
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[11px]">
                            <CircleDashed className="h-3 w-3" /> Draft
                          </div>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(item)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(item.id)}
                          className={cn(
                            "h-8 w-8 rounded-lg transition-all",
                            confirmDeleteId === item.id 
                              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                              : "hover:bg-destructive/10 hover:text-destructive"
                          )}
                        >
                          {confirmDeleteId === item.id ? <div className="flex items-center gap-1 text-[10px] font-bold"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
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
              Showing <span className="font-bold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedContent.length)}</span> of <span className="font-bold text-foreground">{filteredAndSortedContent.length}</span> items
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

      {/* Edit Content Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Edit Resource</SheetTitle>
            <SheetDescription>Modify resource details, type, and availability.</SheetDescription>
          </SheetHeader>
          
          {editingItem && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-item-title" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Resource Title</Label>
                <Input 
                  id="edit-item-title" 
                  value={editingItem.title} 
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Content Type</Label>
                <Select 
                  value={editingItem.type} 
                  onValueChange={(val: any) => setEditingItem({...editingItem, type: val})}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="blog">Study Article (MDX)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Associated Exams</Label>
                </div>
                <div className="grid grid-cols-1 gap-2 p-4 bg-muted/30 rounded-2xl border">
                  {exams.map(exam => {
                    const isSelected = editingItem.examSlugs?.includes(exam.slug);
                    return (
                      <div key={exam.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background/50 transition-colors">
                        <Checkbox 
                          id={`exam-${exam.slug}`} 
                          checked={isSelected}
                          onCheckedChange={() => toggleExamSelection(exam.slug)}
                        />
                        <Label 
                          htmlFor={`exam-${exam.slug}`} 
                          className="text-sm font-semibold cursor-pointer flex-grow"
                        >
                          {exam.title}
                        </Label>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">Linking this content to multiple exams makes it appear in all their detail pages.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Access Status</Label>
                  <Select 
                    value={editingItem.isFree ? "free" : "premium"} 
                    onValueChange={(val: any) => setEditingItem({...editingItem, isFree: val === "free"})}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free Resource</SelectItem>
                      <SelectItem value="premium">Premium Resource</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Publication Status</Label>
                  <Select 
                    value={editingItem.status || "published"} 
                    onValueChange={(val: any) => setEditingItem({...editingItem, status: val})}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft (Hidden)</SelectItem>
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
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
