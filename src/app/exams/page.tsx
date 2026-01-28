
import { EXAMS, CATEGORIES } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { TrendingUp, LayoutGrid, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ExamsPage() {
  const trendingExams = EXAMS.filter(e => e.trending);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-headline font-bold mb-4">Explore Exams</h1>
        <p className="text-muted-foreground text-lg">Start your preparation for the most popular competitive exams.</p>
      </div>

      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-headline font-bold">Trending Exams</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingExams.map(exam => (
            <Link key={exam.id} href={`/${exam.slug}`}>
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-none shadow-md">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image 
                    src={exam.image} 
                    alt={exam.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    data-ai-hint="exam preparation"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-accent text-white border-none">Trending</Badge>
                </div>
                <CardContent className="p-5">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider mb-2 block">{exam.category}</span>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{exam.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-2">{exam.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-headline font-bold">Categories</h2>
        </div>
        <div className="space-y-12">
          {CATEGORIES.map(category => (
            <div key={category}>
              <h3 className="text-xl font-bold mb-6 border-l-4 border-accent pl-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EXAMS.filter(e => e.category === category).map(exam => (
                  <Link key={exam.id} href={`/${exam.slug}`}>
                    <div className="flex items-center p-4 bg-card rounded-xl shadow-sm hover:shadow-md border border-border/50 group transition-all">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <ChevronRight className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold">{exam.title}</h4>
                        <p className="text-sm text-muted-foreground">View details & tests</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
