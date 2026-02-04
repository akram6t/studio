"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  FileCheck, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Award,
  BookOpen
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const DATA = [
  { name: "Mon", users: 400, revenue: 2400 },
  { name: "Tue", users: 300, revenue: 1398 },
  { name: "Wed", users: 200, revenue: 9800 },
  { name: "Thu", users: 278, revenue: 3908 },
  { name: "Fri", users: 189, revenue: 4800 },
  { name: "Sat", users: 239, revenue: 3800 },
  { name: "Sun", users: 349, revenue: 4300 },
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
    title: "Tests Created", 
    value: "2,450", 
    change: "+4.2%", 
    trend: "up", 
    icon: FileCheck, 
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  { 
    title: "Revenue", 
    value: "₹84.2L", 
    change: "+18.3%", 
    trend: "up", 
    icon: CreditCard, 
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  { 
    title: "Active Now", 
    value: "14,802", 
    change: "-2.1%", 
    trend: "down", 
    icon: Activity, 
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">System Overview</h1>
          <p className="text-muted-foreground">Monitor your platform metrics and performance indicators.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-background border px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Server Status
          </div>
        </div>
      </div>

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
                  "flex items-center text-xs font-bold",
                  stat.trend === 'up' ? "text-emerald-600" : "text-destructive"
                )}>
                  {stat.change}
                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 ml-0.5" /> : <ArrowDownRight className="h-3 w-3 ml-0.5" />}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{stat.title}</h3>
                <div className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Growth & Revenue</CardTitle>
            <CardDescription>Visual performance comparison over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Content Distribution</CardTitle>
            <CardDescription>Resource allocation by category.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { label: "Engineering (GATE)", value: 75, icon: Award, color: "bg-blue-500" },
                { label: "SSC Exams", value: 92, icon: BookOpen, color: "bg-emerald-500" },
                { label: "Civil Services", value: 45, icon: Users, color: "bg-purple-500" },
                { label: "IT & Software", value: 60, icon: Activity, color: "bg-orange-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded-lg text-white", item.color)}>
                        <item.icon className="h-3 w-3" />
                      </div>
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    <span className="text-muted-foreground font-bold">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Quick Action</h4>
              <p className="text-xs text-muted-foreground mb-4">Generate daily performance reports for stakeholders.</p>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                Export Reports
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
