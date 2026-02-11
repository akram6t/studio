
"use client";

import { getUsers, SystemUser } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  UserPlus, 
  Mail, 
  Calendar,
  CheckCircle2,
  XCircle,
  Crown,
  ShieldAlert,
  Edit2,
  Trash2,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Filter,
  Clock
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [premiumFilter, setPremiumFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Column Selection State
  const [visibleColumns, setVisibleColumns] = useState({
    role: true,
    premium: true,
    status: true,
    activity: true
  });

  // Edit Drawer State
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Deletion Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesPremium = premiumFilter === "all" || (premiumFilter === "premium" ? user.isPremium : !user.isPremium);
      return matchesSearch && matchesRole && matchesStatus && matchesPremium;
    });
  }, [users, search, roleFilter, statusFilter, premiumFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (user: SystemUser) => {
    setEditingUser({ ...user });
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setUsers(users.filter(u => u.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setIsSheetOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm">Review, verify and manage student accounts.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
          <UserPlus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or email..." 
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
                    <Button variant="outline" className="gap-2 h-11 rounded-xl font-bold">
                      <Settings2 className="h-4 w-4" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.role} 
                      onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, role: v }))}
                    >
                      Role
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.premium} 
                      onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, premium: v }))}
                    >
                      Premium & Validity
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.status} 
                      onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, status: v }))}
                    >
                      Status
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.activity} 
                      onCheckedChange={(v) => setVisibleColumns(prev => ({ ...prev, activity: v }))}
                    >
                      Activity
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-[180px]">
                <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3 w-3 text-muted-foreground" />
                      <SelectValue placeholder="All Roles" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Users Only</SelectItem>
                    <SelectItem value="creator">Content Creators</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px]">
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px]">
                <Select value={premiumFilter} onValueChange={(val) => { setPremiumFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
                    <SelectValue placeholder="Premium Access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Access Modes</SelectItem>
                    <SelectItem value="premium">Premium Holders</SelectItem>
                    <SelectItem value="free">Free Users</SelectItem>
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
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6 h-14">Student Info</TableHead>
                  {visibleColumns.role && <TableHead className="font-bold text-[10px] uppercase tracking-widest">System Role</TableHead>}
                  {visibleColumns.premium && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Premium Validity</TableHead>}
                  {visibleColumns.status && <TableHead className="font-bold text-[10px] uppercase tracking-widest">Account Status</TableHead>}
                  {visibleColumns.activity && <TableHead className="font-bold text-[10px] uppercase tracking-widest">User Activity</TableHead>}
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Syncing with Atlas...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-1 ring-primary/20">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight text-foreground">{user.name}</span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                            <Mail className="h-2.5 w-2.5" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    {visibleColumns.role && (
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {user.role === 'admin' ? (
                            <Badge className="bg-slate-800 text-white border-none gap-1 px-2 py-0.5 text-[9px] font-black tracking-widest">
                              <ShieldAlert className="h-2.5 w-2.5" /> ADMIN
                            </Badge>
                          ) : user.role === 'creator' ? (
                            <Badge className="bg-purple-600/10 text-purple-600 border-none px-2 py-0.5 text-[9px] font-black tracking-widest uppercase">
                              CREATOR
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-none px-2 py-0.5 text-[9px] font-black tracking-widest uppercase">
                              USER
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.premium && (
                      <TableCell>
                        {user.isPremium ? (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-amber-600 font-bold text-[10px] uppercase tracking-wider">
                              <Crown className="h-3 w-3" /> ACTIVE
                            </div>
                            {user.premiumExpiry && (
                              <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" /> Exp: {user.premiumExpiry}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-[10px] font-bold tracking-widest">FREE TIER</span>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {user.status === 'active' ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                              <CheckCircle2 className="h-3 w-3" /> Live
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[11px]">
                              <XCircle className="h-3 w-3" /> Locked
                            </div>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.activity && (
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-bold text-foreground">{user.testsTaken} Tests Completed</span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(user.id)}
                          className={cn(
                            "h-8 w-8 rounded-lg transition-all",
                            confirmDeleteId === user.id 
                              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                              : "hover:bg-destructive/10 hover:text-destructive"
                          )}
                        >
                          {confirmDeleteId === user.id ? <div className="flex items-center gap-1 text-[10px] font-black uppercase"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 bg-muted/10 border-t flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Showing <span className="font-bold text-foreground">{Math.max(0, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="font-bold text-foreground">{filteredUsers.length}</span> students
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map(page => (
                  <Button 
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-bold", 
                      currentPage === page && "shadow-lg shadow-primary/20 border-primary"
                    )}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Edit User Profile</SheetTitle>
            <SheetDescription>Update access credentials, system roles, and premium membership validity.</SheetDescription>
          </SheetHeader>
          
          {editingUser && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingUser.name} 
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="rounded-xl h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Email Address</Label>
                <Input 
                  id="edit-email" 
                  value={editingUser.email} 
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="rounded-xl h-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">User Role</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(val: any) => setEditingUser({...editingUser, role: val})}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Student / User</SelectItem>
                      <SelectItem value="creator">Content Creator</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Account Status</Label>
                  <Select 
                    value={editingUser.status} 
                    onValueChange={(val: any) => setEditingUser({...editingUser, status: val})}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active (Verified)</SelectItem>
                      <SelectItem value="inactive">Inactive (Locked)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold flex items-center gap-2">
                      <Crown className={cn("h-4 w-4", editingUser.isPremium ? "text-amber-600" : "text-muted-foreground")} />
                      Premium Access
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Unlocks all official mocks & sets</p>
                  </div>
                  <Button 
                    variant={editingUser.isPremium ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const isNowPremium = !editingUser.isPremium;
                      setEditingUser({
                        ...editingUser, 
                        isPremium: isNowPremium,
                        premiumExpiry: isNowPremium && !editingUser.premiumExpiry ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] : editingUser.premiumExpiry
                      });
                    }}
                    className={cn("rounded-xl font-bold h-9 px-4", editingUser.isPremium && "bg-amber-600 hover:bg-amber-700")}
                  >
                    {editingUser.isPremium ? "Member" : "Grant"}
                  </Button>
                </div>

                {editingUser.isPremium && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="edit-expiry" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Membership Validity (Expiry Date)
                    </Label>
                    <Input 
                      id="edit-expiry"
                      type="date"
                      value={editingUser.premiumExpiry || ""} 
                      onChange={(e) => setEditingUser({...editingUser, premiumExpiry: e.target.value})}
                      className="rounded-xl h-11"
                    />
                    <p className="text-[10px] text-muted-foreground italic pl-1">The user will lose premium access after this date.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <SheetFooter className="mt-8 gap-2 pb-8">
            <SheetClose asChild>
              <Button variant="outline" className="w-full rounded-xl h-11 font-bold">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave} className="w-full gap-2 rounded-xl h-11 font-bold shadow-lg shadow-primary/20 bg-primary text-primary-foreground">
              <Save className="h-4 w-4" />
              Update Account
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
