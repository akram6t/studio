"use client";

import { useParams } from 'next/navigation';
import { getMockTests } from '@/lib/api';
import TestListView from '@/components/TestListView';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronRight, Filter } from 'lucide-react';

const CATEGORIES = [
  "All Mock Tests",
  "Full Length",
  "Section A",
  "Section B",
  "Section C",
  "Level 1 (Primary)",
  "Level 2 (Upper Primary)",
  "Quantitative Aptitude",
  "Reasoning Ability"
];

export default function MockTestsPage() {
  const params = useParams();
  const [selectedCategory, setSelectedCategory] = useState("All Mock Tests");
  
  const allTests = getMockTests(params.exam_slug as string);
  
  const filteredTests = useMemo(() => {
    if (selectedCategory === "All Mock Tests") return allTests;
    return allTests.filter(t => t.subject === selectedCategory);
  }, [allTests, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-headline font-bold">Mock Test Series</h2>
        <p className="text-muted-foreground text-xs md:text-sm">Exam-specific sections and full-length practice tests.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Dropdown */}
        <div className="lg:hidden">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full bg-card h-12 rounded-xl border-none shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Select Section/Level" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <Card className="border-none shadow-md overflow-hidden sticky top-48">
            <div className="bg-primary/5 p-4 border-b">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Filter by Section / Level</span>
            </div>
            <CardContent className="p-2">
              <div className="space-y-1">
                {CATEGORIES.map(cat => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-all group",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span>{cat}</span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Tests Content */}
        <div className="flex-grow">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Showing {filteredTests.length} results in {selectedCategory}
            </span>
          </div>
          <TestListView tests={filteredTests} />
        </div>
      </div>
    </div>
  );
}
