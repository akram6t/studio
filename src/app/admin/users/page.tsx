
"use client";

import { getUsers, User } from "@/lib/api";
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
  Check
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

export default function AdminUsersPage() {
  const usersData = getUsers();
  const [users, setUsers] = useState<User[]>(usersData);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Edit Drawer State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Deletion Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setUsers(users.filter(u => u.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      // Auto-reset after 3 seconds if not confirmed
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
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <UserPlus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users by name or email..." 
                className="pl-10 rounded-xl bg-background border-none shadow-sm h-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {["all", "user", "creator", "admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                    roleFilter === role 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-background text-muted-foreground border hover:bg-muted"
                  )}
                >
                  {role}s
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6">Student</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Role</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-center">Premium</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Activity</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight">{user.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {user.role === 'admin' ? (
                          <Badge className="bg-slate-800 text-white border-none gap-1 px-2 py-0.5 text-[10px] font-bold">
                            <ShieldAlert className="h-2.5 w-2.5" /> ADMIN
                          </Badge>
                        ) : user.role === 'creator' ? (
                          <Badge className="bg-purple-600 text-white border-none gap-1 px-2 py-0.5 text-[10px] font-bold uppercase">
                            CREATOR
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none px-2 py-0.5 text-[10px] font-bold uppercase">
                            USER
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.isPremium ? (
                        <div className="flex items-center justify-center text-amber-600">
                          <Crown className="h-4 w-4" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[10px] font-bold">NO</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {user.status === 'active' ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[11px]">
                            <XCircle className="h-3 w-3" /> Inactive
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold">{user.testsTaken} tests taken</span>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5" /> Joined {user.joinedDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
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
                          {confirmDeleteId === user.id ? <div className="flex items-center gap-1 text-[10px] font-bold"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
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

      {/* Edit User Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Edit User Profile</SheetTitle>
            <SheetDescription>Update personal information, roles, and premium status.</SheetDescription>
          </SheetHeader>
          
          {editingUser && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingUser.name} 
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input 
                  id="edit-email" 
                  value={editingUser.email} 
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>User Role</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(val: any) => setEditingUser({...editingUser, role: val})}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="creator">Creator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <Select 
                    value={editingUser.status} 
                    onValueChange={(val: any) => setEditingUser({...editingUser, status: val})}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Premium Status</p>
                  <p className="text-xs text-muted-foreground">Grant access to all premium content</p>
                </div>
                <Button 
                  variant={editingUser.isPremium ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditingUser({...editingUser, isPremium: !editingUser.isPremium})}
                  className={cn("rounded-lg font-bold", editingUser.isPremium && "bg-amber-600 hover:bg-amber-700")}
                >
                  {editingUser.isPremium ? "Active" : "Grant"}
                </Button>
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
