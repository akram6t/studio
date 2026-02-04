"use client";

import { getMockTests } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Trophy, 
  Timer, 
  Award, 
  HelpCircle,
  MoreVertical,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminMocksPage() {
  const mocks = getMockTests('all');
  const [search, setSearch] = useState("");

  const filteredMocks = useMemo(() => {
    return mocks.filter(mock => mock.title.toLowerCase().includes(search.toLowerCase()));
  }, [mocks, search]);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Active Mocks", value: "850+", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Total Attempts", value: "4.2M", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg. Duration", value: "110m", icon: Timer, color: "text-blue-600", bg: "bg-blue-50" },
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
              placeholder="Filter by mock title..." 
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
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6">Mock Details</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Section</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Questions</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Time</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Access</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMocks.map((mock) => (
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
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground border-none text-[10px] font-bold">
                        {mock.subject}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-sm">{mock.numberOfQuestions} Qs</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-sm">{mock.durationInMinutes}m</span>
                    </TableCell>
                    <TableCell>
                      {mock.isFree ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-bold px-2 py-0.5">FREE</Badge>
                      ) : (
                        <Badge className="bg-amber-600/10 text-amber-600 border-none text-[10px] font-bold px-2 py-0.5">PREMIUM</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
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
              Showing <span className="text-foreground font-bold">{filteredMocks.length}</span> results
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