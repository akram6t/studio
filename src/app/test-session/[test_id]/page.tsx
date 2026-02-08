
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuestions, getMockTests, getTests, TestItem, Question } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck,
  User,
  LogOut,
  Clock
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { cn } from '@/lib/utils';

type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked-for-review' | 'answered-and-review';

export default function UniversalTestSession() {
  const params = useParams();
  const router = useRouter();
  const testId = params.test_id as string;

  const questions = useMemo(() => getQuestions(testId), [testId]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>(
    Object.fromEntries(questions.map((q, i) => [q.id, i === 0 ? 'not-answered' : 'not-visited']))
  );
  const [timeLeft, setTimeLimit] = useState(15 * 60);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished || timeLeft <= 0) {
      if (timeLeft === 0) setIsFinished(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLimit((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
    setStatuses({ ...statuses, [currentQuestion.id]: 'answered' });
  };

  const handleSaveAndNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      const nextId = questions[nextIndex].id;
      if (statuses[nextId] === 'not-visited') {
        setStatuses({ ...statuses, [nextId]: 'not-answered' });
      }
      setCurrentIndex(nextIndex);
    }
  };

  const handleMarkForReview = () => {
    const nextStatuses = { ...statuses };
    if (answers[currentQuestion.id] !== undefined) {
      nextStatuses[currentQuestion.id] = 'answered-and-review';
    } else {
      nextStatuses[currentQuestion.id] = 'marked-for-review';
    }
    
    if (currentIndex + 1 < questions.length) {
      const nextId = questions[currentIndex + 1].id;
      if (nextStatuses[nextId] === 'not-visited') {
        nextStatuses[nextId] = 'not-answered';
      }
      setStatuses(nextStatuses);
      setCurrentIndex(currentIndex + 1);
    } else {
      setStatuses(nextStatuses);
    }
  };

  const clearResponse = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion.id];
    setAnswers(newAnswers);
    setStatuses({ ...statuses, [currentQuestion.id]: 'not-answered' });
  };

  const submitExam = () => {
    if (confirm("Are you sure you want to submit the exam?")) {
      setIsFinished(true);
    }
  };

  const getStatusStyles = (status: QuestionStatus) => {
    switch (status) {
      case 'answered': 
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
      case 'marked-for-review': 
        return 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50';
      case 'answered-and-review': 
        return 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50 relative after:content-[""] after:absolute after:-bottom-1 after:-right-1 after:w-2 after:h-2 after:bg-emerald-500 after:rounded-full after:border after:border-white dark:after:border-slate-900';
      case 'not-answered':
      case 'not-visited':
      default: 
        return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  if (isFinished) {
    const score = questions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);
    const attempted = Object.keys(answers).length;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-none shadow-2xl rounded-3xl bg-card">
          <div className="h-2 bg-primary w-full" />
          <CardContent className="p-6 md:p-12 text-center space-y-8 md:space-y-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50 dark:ring-emerald-950/20">
              <CheckCircle2 size={32} className="animate-in zoom-in duration-500 md:size-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground">Result Generated</h1>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">Session ID: <span className="text-foreground font-bold font-mono">{testId}</span></p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="p-3 md:p-5 bg-muted/30 rounded-xl md:rounded-2xl border border-border">
                <p className="text-xl md:text-2xl font-black text-primary">{score}</p>
                <p className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground tracking-wider">Score</p>
              </div>
              <div className="p-3 md:p-5 bg-muted/30 rounded-xl md:rounded-2xl border border-border">
                <p className="text-xl md:text-2xl font-black text-primary">{attempted}/{questions.length}</p>
                <p className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground tracking-wider">Attempted</p>
              </div>
              <div className="p-3 md:p-5 bg-muted/30 rounded-xl md:rounded-2xl border border-border">
                <p className="text-xl md:text-2xl font-black text-primary">{Math.round((score / questions.length) * 100)}%</p>
                <p className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground tracking-wider">Accuracy</p>
              </div>
            </div>

            <Button 
              className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg" 
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
    <div className="min-h-screen bg-background flex flex-col font-body">
      <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="bg-primary text-primary-foreground p-1 rounded-lg">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-[10px] md:text-xs">Logical Book Conduction</span>
            <span className="hidden md:inline text-[8px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Standard Exam Mode</span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className={cn(
            "flex items-center gap-1.5 md:gap-2 font-black font-mono px-2 md:px-4 py-1.5 rounded-lg border transition-all",
            timeLeft < 60 ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 animate-pulse" : "bg-primary text-primary-foreground border-primary"
          )}>
            <Timer className="h-3 md:h-3.5 w-3 md:w-3.5" />
            <span className="text-xs md:text-sm tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="font-bold h-8 md:h-9 px-3 md:px-5 rounded-lg shadow-md text-xs md:text-sm" 
            onClick={submitExam}
          >
            Submit
          </Button>
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden h-[calc(100vh-3.5rem)]">
        <div className="flex-grow flex flex-col min-w-0 bg-card md:m-3 md:rounded-2xl border-b md:border shadow-sm overflow-hidden">
          <div className="px-4 md:px-6 py-2 border-b bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="font-black text-primary text-[9px] md:text-[10px] uppercase tracking-widest">Question {currentIndex + 1} / {questions.length}</span>
              <div className="h-3 w-px bg-border" />
              <div className="hidden sm:flex gap-3 text-[9px] font-bold text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400">+1.0 Correct</span>
                <span className="text-rose-500 dark:text-rose-400">-0.25 Wrong</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-rose-500">
              <Flag className="h-3.5 w-3.5" />
            </Button>
          </div>

          <ScrollArea className="flex-grow">
            <div className="max-w-5xl mx-auto p-4 md:p-12 space-y-6 md:space-y-8">
              <div className="text-base md:text-xl font-medium leading-relaxed text-foreground min-h-[60px]">
                {currentQuestion.mdx ? (
                  <MarkdownRenderer content={currentQuestion.q} />
                ) : (
                  <p>{currentQuestion.q}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {currentQuestion.options.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={cn(
                      "group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border cursor-pointer transition-all duration-150",
                      answers[currentQuestion.id] === idx 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "h-6 w-6 md:h-7 md:w-7 shrink-0 rounded-lg border flex items-center justify-center font-black text-[9px] md:text-[10px] transition-all",
                      answers[currentQuestion.id] === idx 
                        ? "bg-primary text-primary-foreground border-primary shadow-md" 
                        : "bg-muted border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="text-sm md:text-base font-semibold text-foreground flex-grow text-left">
                      {currentQuestion.mdx ? (
                        <MarkdownRenderer content={option} className="prose-p:m-0" />
                      ) : (
                        <span>{option}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          <footer className="p-3 border-t bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button 
                variant="outline" 
                className="rounded-lg font-bold h-8 md:h-9 px-2 md:px-4 border-border text-muted-foreground text-[9px] md:text-[10px] gap-1 md:gap-2" 
                onClick={handleMarkForReview}
              >
                <Flag className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span className="hidden sm:inline">Review & Next</span>
              </Button>
              <Button 
                variant="ghost" 
                className="rounded-lg font-bold h-8 md:h-9 text-muted-foreground hover:text-rose-500 text-[9px] md:text-[10px]" 
                onClick={clearResponse}
              >
                <RotateCcw className="h-3 w-3 md:h-3.5 md:w-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <Button 
                variant="outline" 
                className="rounded-lg font-bold h-8 md:h-9 px-2 md:px-4 border-border disabled:opacity-30 text-[9px] md:text-[10px]" 
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Prev</span>
              </Button>
              <Button 
                className="rounded-lg font-bold h-8 md:h-9 px-4 md:px-8 shadow-lg gap-1 md:gap-2 text-[9px] md:text-[10px]" 
                onClick={handleSaveAndNext}
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish Section' : 'Save & Next'}</span>
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </footer>
        </div>

        <aside className="w-full md:w-72 flex flex-col shrink-0 md:py-3 md:pr-3 mb-20 md:mb-0">
          <div className="bg-card h-full border md:rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 md:p-5 border-b bg-muted/30 flex items-center gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={18} className="md:size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-foreground leading-tight">Student #402</span>
                <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Authenticated</span>
              </div>
            </div>

            <div className="p-4 md:p-5 flex-grow flex flex-col min-h-0">
              <h3 className="font-black text-[9px] uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" />
                Question Palette
              </h3>

              <div className="flex-grow overflow-y-auto max-h-[300px] md:max-h-none">
                <div className="grid grid-cols-5 md:grid-cols-5 gap-2 pr-2 pb-4">
                  {questions.map((q, idx) => {
                    const isSelected = idx === currentIndex;
                    const status = statuses[q.id] || 'not-visited';
                    
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          "h-8 w-8 md:h-9 md:w-9 rounded-lg border font-black text-[10px] flex items-center justify-center transition-all",
                          isSelected ? "border-slate-400 dark:border-slate-500 ring-1 ring-slate-200 dark:ring-slate-800" : "border-border",
                          getStatusStyles(status)
                        )}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border space-y-3 shrink-0">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Legend</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50" />
                    <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded bg-muted/50 border border-border" />
                    <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground">Skipped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50" />
                    <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground">Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded bg-muted/50 border border-border" />
                    <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground">Not Visited</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t shrink-0">
              <Button 
                variant="outline" 
                className="w-full h-9 md:h-10 rounded-lg border-border text-rose-600 dark:text-rose-400 text-[9px] md:text-[10px] font-bold gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                onClick={() => router.back()}
              >
                <LogOut className="h-3 w-3 md:h-3.5 md:w-3.5" />
                Exit Conduction
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
