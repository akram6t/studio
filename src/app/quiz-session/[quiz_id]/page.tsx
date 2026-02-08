
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuestions, getQuizzes, Question } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Zap,
  ArrowLeft,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { cn } from '@/lib/utils';

export default function QuizSessionPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quiz_id as string;

  // Use dummy questions from API
  const questions = useMemo(() => getQuestions(quizId), [quizId]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 mins default
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished || timeLeft <= 0) {
      if (timeLeft === 0) setIsFinished(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
    
    // Auto-advance with a slight delay for better UX
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300);
    }
  };

  if (isFinished) {
    const score = questions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="bg-primary p-10 text-center text-primary-foreground relative">
            <div className="absolute top-4 right-4 opacity-20">
              <Zap size={80} />
            </div>
            <Trophy className="h-16 w-16 mx-auto mb-4 text-accent" />
            <h1 className="text-3xl font-headline font-bold">Quiz Completed!</h1>
            <p className="opacity-80">Great job on finishing the booster.</p>
          </div>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-muted/50 rounded-3xl text-center border">
                <p className="text-3xl font-black text-primary">{score}/{questions.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Score</p>
              </div>
              <div className="p-6 bg-muted/50 rounded-3xl text-center border">
                <p className="text-3xl font-black text-emerald-600">{accuracy}%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Accuracy</p>
              </div>
            </div>

            <Button 
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
              onClick={() => router.push('/practice')}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-body">
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-sm md:text-base">Practice Booster</span>
            <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">Quiz Mode</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 font-mono font-black px-4 py-1.5 rounded-full border text-sm",
            timeLeft < 60 ? "bg-rose-500 text-white animate-pulse border-none" : "bg-muted/50 text-foreground"
          )}>
            <Timer className="h-4 w-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <Button size="sm" className="rounded-full font-bold h-9 px-6" onClick={() => setIsFinished(true)}>
            Finish
          </Button>
        </div>
      </header>

      <div className="w-full bg-card h-1.5 shrink-0">
        <Progress value={progress} className="h-full rounded-none" />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <Badge variant="outline" className="px-3 py-1 font-black text-[10px] tracking-widest uppercase">
              Question {currentIndex + 1} of {questions.length}
            </Badge>
            <div className="text-xl md:text-2xl font-bold leading-relaxed text-foreground">
              {currentQuestion.mdx ? (
                <MarkdownRenderer content={currentQuestion.q} />
              ) : (
                <p>{currentQuestion.q}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={cn(
                  "group flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200",
                  answers[currentQuestion.id] === idx 
                    ? "border-primary bg-primary/5 shadow-lg scale-[1.02]" 
                    : "border-border bg-card hover:border-primary/40 hover:bg-slate-100 dark:hover:bg-slate-900"
                )}
              >
                <div className={cn(
                  "h-10 w-10 shrink-0 rounded-xl border-2 flex items-center justify-center font-black text-sm transition-all",
                  answers[currentQuestion.id] === idx 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-muted border-border text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="font-semibold text-foreground flex-grow">
                  {currentQuestion.mdx ? (
                    <MarkdownRenderer content={option} className="prose-p:m-0" />
                  ) : (
                    <span>{option}</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-8">
            <Button 
              variant="ghost" 
              className="rounded-xl font-bold gap-2 text-muted-foreground"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            
            <div className="flex gap-2">
              {currentIndex === questions.length - 1 ? (
                <Button 
                  className="rounded-xl font-bold px-10 h-12 shadow-lg"
                  onClick={() => setIsFinished(true)}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="rounded-xl font-bold gap-2 border-2"
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                >
                  Skip Question <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 bg-muted/20 border-t flex justify-center">
        <div className="flex gap-2">
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30",
                answers[questions[idx].id] !== undefined && idx !== currentIndex && "bg-emerald-500"
              )} 
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
