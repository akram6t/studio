"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuestions, getTopicSets, Question } from '@/lib/api';
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

export default function ExamScreen() {
  const params = useParams();
  const router = useRouter();
  const setId = params.set_id as string;
  const questions = useMemo(() => getQuestions(setId), [setId]);
  const topicSets = getTopicSets(params.topic_id as string);
  const currentSet = topicSets.find(s => s.id === setId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>(
    Object.fromEntries(questions.map((q, i) => [q.id, i === 0 ? 'not-answered' : 'not-visited']))
  );
  const [timeLeft, setTimeLimit] = useState((currentSet?.timeLimit || 10) * 60);
  const [isFinished, setIsFinished] = useState(false);

  // Timer logic
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
  };

  const handleSaveAndNext = () => {
    const nextStatuses = { ...statuses };
    if (answers[currentQuestion.id] !== undefined) {
      nextStatuses[currentQuestion.id] = 'answered';
    } else {
      nextStatuses[currentQuestion.id] = 'not-answered';
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      if (nextStatuses[questions[nextIndex].id] === 'not-visited') {
        nextStatuses[questions[nextIndex].id] = 'not-answered';
      }
      setStatuses(nextStatuses);
      setCurrentIndex(nextIndex);
    } else {
      setStatuses(nextStatuses);
    }
  };

  const handleMarkForReview = () => {
    const nextStatuses = { ...statuses };
    if (answers[currentQuestion.id] !== undefined) {
      nextStatuses[currentQuestion.id] = 'answered-and-review';
    } else {
      nextStatuses[currentQuestion.id] = 'marked-for-review';
    }
    
    setStatuses(nextStatuses);
    if (currentIndex + 1 < questions.length) {
      const nextId = questions[currentIndex + 1].id;
      if (nextStatuses[nextId] === 'not-visited') {
        nextStatuses[nextId] = 'not-answered';
      }
      setStatuses(nextStatuses);
      setCurrentIndex(currentIndex + 1);
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
      case 'answered': return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200';
      case 'not-answered': return 'bg-rose-500 text-white border-rose-600 shadow-rose-200';
      case 'marked-for-review': return 'bg-purple-600 text-white border-purple-700 shadow-purple-200';
      case 'answered-and-review': return 'bg-purple-600 text-white border-purple-700 relative after:content-[""] after:absolute after:-bottom-1 after:-right-1 after:w-3 after:h-3 after:bg-emerald-400 after:rounded-full after:border-2 after:border-white shadow-purple-200';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  if (isFinished) {
    const score = questions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);
    const attempted = Object.keys(answers).length;
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden rounded-3xl bg-white">
          <div className="h-2 bg-primary w-full" />
          <CardContent className="p-8 md:p-12 text-center space-y-10">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 size={48} className="animate-in zoom-in duration-500" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Test Concluded Successfully</h1>
              <p className="text-slate-500 font-medium">Results for: <span className="text-slate-900 font-bold">{currentSet?.title}</span></p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                <p className="text-3xl font-black text-primary mb-1">{score}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Score</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                <p className="text-3xl font-black text-primary mb-1">{attempted}/{questions.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attempted</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                <p className="text-3xl font-black text-primary mb-1">{Math.round((score / questions.length) * 100)}%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accuracy</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                className="flex-1 h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-transform active:scale-95" 
                onClick={() => router.push(`/practice/${params.subject_id}/${params.topic_id}`)}
              >
                Return to Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-2xl font-bold text-lg border-2 border-slate-200 transition-transform active:scale-95" 
                onClick={() => window.location.reload()}
              >
                Restart Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-body selection:bg-primary/10">
      {/* Top Conduction Bar */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-sm leading-none">Logical Book Pro</span>
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mt-1">Secure Conduction Mode</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden md:block" />
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="rounded-md border-slate-200 bg-slate-50 text-slate-600 font-bold px-3 py-1">
              {currentSet?.title}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className={cn(
            "flex items-center gap-3 font-black font-mono px-5 py-2 rounded-xl border transition-colors",
            timeLeft < 60 
              ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse" 
              : "bg-slate-900 text-white border-slate-800"
          )}>
            <Timer className={cn("h-4 w-4", timeLeft < 60 && "animate-spin-slow")} />
            <span className="text-lg tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="font-bold h-10 px-6 rounded-xl shadow-lg shadow-rose-900/20 active:scale-95 transition-transform" 
            onClick={submitExam}
          >
            Submit Final
          </Button>
        </div>
      </header>

      {/* Main Conduction Layout */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* Left Area: The Question Interface */}
        <div className="flex-grow flex flex-col min-w-0 bg-white md:m-4 md:mr-2 md:rounded-3xl md:border md:shadow-sm">
          <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between md:rounded-t-3xl">
            <div className="flex items-center gap-3">
              <span className="font-black text-white px-4 py-1.5 bg-primary rounded-xl text-sm shadow-md shadow-primary/20">
                Q {currentIndex + 1}
              </span>
              <div className="h-4 w-px bg-slate-300" />
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Type</span>
                  <span className="text-[10px] font-bold text-slate-600">Single Choice MCQ</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Marking</span>
                  <span className="text-[10px] font-bold text-emerald-600">+1.0 / -0.25</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-500 rounded-xl">
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-grow">
            <div className="max-w-4xl mx-auto p-8 md:p-16 space-y-12">
              <div className="text-xl md:text-2xl font-medium leading-relaxed text-slate-800">
                {currentQuestion.mdx ? (
                  <MarkdownRenderer content={currentQuestion.q} />
                ) : (
                  <p>{currentQuestion.q}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={cn(
                      "group flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                      answers[currentQuestion.id] === idx 
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/10" 
                        : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 shrink-0 rounded-xl border-2 flex items-center justify-center font-black text-sm transition-all",
                      answers[currentQuestion.id] === idx 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" 
                        : "bg-slate-50 border-slate-200 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="text-lg font-bold text-slate-700 flex-grow">
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

          {/* Persistent Action Footer */}
          <footer className="p-4 border-t bg-white flex items-center justify-between px-6 sticky bottom-0 md:rounded-b-3xl">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="rounded-xl font-bold h-11 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 gap-2" 
                onClick={handleMarkForReview}
              >
                <Flag className="h-4 w-4" />
                <span className="hidden sm:inline">Mark & Next</span>
              </Button>
              <Button 
                variant="ghost" 
                className="rounded-xl font-bold h-11 text-slate-400 hover:text-rose-500 hover:bg-rose-50" 
                onClick={clearResponse}
              >
                <RotateCcw className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Clear Response</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl font-bold h-11 w-11 sm:w-auto sm:px-6 border-slate-200 disabled:opacity-30" 
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                <ChevronLeft className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Button 
                className="rounded-xl font-bold h-11 px-10 shadow-xl shadow-primary/20 gap-2 transition-all active:scale-95" 
                onClick={handleSaveAndNext}
              >
                <span>{currentIndex === questions.length - 1 ? 'Save Only' : 'Save & Next'}</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </footer>
        </div>

        {/* Right Sidebar: Status & Candidate Profile */}
        <aside className="w-full md:w-80 flex flex-col h-full shrink-0 md:py-4 md:pr-4">
          <div className="bg-white h-full border rounded-3xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary ring-4 ring-primary/5">
                  <User size={28} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 leading-tight">Candidate 402</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Verified Session</span>
                </div>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col min-h-0">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <HelpCircle className="h-3 w-3 text-primary" />
                Question Palette
              </h3>

              <ScrollArea className="flex-grow">
                <div className="grid grid-cols-5 gap-3 pr-2">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        "h-10 w-10 rounded-xl border-2 font-black text-xs flex items-center justify-center transition-all duration-200",
                        idx === currentIndex && "ring-4 ring-primary/20 border-primary scale-110 z-10",
                        getStatusStyles(statuses[q.id] || 'not-visited')
                      )}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legend Status</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-md bg-emerald-500 shadow-sm shadow-emerald-200" />
                    <span className="text-[10px] font-bold text-slate-600">Answered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-md bg-rose-500 shadow-sm shadow-rose-200" />
                    <span className="text-[10px] font-bold text-slate-600">Unanswered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-md bg-purple-600 shadow-sm shadow-purple-200" />
                    <span className="text-[10px] font-bold text-slate-600">Review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-md bg-slate-100 border border-slate-200" />
                    <span className="text-[10px] font-bold text-slate-600">Not Visited</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50/50">
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-2xl border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-bold gap-2 group"
                onClick={() => router.back()}
              >
                <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Exit Examination
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
