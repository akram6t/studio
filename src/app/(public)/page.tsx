import { getExams, getBooks } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  Trophy, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  Zap,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default async function Home() {
  const [exams, books] = await Promise.all([getExams(), getBooks()]);

  const trendingExams = exams.filter(e => e.trending).slice(0, 4);
  const featuredBooks = books.slice(0, 4);

  const practiceSubjects = [
    { id: 'quant', title: 'Quantitative Aptitude', icon: <TrendingUp className="h-6 w-6" />, color: 'bg-blue-500', count: '1200+' },
    { id: 'english', title: 'English Language', icon: <BookOpen className="h-6 w-6" />, color: 'bg-emerald-500', count: '1500+' },
    { id: 'reasoning', title: 'Reasoning Ability', icon: <Target className="h-6 w-6" />, color: 'bg-purple-500', count: '1000+' },
    { id: 'gk', title: 'General Knowledge', icon: <Layout className="h-6 w-6" />, color: 'bg-orange-500', count: '2000+' },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="px-4 py-1.5 border-accent/20 bg-accent/5 text-accent font-bold uppercase tracking-widest text-[10px]">
              <Zap className="h-3 w-3 mr-2 fill-current" />
              Trusted by 1M+ Aspirants
            </Badge>
            <h1 className="text-4xl md:text-7xl font-headline font-bold leading-tight tracking-tight">
              Master Your Exams with <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">Precision</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Get access to premium mock tests, subject-wise practice sets, and expert curated books for all competitive exams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/exams">
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 gap-2">
                  Explore Exams <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/practice">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-2xl border-2">
                  Try Free Practice
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t mt-16 max-w-3xl mx-auto">
              <div className="space-y-1">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Exams Covered</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Mock Tests</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">50k+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Practice Sets</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Popular Exams Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-2">Popular Exams</h2>
            <p className="text-muted-foreground">Start preparing for India's most trending competitive exams.</p>
          </div>
          <Link href="/exams">
            <Button variant="ghost" className="gap-2 font-bold group">
              View All Exams <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingExams.map((exam, idx) => (
            <Link key={exam.id} href={`/${exam.slug}`}>
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 h-full border-none shadow-md bg-card">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image 
                    src={exam.image} 
                    alt={exam.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    data-ai-hint="exam preparation"
                    priority={idx < 4}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-white/20 text-white border-none backdrop-blur-md text-[10px] mb-2">
                      {exam.category}
                    </Badge>
                    <h3 className="text-white text-xl font-bold leading-tight">{exam.title}</h3>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{exam.description}</p>
                  <div className="flex items-center text-xs font-bold text-primary gap-1 group-hover:gap-2 transition-all">
                    Prepare Now <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Practice Grid */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Master Every Subject</h2>
            <p className="text-muted-foreground">Detailed practice sets for every topic to ensure your conceptual clarity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceSubjects.map((subject) => (
              <Link key={subject.id} href={`/practice/${subject.id}`}>
                <Card className="border-none shadow-md hover:-translate-y-2 transition-all duration-300 h-full overflow-hidden">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className={cn(
                      "w-16 h-16 mx-auto flex items-center justify-center rounded-2xl text-white shadow-lg mb-6",
                      subject.color
                    )}>
                      {subject.icon}
                    </div>
                    <h3 className="text-xl font-bold">{subject.title}</h3>
                    <div className="space-y-1">
                      <div className="text-primary font-bold">{subject.count} Questions</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Multiple Topics</div>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full rounded-xl">Start Practice</Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-2">Featured Study Materials</h2>
            <p className="text-muted-foreground">Expert recommended books and guides to complete your library.</p>
          </div>
          <Link href="/books">
            <Button variant="ghost" className="gap-2 font-bold group">
              Explore All Books <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <Link key={book.id} href="/books">
              <Card className="group border-none shadow-md overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <Image 
                    src={book.image} 
                    alt={book.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    data-ai-hint="book cover"
                  />
                </div>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-[10px] font-bold">{book.rating}</span>
                  </div>
                  <h3 className="font-bold text-sm leading-snug line-clamp-2 h-10 group-hover:text-primary transition-colors">{book.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">By {book.author}</p>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="font-bold">₹{book.price}</span>
                    <Badge variant="outline" className="text-[9px] uppercase">{book.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4">
        <div className="bg-primary text-primary-foreground rounded-[40px] p-12 md:p-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-headline font-bold leading-tight">Everything You Need to Succeed.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Smart Analytics", desc: "Track your performance with deep insights." },
                  { title: "Expert Support", desc: "Get your doubts resolved by top educators." },
                  { title: "Mobile Ready", desc: "Practice on the go with our mobile-first design." },
                  { title: "Daily Updates", desc: "Stay updated with current affairs and news." }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <h4 className="font-bold">{item.title}</h4>
                    </div>
                    <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/signup" className="inline-block">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-black/20">
                  Join for Free
                </Button>
              </Link>
            </div>
            
            <div className="hidden lg:block relative aspect-square">
              <div className="absolute inset-0 bg-white/5 rounded-[40px] backdrop-blur-3xl border border-white/10 p-12 space-y-8">
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                  <div className="w-12 h-12 rounded-full bg-accent" />
                  <div className="space-y-1">
                    <div className="font-bold">Aspirant Success Path</div>
                    <div className="text-xs text-white/50">Tracking your 2024 Goal</div>
                  </div>
                </div>
                <div className="space-y-6">
                  {[85, 45, 92].map((p, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-70">
                        <span>{['Mock Tests', 'Concept Notes', 'Practice Sets'][i]}</span>
                        <span>{p}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${p}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-accent text-white p-4 rounded-2xl shadow-2xl rotate-6 animate-bounce">
                <Trophy className="h-8 w-8" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white text-primary p-4 rounded-2xl shadow-2xl -rotate-6">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent opacity-20 rounded-full blur-[100px]" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent opacity-20 rounded-full blur-[100px]" />
        </div>
      </section>
    </div>
  );
}

import { Star } from 'lucide-react';
