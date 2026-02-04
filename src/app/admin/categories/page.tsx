"use client";

import { CATEGORIES, EXAMS } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  TrendingUp, 
  Layers, 
  MoreVertical,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");

  const categoriesData = useMemo(() => {
    return CATEGORIES.map((cat, index) => ({
      id: `cat-${index + 1}`,
      name: cat,
      examCount: EXAMS.filter(e => e.category === cat).length,
      status: 'active',
      trendingCount: EXAMS.filter(e => e.category === cat && e.trending).length
    })).filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Exam Categories</h1>
          <p className="text-muted-foreground text-sm">Manage high-level exam sectors and groupings.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Sectors", value: CATEGORIES.length.toString(), icon: LayoutGrid, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Exams", value: EXAMS.length.toString(), icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Trending Now", value: EXAMS.filter(e => e.trending).length.toString(), icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm">
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

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search categories..." 
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
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6">Category Name</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Active Exams</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Trending Tags</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoriesData.map((category) => (
                  <TableRow key={category.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight">{category.name}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                            ID: {category.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-sm">{category.examCount} Exams</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {category.trendingCount > 0 ? (
                          <Badge className="bg-amber-600/10 text-amber-600 border-none text-[10px] font-bold">
                            {category.trendingCount} TRENDING
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground font-semibold">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Live
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 bg-muted/20 border-t flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              Showing <span className="text-foreground font-bold">{categoriesData.length}</span> categories
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold gap-1 px-3" disabled>
                <ChevronLeft className="h-3 w-3" /> PREVIOUS
              </Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold gap-1 px-3">
                NEXT <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
