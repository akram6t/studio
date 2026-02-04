"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Calendar, ArrowRight, User } from "lucide-react";

export default function InquiriesPage() {
  const inquiries = [
    { id: 'inq1', subject: 'Login issue with mobile app', user: 'sneha@example.com', date: '2 hours ago', priority: 'high' },
    { id: 'inq2', subject: 'Refund request for Premium Kit', user: 'karan@example.com', date: '5 hours ago', priority: 'medium' },
    { id: 'inq3', subject: 'Corporate bulk access pricing', user: 'info@edu-corp.com', date: 'Yesterday', priority: 'low' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold">User Inquiries</h1>
        <p className="text-muted-foreground text-sm">Manage support tickets and business inquiries.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id} className="border-none shadow-sm overflow-hidden">
            <div className={cn(
              "h-1 w-full",
              inquiry.priority === 'high' ? "bg-destructive" : inquiry.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
            )} />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{inquiry.subject}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {inquiry.user}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {inquiry.date}</span>
                      <Badge className={cn(
                        "text-[9px] font-bold uppercase",
                        inquiry.priority === 'high' ? "bg-destructive/10 text-destructive border-none" : 
                        inquiry.priority === 'medium' ? "bg-amber-500/10 text-amber-600 border-none" : 
                        "bg-blue-500/10 text-blue-600 border-none"
                      )}>
                        {inquiry.priority} Priority
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button className="gap-2 rounded-lg">
                  Respond <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
