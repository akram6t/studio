
"use client";

import { getMockTests, TestItem } from "@/lib/api";
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
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
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
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminMocksPage() {
  const mocksData = getMockTests('all');
  const [mocks, setMocks] = useState<TestItem[]>(mocksData);
  const [search, setSearch] = useState("");

  // Drawer State
  const [editingMock, setEditingMock] = useState<TestItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredMocks = useMemo(() => {
    return mocks.filter(mock => mock.title.toLowerCase().includes(search.toLowerCase()));
  }, [mocks, search]);

  const handleEdit = (mock: TestItem) => {
    setEditingMock(mock);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    setMocks(mocks.filter(m => m.id !== id));
  };

  const handleSave = () => {
    if (editingMock) {
      setMocks(mocks.map(m => m.id === editingMock.id ? editingMock : m));
      setIsSheetOpen(false);
    }
  };

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
          { label: "Active Mocks", value: mocks.length.toString(), icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
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
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
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
