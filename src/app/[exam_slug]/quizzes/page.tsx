
"use client";

import { useParams } from 'next/navigation';
import { getQuizzes } from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, HelpCircle, Trophy } from 'lucide-react';

export default function QuizzesPage() {
  const params = useParams();
  const quizzes = getQuizzes(params.exam_slug as string);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-bold">Practice Quizzes</h2>
        <p className="text-muted-foreground text-sm">Short, daily assessments to sharpen your skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(quiz => (
          <Card key={quiz.id} className="flex flex-col border-none shadow-md overflow-hidden">
            <div className="h-2 bg-accent/20" />
            <CardContent className="p-6 flex-grow">
              <div className="flex gap-2 mb-4">
                {quiz.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-muted text-[10px]">{tag}</Badge>
                ))}
              </div>
              <h3 className="text-xl font-bold mb-6">{quiz.title}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <span>{quiz.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Timer className="h-4 w-4 text-primary" />
                  <span>{quiz.timeLimit} Mins</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-muted/20 border-t flex items-center justify-between">
              <div className="flex items-center gap-1 text-accent font-semibold text-sm">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard open</span>
              </div>
              <Button size="sm">Start Quiz</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
