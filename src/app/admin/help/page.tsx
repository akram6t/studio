"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  BookOpen, 
  Mail, 
  MessageSquare, 
  FileText, 
  ExternalLink,
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    question: "How do I add a new Mock Test?",
    answer: "Navigate to the 'Mock Tests' section in the sidebar, click the 'Create Mock Test' button, and fill in the required details including title, duration, and question count."
  },
  {
    question: "Can I bulk upload students?",
    answer: "Currently, students must register individually. However, our staff can assist with enterprise-level bulk onboarding through the backend systems."
  },
  {
    question: "How are premium content statuses updated?",
    answer: "When a user purchases a plan, their role is updated from 'student' to 'premium' in the database. This instantly unlocks all items tagged as premium across the site."
  },
  {
    question: "How do I update the book inventory?",
    answer: "Go to the 'Books' management page. You can edit existing book details or add new ones by clicking the 'Add New Book' button at the top right."
  },
  {
    question: "Where can I see platform analytics?",
    answer: "The 'Dashboard' provides a high-level overview of revenue, user growth, and content distribution. For detailed CSV exports, use the 'Export Reports' button in the content distribution section."
  }
];

export default function AdminHelpPage() {
  const [search, setSearch] = useState("");

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(search.toLowerCase()) || 
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-headline font-bold">Admin Help Center</h1>
        <p className="text-muted-foreground text-sm">Find answers to common questions and learn how to manage the ExamPrep platform.</p>
        
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search help topics, FAQs, or tutorials..." 
            className="pl-10 h-12 rounded-2xl bg-white dark:bg-card border-none shadow-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="px-6 border-b last:border-0">
                    <AccordionTrigger className="text-sm font-bold text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFaqs.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground italic">No matching questions found.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm group-hover:text-primary transition-colors">Admin Guide</h3>
                  <p className="text-xs text-muted-foreground">Full system documentation</p>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm group-hover:text-primary transition-colors">Developer API</h3>
                  <p className="text-xs text-muted-foreground">Integrations & hooks</p>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LifeBuoy className="h-5 w-5" /> Need direct help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm opacity-90 leading-relaxed">
                Our support team is available Mon-Fri, 9AM to 6PM (IST) to help you with technical issues.
              </p>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full gap-2 rounded-xl font-bold">
                  <MessageSquare className="h-4 w-4" /> Live Chat
                </Button>
                <Button className="w-full gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl font-bold">
                  <Mail className="h-4 w-4" /> Email Support
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">System Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { version: "v2.4.0", date: "2 days ago", note: "Improved analytics engine" },
                { version: "v2.3.9", date: "1 week ago", note: "Security patch for user auth" }
              ].map((update, i) => (
                <div key={i} className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">{update.version}</p>
                    <p className="text-[10px] text-muted-foreground">{update.note}</p>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{update.date}</span>
                </div>
              ))}
              <Button variant="link" className="p-0 h-auto text-[11px] font-bold gap-1 mt-2">
                VIEW CHANGELOG <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
