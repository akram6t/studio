"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, ArrowRight, HelpCircle, BookOpen, ClipboardCheck, History, Layout, Trophy } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PREMIUM_FEATURES = [
  {
    title: "10,000+ Mock Tests",
    description: "Full-length official pattern mock tests for all major exams.",
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
  },
  {
    title: "Sectional Practice Sets",
    description: "Topic-wise focused practice to master every subject area.",
    icon: <ClipboardCheck className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Previous Year Papers",
    description: "10+ years of solved official papers with detailed explanations.",
    icon: <History className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: "Study Content (PDF/PPT)",
    description: "Curated strategy guides, formula sheets, and expert notes.",
    icon: <BookOpen className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "Daily Practice Quizzes",
    description: "Short boosters for current affairs and mental ability.",
    icon: <Layout className="h-6 w-6 text-orange-500" />,
  },
];

const PLANS = [
  {
    name: "Monthly Pass",
    duration: "30 Days",
    price: "199",
    savings: "",
    isPopular: false,
    icon: <Zap className="h-5 w-5" />
  },
  {
    name: "Quarterly Pass",
    duration: "90 Days",
    price: "399",
    savings: "Save 33%",
    isPopular: true,
    icon: <Star className="h-5 w-5" />
  },
  {
    name: "Semi-Yearly Pass",
    duration: "180 Days",
    price: "599",
    savings: "Best Balance",
    isPopular: false,
    icon: <Trophy className="h-5 w-5" />
  },
  {
    name: "Yearly Pass",
    duration: "365 Days",
    price: "999",
    savings: "Save 50%",
    isPopular: false,
    icon: <Crown className="h-5 w-5" />
  }
];

const FAQS = [
  {
    question: "How instantly is my pass activated?",
    answer: "Your pass is activated immediately upon successful payment. You will get instant access to all premium tests and materials across the platform."
  },
  {
    question: "Is there a limit on how many tests I can take?",
    answer: "No! Once you have a pass, you can attempt any number of mock tests, sectional tests, or quizzes as many times as you like during your validity period."
  },
  {
    question: "Can I use the same pass for different exams?",
    answer: "Yes! A single pass unlocks premium content for all exams listed on our platform, including SSC, Engineering, UPSC, and more."
  },
  {
    question: "Will my plan auto-renew?",
    answer: "No, we do not auto-charge. We will send you a reminder before your pass expires, and you can choose to renew it manually."
  }
];

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10">
          <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary font-bold uppercase tracking-widest text-[10px] mb-6">
            <Crown className="h-3 w-3 mr-2 fill-current" />
            Premium Preparation Access
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6">Unlock Your <span className="text-primary">Success</span></h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Choose a preparation pass that fits your goal. Get unrestricted access to India's most comprehensive test series.
          </p>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent rounded-full blur-[150px]" />
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Features */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-4">Elite Benefits</h2>
              <p className="text-muted-foreground">Everything you need to crack your exam is included in every premium pass.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {PREMIUM_FEATURES.map((feature, i) => (
                <div key={i} className="flex gap-5 p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                All features listed above are <span className="font-bold">UNLOCKED</span> for any duration pass you choose.
              </p>
            </div>
          </div>

          {/* Right Side: Vertical Plans */}
          <div className="lg:col-span-5 space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-headline font-bold">Pick a Plan</h2>
              <p className="text-sm text-muted-foreground">Select duration based on your exam date.</p>
            </div>

            <div className="space-y-4">
              {PLANS.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={cn(
                    "relative overflow-hidden cursor-pointer transition-all duration-300 border-2",
                    plan.isPopular 
                      ? "border-primary shadow-lg ring-4 ring-primary/5" 
                      : "border-border hover:border-primary/50 bg-card"
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                        Recommended
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center",
                          plan.isPopular ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          {plan.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-none">{plan.name}</h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{plan.duration}</span>
                            {plan.savings && (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-bold py-0 h-4">
                                {plan.savings}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-0.5">
                          <span className="text-xs font-bold">₹</span>
                          <span className="text-2xl font-bold tracking-tight">{plan.price}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 uppercase">One-time payment</p>
                      </div>
                    </div>
                    
                    <Link href="/login" className="block mt-6">
                      <Button 
                        className={cn(
                          "w-full h-11 rounded-xl font-bold shadow-md gap-2",
                          plan.isPopular ? "bg-primary text-primary-foreground" : "variant-outline"
                        )}
                        variant={plan.isPopular ? "default" : "outline"}
                      >
                        Buy This Pass <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-[11px] text-center text-muted-foreground italic px-4 mt-4">
              All plans include 24/7 priority support and real-time performance analytics. Prices are inclusive of all taxes.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & FAQ Section */}
      <section className="bg-muted/30 py-20 border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Clear your doubts about our premium preparation passes.</p>
            </div>

            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="px-8 border-b last:border-0 hover:bg-muted/5 transition-colors">
                      <AccordionTrigger className="text-base font-bold py-6 hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                          {faq.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-primary text-primary-foreground rounded-[40px] overflow-hidden border-none shadow-2xl relative">
          <div className="p-12 md:p-20 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Ready to crack your dream exam?</h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
              Join 1M+ aspirants who trust our platform for their daily preparation and official pattern mock tests.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-10 rounded-2xl font-bold text-lg">
                  Join for Free
                </Button>
              </Link>
              <Link href="/exams">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white h-14 px-10 rounded-2xl font-bold text-lg">
                  Explore Exams <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Background circles */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent opacity-20 rounded-full blur-[100px]" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent opacity-20 rounded-full blur-[100px]" />
        </Card>
      </section>
    </div>
  );
}
