"use client";

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  MousePointer2,
  UserPlus,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// Performance Optimization: Dynamically import heavy Recharts components
// This prevents the main bundle from including large charting logic on initial load
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

const REVENUE_DATA = [
  { name: "Mon", users: 400, revenue: 2400, projections: 2100 },
  { name: "Tue", users: 300, revenue: 1398, projections: 1800 },
  { name: "Wed", users: 200, revenue: 9800, projections: 8000 },
  { name: "Thu", users: 278, revenue: 3908, projections: 4200 },
  { name: "Fri", users: 189, revenue: 4800, projections: 4500 },
  { name: "Sat", users: 239, revenue: 3800, projections: 4000 },
  { name: "Sun", users: 349, revenue: 4300, projections: 4100 },
];

const TEST_STATS_DATA = [
  { category: "SSC", attempted: 4500, completed: 3800 },
  { category: "GATE", attempted: 2100, completed: 1950 },
  { category: "UPSC", attempted: 3200, completed: 2100 },
  { category: "CDAC", attempted: 1200, completed: 1100 },
  { category: "BANK", attempted: 2800, completed: 2400 },
];

const DEVICE_DATA = [
  { name: "Mobile", value: 65, color: "#10b981" },
  { name: "Desktop", value: 30, color: "#3b82f6" },
  { name: "Tablet", value: 5, color: "#f59e0b" },
];

const STATS = [
  { 
    title: "Total Students", 
    value: "1.2M", 
    change: "+12.5%", 
    trend: "up", 
    icon: Users, 
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  { 
    title: "Monthly Revenue", 
    value: "₹84.2L", 
    change: "+18.3%", 
    trend: "up", 
    icon: CreditCard, 
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  { 
    title: "New Signups", 
    value: "2,450", 
    change: "+4.2%", 
    trend: "up", 
    icon: UserPlus, 
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  { 
    title: "Engagement Rate", 
    value: "74.8%", 
    change: "-2.1%", 
    trend: "down", 
    icon: MousePointer2, 
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
];

const RECENT_ALERTS = [
  { id: 1, user: "rahul@example.com", action: "Purchased Yearly Pass", time: "2 mins ago", status: "success" },
  { id: 2, user: "sneha_reddy", action: "Completed SSC Mock #12", time: "5 mins ago", status: "info" },
  { id: 3, user: "admin_vikram", action: "Updated CDAC Syllabus", time: "12 mins ago", status: "admin" },
  { id: 4, user: "karan_m", action: "Payment Failed", time: "15 mins ago", status: "error" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">System Intelligence</h1>
          <p className="text-muted-foreground font-medium">Real-time platform performance and user behavioral analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-background border px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Nodes: 12 Active
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm overflow-hidden group">
            <div className={cn("h-1 w-full", stat.trend === 'up' ? "bg-emerald-500" : "bg-destructive")} />
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center text-xs font-black",
                  stat.trend === 'up' ? "text-emerald-600" : "text-destructive"
                )}>
                  {stat.change}
                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 ml-0.5" /> : <ArrowDownRight className="h-3 w-3 ml-0.5" />}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-none">{stat.title}</h3>
                <div className="text-3xl font-bold mt-1.5 tracking-tight text-foreground">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Revenue Growth & Projections</CardTitle>
                <CardDescription>Performance comparison against weekly targets.</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Projected</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="projections" stroke="#cbd5e1" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card flex flex-col">
          <CardHeader className="border-b bg-muted/5">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500 fill-current" /> Live System Events
            </CardTitle>
            <CardDescription>Real-time updates from across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <div className="divide-y">
              {RECENT_ALERTS.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-3">
                  <div className={cn(
                    "mt-1 h-2 w-2 rounded-full shrink-0",
                    alert.status === 'success' ? "bg-emerald-500" : 
                    alert.status === 'error' ? "bg-rose-500" : 
                    alert.status === 'admin' ? "bg-blue-500" : "bg-amber-500"
                  )} />
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{alert.user}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{alert.action}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t mt-auto">
            <button className="w-full text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Logs</button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-sm bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Preparation Velocity</CardTitle>
            <CardDescription>Test attempts vs. successful completions by sector.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEST_STATS_DATA} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="attempted" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Aspirant Access</CardTitle>
            <CardDescription>Primary device distribution.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col">
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEVICE_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {DEVICE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {DEVICE_DATA.map((item) => (
                <div key={item.name} className="flex flex-col items-center p-2 rounded-xl bg-muted/30">
                  {item.name === "Mobile" ? <Smartphone className="h-4 w-4 mb-1 text-emerald-500" /> : 
                   item.name === "Desktop" ? <Laptop className="h-4 w-4 mb-1 text-blue-500" /> : 
                   <Tablet className="h-4 w-4 mb-1 text-amber-500" />}
                  <span className="text-[10px] font-black">{item.value}%</span>
                  <span className="text-[8px] uppercase font-bold text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
