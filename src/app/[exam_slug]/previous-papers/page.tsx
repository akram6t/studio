
"use client";

import { useParams } from 'next/navigation';
import { getPrevPapers } from '@/lib/api';
import TestListView from '@/components/TestListView';

export default function PreviousPapersPage() {
  const params = useParams();
  const tests = getPrevPapers(params.exam_slug as string);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-headline font-bold">Previous Year Papers</h2>
        <p className="text-muted-foreground text-sm">Analyze patterns from past examinations.</p>
      </div>
      <TestListView tests={tests} />
    </div>
  );
}
