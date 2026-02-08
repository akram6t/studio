"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuestions, getTopicSets, Question } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  X
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
    if (isFinished || timeLeft <= 0) return;
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
    setIsFinished(true);
  };

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'answered': return 'bg-emerald-500 text-white border-emerald-500';
      case 'not-answered': return 'bg-rose-500 text-white border-rose-500';
      case 'marked-for-review': return 'bg-purple-600 text-white border-purple-600';
      case 'answered-and-review': return 'bg-purple-600 text-white border-purple-600 relative after:content-[""] after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2 after:bg-emerald-400 after:rounded-full after:border after:border-white';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  if (isFinished) {
    const score = questions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <Card className="border-none shadow-2xl overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardContent className="p-12 space-y-8">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-headline font-bold">Exam Submitted!</h1>
              <p className="text-muted-foreground">You have successfully completed {currentSet?.title}.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-muted/30 rounded-2xl">
                <p className="text-3xl font-black text-primary">{score}/{questions.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Final Score</p>
              </div>
              <div className="p-6 bg-muted/30 rounded-2xl">
                <p className="text-3xl font-black text-primary">{Math.round((score / questions.length) * 100)}%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Accuracy</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button className="w-full h-12 rounded-xl font-bold" onClick={() => router.push(`/practice/${params.subject_id}/${params.topic_id}`)}>
                Back to Practice Sets
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold" onClick={() => window.location.reload()}>
                Retry Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Badge className="bg-primary text-primary-foreground font-bold rounded-lg px-3 py-1">
            Logical Book Pro
          </Badge>
          <div className="hidden md:block">
            <h1 className="font-bold text-sm">{currentSet?.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-rose-600 font-black font-mono bg-rose-50 px-4 py-1.5 rounded-xl border border-rose-100">
            <Timer className="h-4 w-4" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
          <Button variant="destructive" size="sm" className="font-bold shadow-lg shadow-rose-900/20" onClick={submitExam}>
            Submit Exam
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Question Content */}
        <div className="flex-grow flex flex-col h-[calc(100vh-4rem)]">
          <div className="p-6 border-b bg-muted/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary px-3 py-1 bg-primary/10 rounded-lg">Question {currentIndex + 1}</span>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-muted-foreground/20">
                Multiple Choice
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600">+1.00 Mark</span>
              <span className="text-[10px] font-bold text-rose-600">-0.25 Mark</span>
            </div>
          </div>

          <ScrollArea className="flex-grow p-8 md:p-12">
            <div className="max-w-3xl mx-auto space-y-10 pb-20">
              <div className="text-lg md:text-xl font-medium leading-relaxed">
                {currentQuestion.mdx ? (
                  <MarkdownRenderer content={currentQuestion.q} />
                ) : (
                  <p>{currentQuestion.q}</p>
                )}
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={cn(
                      "group flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                      answers[currentQuestion.id] === idx 
                        ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                        : "border-muted-foreground/10 hover:border-primary/30 bg-card hover:bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all",
                      answers[currentQuestion.id] === idx ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground/30 text-muted-foreground group-hover:border-primary group-hover:text-primary"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="text-base font-semibold flex-grow">
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

          {/* Question Footer */}
          <footer className="p-4 border-t bg-card flex items-center justify-between px-6 sticky bottom-0">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl font-bold gap-2" onClick={handleMarkForReview}>
                <Flag className="h-4 w-4" />
                Mark for Review
              </Button>
              <Button variant="ghost" className="rounded-xl font-bold text-muted-foreground" onClick={clearResponse}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Response
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="rounded-xl font-bold" 
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button className="rounded-xl font-bold gap-2 px-8 shadow-lg shadow-primary/20" onClick={handleSaveAndNext}>
                Save & Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </footer>
        </div>

        {/* Right Side: Question Palette */}
        <aside className="w-full md:w-80 border-l bg-card flex flex-col h-full md:h-[calc(100vh-4rem)] shrink-0">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              Question Palette
            </h3>
          </div>

          <ScrollArea className="flex-grow p-6">
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "h-10 w-10 rounded-lg border-2 font-bold text-xs flex items-center justify-center transition-all",
                    idx === currentIndex && "ring-2 ring-primary ring-offset-2 scale-110 z-10 shadow-lg",
                    getStatusColor(statuses[q.id] || 'not-visited')
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quick Legend</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <div className="h-4 w-4 rounded bg-emerald-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <div className="h-4 w-4 rounded bg-rose-500" />
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <div className="h-4 w-4 rounded bg-purple-600" />
                  <span>Marked</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <div className="h-4 w-4 rounded bg-muted" />
                  <span>Not Visited</span>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t bg-muted/10">
            <Card className="border-none shadow-sm bg-white dark:bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    A
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">Aspirant User</p>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-1">Free Practice Plan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
