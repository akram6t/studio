"use client";

import { useParams } from 'next/navigation';
import { getPrevPapers } from '@/lib/api';
import TestListView from '@/components/TestListView';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronRight, Filter } from 'lucide-react';

const YEARS = [
  "All Papers",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020 & Older"
];

export default function PreviousPapersPage() {
  const params = useParams();
  const [selectedYear, setSelectedYear] = useState("All Papers");
  
  const allTests = getPrevPapers(params.exam_slug as string);
  
  const filteredTests = useMemo(() => {
    if (selectedYear === "All Papers") return allTests;
    if (selectedYear === "2020 & Older") {
      return allTests.filter(t => t.subject && parseInt(t.subject) <= 2020);
    }
    return allTests.filter(t => t.subject === selectedYear);
  }, [allTests, selectedYear]);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-headline font-bold">Previous Year Papers</h2>
        <p className="text-muted-foreground text-xs md:text-sm">Analyze patterns from past examinations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Dropdown */}
        <div className="lg:hidden">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full bg-card h-12 rounded-xl border-none shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Select Exam Year" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {YEARS.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <Card className="border-none shadow-md overflow-hidden sticky top-48">
            <div className="bg-primary/5 p-4 border-b">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Filter by Year</span>
            </div>
            <CardContent className="p-2">
              <div className="space-y-1">
                {YEARS.map(year => {
                  const isActive = selectedYear === year;
                  return (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-all group",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span>{year}</span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Papers Content */}
        <div className="flex-grow">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Showing {filteredTests.length} papers for {selectedYear}
            </span>
          </div>
          <TestListView tests={filteredTests} />
          
          {filteredTests.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
              <h3 className="text-xl font-bold mb-2">No papers found</h3>
              <p className="text-muted-foreground">Try selecting a different year or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
