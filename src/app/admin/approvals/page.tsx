"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Eye, FileText, User } from "lucide-react";

export default function ApprovalsPage() {
  const pendingApprovals = [
    { id: 'app1', type: 'Content', title: 'Mathematics Formula Sheet', requester: 'Rahul S.', date: '2024-03-14', status: 'pending' },
    { id: 'app2', type: 'Test', title: 'SSC Mock Test #12', requester: 'Priya K.', date: '2024-03-12', status: 'pending' },
    { id: 'app3', type: 'Instructor', title: 'Teaching Profile Activation', requester: 'Amit D.', date: '2024-03-10', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold">Pending Approvals</h1>
        <p className="text-muted-foreground text-sm">Review and approve new content, tests, and instructor profiles.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingApprovals.map((item) => (
          <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    {item.type === 'Content' ? <FileText className="h-6 w-6" /> : <User className="h-6 w-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{item.title}</h3>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20">{item.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> Requested by {item.requester}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 rounded-lg">
                    <Eye className="h-4 w-4" /> View Detail
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive hover:bg-destructive/10 rounded-lg">
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                  <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
