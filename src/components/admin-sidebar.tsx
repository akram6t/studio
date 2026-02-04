"use client";

import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BookOpen, 
  Settings, 
  LogOut, 
  Menu, 
  HelpCircle,
  ShieldCheck,
  ChevronLeft,
  BookMarked,
  Trophy,
  Zap,
  LibraryBig,
  LayoutGrid
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
import { Button } from "@/components/ui/button";

const ADMIN_NAV = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/admin" },
  { title: "Users", icon: Users, url: "/admin/users" },
  { title: "Exam Categories", icon: LayoutGrid, url: "/admin/categories" },
  { title: "Sectional Tests", icon: FileText, url: "/admin/tests" },
  { title: "Mock Tests", icon: Trophy, url: "/admin/mocks" },
  { title: "Study Content", icon: LibraryBig, url: "/admin/content" },
  { title: "Books", icon: BookMarked, url: "/admin/books" },
];

const SECONDARY_NAV = [
  { title: "Settings", icon: Settings, url: "/admin/settings" },
  { title: "Help Center", icon: HelpCircle, url: "/admin/help" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r shadow-sm">
      <SidebarHeader className="p-4 border-b bg-primary/5">
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl shrink-0">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className={cn(
            "flex flex-col transition-all duration-300",
            state === "collapsed" && "w-0 opacity-0"
          )}>
            <span className="font-headline font-bold text-sm tracking-tight whitespace-nowrap">Admin Central</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">ExamPrep v2.0</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest opacity-50">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV.map((item) => {
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

      <SidebarFooter className="p-4 border-t bg-muted/30">
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
