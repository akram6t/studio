
"use client";

import { useParams } from 'next/navigation';
import { getMockTests } from '@/lib/api';
import TestListView from '@/components/TestListView';

export default function MockTestsPage() {
  const params = useParams();
  const tests = getMockTests(params.exam_slug as string);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-headline font-bold">Mock Test Series</h2>
          <p className="text-muted-foreground text-sm">Real exam-like environment to boost your confidence.</p>
        </div>
      </div>
      <TestListView tests={tests} />
    </div>
  );
}
