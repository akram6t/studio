"use client";

import { getContent } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  FileText, 
  MonitorPlay, 
  BookOpen, 
  MoreVertical,
  CheckCircle2,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  LibraryBig
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminContentPage() {
  const contentItems = getContent('all');
  const [search, setSearch] = useState("");

  const filteredContent = useMemo(() => {
    return contentItems.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
  }, [contentItems, search]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'ppt': return <MonitorPlay className="h-4 w-4 text-orange-500" />;
      default: return <BookOpen className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Study Content</h1>
          <p className="text-muted-foreground text-sm">Upload and manage PDFs, slides, and articles.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Assets", value: "245", icon: LibraryBig, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Premium Items", value: "112", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Verified", value: "98%", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Downloads", value: "84k", icon: Download, color: "text-purple-600", bg: "bg-purple-50" },
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
              placeholder="Filter by content title..." 
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
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6">Title & Preview</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Type</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Access</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((item) => (
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
                          <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                            Added: 24 Oct 2024
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-muted-foreground">
                        {getIcon(item.type)}
                        {item.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.isFree ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-bold">FREE</Badge>
                      ) : (
                        <Badge className="bg-amber-600/10 text-amber-600 border-none text-[10px] font-bold">PREMIUM</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Live
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
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
              Showing <span className="text-foreground font-bold">{filteredContent.length}</span> assets
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