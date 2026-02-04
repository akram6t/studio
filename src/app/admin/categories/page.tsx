
"use client";

import { CATEGORIES, EXAMS } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  Layers, 
  CheckCircle2,
  XCircle,
  BookOpen,
  Edit2,
  Trash2,
  Save,
  Check,
  ChevronRight,
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
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface CategoryData {
  id: string;
  name: string;
  examCount: number;
  status: string;
}

export default function AdminCategoriesPage() {
  const initialData = CATEGORIES.map((cat, index) => ({
    id: `cat-${index + 1}`,
    name: cat,
    examCount: EXAMS.filter(e => e.category === cat).length,
    status: 'active'
  }));

  const [categories, setCategories] = useState<CategoryData[]>(initialData);
  const [search, setSearch] = useState("");
  
  // Drawer State
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Deletion Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  const handleEdit = (cat: CategoryData) => {
    setEditingCategory(cat);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setCategories(categories.filter(c => c.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
      setIsSheetOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Exam Categories</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage high-level exam sectors, groupings, and their availability.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: "Total Sectors", value: categories.length.toString(), icon: LayoutGrid, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Exams", value: categories.reduce((acc, curr) => acc + curr.examCount, 0).toString(), icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search categories by name..." 
              className="pl-10 rounded-xl bg-background border-none shadow-sm h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6 h-14">Category & Icon</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Active Exams</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Visibility Status</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 shadow-sm">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight text-foreground">{category.name}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-sm text-foreground">{category.examCount} Published Exams</span>
                    </TableCell>
                    <TableCell>
                      {category.status === 'active' ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[11px] uppercase tracking-wider">
                          <XCircle className="h-3.5 w-3.5" /> Inactive
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(category)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(category.id)}
                          className={cn(
                            "h-8 w-8 rounded-lg transition-all",
                            confirmDeleteId === category.id 
                              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                              : "hover:bg-destructive/10 hover:text-destructive"
                          )}
                        >
                          {confirmDeleteId === category.id ? <div className="flex items-center gap-1 text-[10px] font-black uppercase"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCategories.length === 0 && (
            <div className="text-center py-20 bg-muted/5 border-t">
              <p className="text-sm text-muted-foreground font-medium">No categories found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Category Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader className="mb-6 border-b pb-4">
            <SheetTitle className="text-xl font-headline font-bold">Category Configuration</SheetTitle>
            <SheetDescription className="font-medium">Update the naming and system visibility for this exam sector.</SheetDescription>
          </SheetHeader>
          
          {editingCategory && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cat-name" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Category Name</Label>
                <Input 
                  id="edit-cat-name" 
                  value={editingCategory.name} 
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="rounded-xl h-11 font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Availability Status</Label>
                <Select 
                  value={editingCategory.status} 
                  onValueChange={(val) => setEditingCategory({...editingCategory, status: val})}
                >
                  <SelectTrigger className="rounded-xl h-11 font-semibold">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Visible to Students)</SelectItem>
                    <SelectItem value="inactive">Inactive (Hidden from Platform)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground italic px-1 pt-1">
                  Inactive categories and their associated exams will not be visible in the public explore section.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Statistics Overview</Label>
                <div className="p-4 bg-muted/30 rounded-2xl border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-background p-2 rounded-lg shadow-sm border">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-bold">Associated Exams</span>
                  </div>
                  <span className="text-lg font-black">{editingCategory.examCount}</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic text-center pt-2">
                  Exams are managed in the <span className="font-bold">Exams</span> section.
                </p>
              </div>
            </div>
          )}

          <SheetFooter className="mt-8 gap-2 pb-8">
            <SheetClose asChild>
              <Button variant="outline" className="w-full rounded-xl h-11 font-bold">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave} className="w-full gap-2 rounded-xl h-11 font-bold shadow-lg shadow-primary/20">
              <Save className="h-4 w-4" />
              Save Category
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
