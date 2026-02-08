
"use client";

import { useParams } from 'next/navigation';
import { getQuizzes } from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, HelpCircle, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';

export default function QuizzesPage() {
  const params = useParams();
  const quizzes = getQuizzes(params.exam_slug as string);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-headline font-bold">Practice Quizzes</h2>
          <p className="text-muted-foreground text-sm">Short, daily assessments to sharpen your skills.</p>
        </div>
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 gap-1.5 py-1 px-3">
          <Zap className="h-3 w-3 fill-current" /> Daily Boosters
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(quiz => (
          <Card key={quiz.id} className="group flex flex-col border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-card">
            <div className="h-1.5 bg-gradient-to-r from-primary to-accent opacity-50 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex-grow">
              <div className="flex gap-2 mb-4">
                {quiz.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-muted text-[9px] font-black uppercase tracking-widest">{tag}</Badge>
                ))}
              </div>
              <h3 className="text-xl font-bold mb-6 group-hover:text-primary transition-colors">{quiz.title}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <span>{quiz.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <Timer className="h-4 w-4 text-primary" />
                  <span>{quiz.timeLimit} Mins</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-muted/5 border-t flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-accent font-bold text-xs uppercase tracking-wider">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </div>
              <Link href={`/quiz-session/${quiz.id}`} className="flex-grow md:flex-grow-0">
                <Button className="w-full md:w-auto rounded-xl font-bold px-6 shadow-lg shadow-primary/10">Start Quiz</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
