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

  // In a real app, we'd fetch the specific test metadata by ID.
  // For the prototype, we use the existing MCQ array.
  const questions = useMemo(() => getQuestions(testId), [testId]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>(
    Object.fromEntries(questions.map((q, i) => [q.id, i === 0 ? 'not-answered' : 'not-visited']))
  );
  const [timeLeft, setTimeLimit] = useState(15 * 60); // Default 15 mins for practice
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
    // Instant Palette Update: mark as answered as soon as option is clicked
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
      case 'answered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'not-answered': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'marked-for-review': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'answered-and-review': return 'bg-purple-100 text-purple-700 border-purple-200 relative after:content-[""] after:absolute after:-bottom-1 after:-right-1 after:w-2.5 after:h-2.5 after:bg-emerald-500 after:rounded-full after:border-2 after:border-white';
      default: return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  if (isFinished) {
    const score = questions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);
    const attempted = Object.keys(answers).length;
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-none shadow-2xl rounded-3xl bg-white">
          <div className="h-2 bg-primary w-full" />
          <CardContent className="p-8 md:p-12 text-center space-y-10">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 size={40} className="animate-in zoom-in duration-500" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-headline font-bold text-slate-900">Result Generated</h1>
              <p className="text-slate-500 font-medium">Session ID: <span className="text-slate-900 font-bold font-mono">{testId}</span></p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-2xl font-black text-primary">{score}</p>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Score</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-2xl font-black text-primary">{attempted}/{questions.length}</p>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Attempted</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-2xl font-black text-primary">{Math.round((score / questions.length) * 100)}%</p>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Accuracy</p>
              </div>
            </div>

            <Button 
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg" 
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-body">
      {/* Universal Conduction Header */}
      <header className="h-14 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-white p-1 rounded-lg">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-xs">Logical Book Conduction</span>
            <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Standard Exam Mode</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={cn(
            "flex items-center gap-2 font-black font-mono px-4 py-1.5 rounded-lg border transition-all",
            timeLeft < 60 ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse" : "bg-slate-900 text-white border-slate-800"
          )}>
            <Timer className="h-3.5 w-3.5" />
            <span className="text-sm tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="font-bold h-9 px-5 rounded-lg shadow-md" 
            onClick={submitExam}
          >
            Submit Exam
          </Button>
        </div>
      </header>

      {/* Main Interface */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden h-[calc(100vh-3.5rem)]">
        
        {/* Left: Question Area */}
        <div className="flex-grow flex flex-col min-w-0 bg-white md:m-3 md:rounded-2xl border shadow-sm">
          {/* Compressed Question Number Bar */}
          <div className="px-6 py-2 border-b bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-black text-primary text-xs uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
              <div className="h-3 w-px bg-slate-300" />
              <div className="flex gap-3 text-[10px] font-bold text-slate-500">
                <span className="text-emerald-600">+1.0 Correct</span>
                <span className="text-rose-500">-0.25 Wrong</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-500">
              <Flag className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Expanded Question Canvas */}
          <ScrollArea className="flex-grow">
            <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-10">
              <div className="text-lg md:text-xl font-medium leading-relaxed text-slate-800 min-h-[80px]">
                {currentQuestion.mdx ? (
                  <MarkdownRenderer content={currentQuestion.q} />
                ) : (
                  <p>{currentQuestion.q}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={cn(
                      "group flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-150",
                      answers[currentQuestion.id] === idx 
                        ? "border-primary bg-primary/5 ring-1 ring-primary/10" 
                        : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "h-8 w-8 shrink-0 rounded-lg border-2 flex items-center justify-center font-black text-xs transition-all",
                      answers[currentQuestion.id] === idx 
                        ? "bg-primary text-white border-primary shadow-md" 
                        : "bg-slate-50 border-slate-200 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="text-base md:text-lg font-semibold text-slate-700 flex-grow">
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

          {/* Actions Footer */}
          <footer className="p-3 border-t bg-white flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="rounded-lg font-bold h-10 px-4 border-slate-200 text-slate-600 text-xs gap-2" 
                onClick={handleMarkForReview}
              >
                <Flag className="h-3 w-3" />
                <span className="hidden sm:inline">Review & Next</span>
              </Button>
              <Button 
                variant="ghost" 
                className="rounded-lg font-bold h-10 text-slate-400 hover:text-rose-500 text-xs" 
                onClick={clearResponse}
              >
                <RotateCcw className="h-3 w-3 sm:mr-2" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="rounded-lg font-bold h-10 px-4 border-slate-200 disabled:opacity-30 text-xs" 
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Prev</span>
              </Button>
              <Button 
                className="rounded-lg font-bold h-10 px-8 shadow-lg gap-2 text-xs" 
                onClick={handleSaveAndNext}
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish Section' : 'Save & Next'}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </footer>
        </div>

        {/* Right: Palette & Legend */}
        <aside className="w-full md:w-72 flex flex-col h-full shrink-0 md:py-3 md:pr-3">
          <div className="bg-white h-full border md:rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-slate-900 leading-tight">Student #402</span>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Authenticated</span>
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col min-h-0">
              <h3 className="font-black text-[9px] uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <HelpCircle className="h-3 w-3 text-primary" />
                Question Palette
              </h3>

              <ScrollArea className="flex-grow">
                <div className="grid grid-cols-5 gap-2 pr-2">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        "h-9 w-9 rounded-lg border-2 font-black text-[10px] flex items-center justify-center transition-all",
                        idx === currentIndex && "ring-2 ring-primary ring-offset-1 border-primary scale-105 z-10",
                        getStatusStyles(statuses[q.id] || 'not-visited')
                      )}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Legend</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-100 border border-emerald-200" />
                    <span className="text-[9px] font-bold text-slate-600">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-rose-100 border border-rose-200" />
                    <span className="text-[9px] font-bold text-slate-600">Skipped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-purple-100 border border-purple-200" />
                    <span className="text-[9px] font-bold text-slate-600">Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-slate-50 border border-slate-200" />
                    <span className="text-[9px] font-bold text-slate-600">Not Visited</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full h-10 rounded-lg border-slate-200 text-rose-600 text-xs font-bold gap-2"
                onClick={() => router.back()}
              >
                <LogOut className="h-3.5 w-3.5" />
                Exit Conduction
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
