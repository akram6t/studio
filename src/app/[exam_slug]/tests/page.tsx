
"use client";

import { useParams } from 'next/navigation';
import { getTests } from '@/lib/api';
import TestListView from '@/components/TestListView';

export default function TestsPage() {
  const params = useParams();
  const tests = getTests(params.exam_slug as string);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-headline font-bold">Sectional Tests</h2>
        <p className="text-muted-foreground text-sm">Focus on individual topics and subjects.</p>
      </div>
      <TestListView tests={tests} />
    </div>
  );
}
