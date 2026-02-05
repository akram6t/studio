"use client";

import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  HelpCircle,
  ChevronRight,
  Trophy,
  Zap,
  LibraryBig,
  LayoutGrid,
  BookMarked,
  CheckCircle2,
  MessageSquare,
  GraduationCap,
  Image as ImageIcon,
  Target
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
  SidebarRail
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Mock user role for prototyping - in real app this would come from an Auth context
const CURRENT_USER_ROLE: 'admin' | 'creator' | 'user' = 'admin';

const ADMIN_NAV = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/admin" },
  { title: "Users", icon: Users, url: "/admin/users" },
  { title: "Exam Categories", icon: LayoutGrid, url: "/admin/categories" },
  { title: "Exams", icon: GraduationCap, url: "/admin/exams" },
  { title: "Practice Sets", icon: Target, url: "/admin/practice" },
  { title: "Sectional Tests", icon: FileText, url: "/admin/tests" },
  { title: "Mock Tests", icon: Trophy, url: "/admin/mocks" },
  { title: "Study Content", icon: LibraryBig, url: "/admin/content" },
  { title: "Books", icon: BookMarked, url: "/admin/books" },
  { title: "Media Library", icon: ImageIcon, url: "/admin/media" },
];

const SECONDARY_NAV = [
  { title: "Settings", icon: Settings, url: "/admin/settings" },
  { title: "Help Center", icon: HelpCircle, url: "/admin/help" },
];

// Conditionally added pages
const RESTRICTED_NAV = [
  { title: "Approvals", icon: CheckCircle2, url: "/admin/approvals", restrictedRoles: ['creator'] },
  { title: "Inquiries", icon: MessageSquare, url: "/admin/inquiries", restrictedRoles: ['creator'] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredRestrictedNav = RESTRICTED_NAV.filter(item => 
    !item.restrictedRoles.includes(CURRENT_USER_ROLE)
  );

  return (
    <Sidebar collapsible="icon" className="border-r shadow-sm">
      <SidebarHeader className="p-4 border-b bg-transparent">
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl shrink-0">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className={cn(
            "flex flex-col transition-all duration-300",
            state === "collapsed" && "w-0 opacity-0"
          )}>
            <span className="font-headline font-bold text-sm tracking-tight whitespace-nowrap">Admin Central</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Role: {CURRENT_USER_ROLE}</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest opacity-50">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV.map((item) => {
                const isActive = pathname === item.url || (item.url !== '/admin' && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200 h-10 px-4",
                        isActive 
                          ? "bg-primary/10 text-primary shadow-sm" 
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-semibold text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {filteredRestrictedNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest opacity-50">Operations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredRestrictedNav.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "transition-all duration-200 h-10 px-4",
                          isActive 
                            ? "bg-primary/10 text-primary shadow-sm" 
                            : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                          <span className="font-semibold text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest opacity-50">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY_NAV.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200 h-10 px-4",
                        isActive 
                          ? "bg-primary/10 text-primary shadow-sm" 
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-semibold text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t bg-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-destructive/10 hover:text-destructive h-10 px-4">
              <Link href="/">
                <LogOut className="h-4 w-4" />
                <span className="font-semibold text-sm">Exit Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
