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
import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Calendar,
  CheckCircle2,
  XCircle,
  Crown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Edit2
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const users = getUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

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
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                          <Edit2 className="h-4 w-4" />
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
              Showing <span className="text-foreground font-bold">{filteredUsers.length}</span> of {users.length} users
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
