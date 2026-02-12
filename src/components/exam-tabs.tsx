
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function ExamTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { label: 'Overview', value: '' },
    { label: 'Mock Test', value: 'mock' },
    { label: 'Tests', value: 'tests' },
    { label: 'Prev. papers', value: 'previous-papers' },
    { label: 'Content', value: 'content' },
    { label: 'Quizzes', value: 'quizzes' },
  ];

  const currentTab = pathname.split('/').pop() === slug ? '' : pathname.split('/').pop();

  return (
    <div className="sticky top-16 z-40 -mx-4 md:mx-0">
      <div className="bg-background/95 backdrop-blur-md border-y md:border-x md:rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.05)] px-4 md:px-1 py-1">
        <Tabs value={currentTab || ''} onValueChange={(val) => router.push(`/${slug}/${val}`)} className="w-full">
          <TabsList className="bg-transparent h-auto p-0 flex w-full justify-start md:justify-center overflow-x-auto whitespace-nowrap scrollbar-hide">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className={cn(
                  "rounded-md py-2 px-4 md:px-6 transition-all text-xs md:text-sm font-bold tracking-tight",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
