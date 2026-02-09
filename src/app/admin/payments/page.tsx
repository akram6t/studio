"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Wallet,
  ArrowRightLeft,
  Trophy
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  user: string;
  email: string;
  plan: string;
  amount: number;
  date: string;
  status: 'success' | 'failed' | 'pending';
  method: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: 'TXN-1024', user: 'Rahul Sharma', email: 'rahul@example.com', plan: 'Quarterly Pass', amount: 399, date: '2024-03-15 10:30', status: 'success', method: 'UPI' },
  { id: 'TXN-1025', user: 'Priya Singh', email: 'priya@example.com', plan: 'Yearly Pass', amount: 999, date: '2024-03-15 11:15', status: 'success', method: 'Credit Card' },
  { id: 'TXN-1026', user: 'Amit Patel', email: 'amit@example.com', plan: 'Monthly Pass', amount: 199, date: '2024-03-15 12:00', status: 'pending', method: 'Debit Card' },
  { id: 'TXN-1027', user: 'Sneha Reddy', email: 'sneha@example.com', plan: 'Yearly Pass', amount: 999, date: '2024-03-14 09:45', status: 'success', method: 'UPI' },
  { id: 'TXN-1028', user: 'Karan Malhotra', email: 'karan@example.com', plan: 'Monthly Pass', amount: 199, date: '2024-03-14 14:20', status: 'failed', method: 'Net Banking' },
  { id: 'TXN-1029', user: 'Ananya Iyer', email: 'ananya@example.com', plan: 'Quarterly Pass', amount: 399, date: '2024-03-14 16:10', status: 'success', method: 'UPI' },
  { id: 'TXN-1030', user: 'Meera Gupta', email: 'meera@example.com', plan: 'Monthly Pass', amount: 199, date: '2024-03-13 18:30', status: 'success', method: 'Wallet' },
];

const REVENUE_DATA = [
  { day: 'Mon', revenue: 4500 },
  { day: 'Tue', revenue: 5200 },
  { day: 'Wed', revenue: 4800 },
  { day: 'Thu', revenue: 6100 },
  { day: 'Fri', revenue: 5900 },
  { day: 'Sat', revenue: 7200 },
  { day: 'Sun', revenue: 8500 },
];

const STATS = [
  { title: "Total Revenue", value: "₹84.2L", change: "+12.5%", trend: "up", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "Active Subs", value: "14,802", change: "+4.2%", trend: "up", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Success Rate", value: "98.2%", change: "+0.5%", trend: "up", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
  { title: "Pending", value: "₹1.4L", change: "-2.1%", trend: "down", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
];

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS.filter(txn => {
      const matchesSearch = txn.id.toLowerCase().includes(search.toLowerCase()) || 
                          txn.user.toLowerCase().includes(search.toLowerCase()) ||
                          txn.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">Payments & Revenue</h1>
          <p className="text-muted-foreground font-medium">Manage student subscriptions, invoices and transaction history.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
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
                  "flex items-center text-xs font-bold",
                  stat.trend === 'up' ? "text-emerald-600" : "text-destructive"
                )}>
                  {stat.change}
                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 ml-0.5" /> : <ArrowDownRight className="h-3 w-3 ml-0.5" />}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">{stat.title}</h3>
                <div className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Revenue Trend</CardTitle>
                <CardDescription>Daily gross collections for current week.</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">Weekly View</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card className="border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Plan Distribution</CardTitle>
            <CardDescription>Membership popularity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Yearly Pass", value: 65, color: "bg-amber-500", icon: <Trophy className="h-3 w-3" /> },
              { label: "Quarterly Pass", value: 25, color: "bg-blue-500", icon: <ArrowRightLeft className="h-3 w-3" /> },
              { label: "Monthly Pass", value: 10, color: "bg-slate-500", icon: <Clock className="h-3 w-3" /> },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1 rounded-md text-white", item.color)}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
            
            <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-1">New Update</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">Automatic GST invoice generation is now active for all new transactions.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table Section */}
      <Card className="border-none shadow-sm overflow-hidden bg-card">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search ID, Name or Email..." 
                className="pl-10 rounded-xl bg-background border-none shadow-sm h-11"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="h-11 rounded-xl bg-background border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4 md:w-40">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3 w-3 text-muted-foreground" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6 h-14">Transaction ID</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Student</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Plan Details</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Amount</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Method</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((txn) => (
                  <TableRow key={txn.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <span className="font-mono text-xs font-bold text-foreground">{txn.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">{txn.user}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{txn.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-foreground">{txn.plan}</span>
                        <span className="text-[9px] text-muted-foreground font-semibold flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" /> {txn.date}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-sm text-foreground">₹{txn.amount}</span>
                    </TableCell>
                    <TableCell>
                      {txn.status === 'success' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none gap-1 px-2 py-0.5 text-[9px] font-black tracking-widest">
                          <CheckCircle2 className="h-2.5 w-2.5" /> SUCCESS
                        </Badge>
                      ) : txn.status === 'failed' ? (
                        <Badge className="bg-destructive/10 text-destructive border-none gap-1 px-2 py-0.5 text-[9px] font-black tracking-widest">
                          <XCircle className="h-2.5 w-2.5" /> FAILED
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 border-none gap-1 px-2 py-0.5 text-[9px] font-black tracking-widest">
                          <Clock className="h-2.5 w-2.5" /> PENDING
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{txn.method}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="text-xs font-bold">View Receipt</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold">Email Invoice</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold text-destructive">Refund Entry</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-muted/10 border-t flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-bold text-foreground">{filteredTransactions.length}</span> records
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-20 bg-muted/5 border-t">
              <CreditCard className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground font-medium">No transactions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
