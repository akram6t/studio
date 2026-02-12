"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, ArrowRight, HelpCircle, BookOpen, ClipboardCheck, History, Layout, Trophy } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PREMIUM_FEATURES = [
  {
    title: "10,000+ Mock Tests",
    description: "Full-length official pattern mock tests for all major exams.",
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
  },
  {
    title: "Sectional Practice Sets",
    description: "Topic-wise focused practice to master every subject area.",
    icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
  },
  {
    title: "Previous Year Papers",
    description: "10+ years of solved official papers with detailed explanations.",
    icon: <History className="h-5 w-5 text-emerald-500" />,
  },
  {
    title: "Study Content (PDF/PPT)",
    description: "Curated strategy guides, formula sheets, and expert notes.",
    icon: <BookOpen className="h-5 w-5 text-purple-500" />,
  },
  {
    title: "Daily Practice Quizzes",
    description: "Short boosters for current affairs and mental ability.",
    icon: <Layout className="h-5 w-5 text-orange-500" />,
  },
];

const PLANS = [
  {
    id: "monthly",
    name: "Monthly Pass",
    duration: "30 Days",
    price: "199",
    savings: "",
    icon: <Zap className="h-4 w-4" />
  },
  {
    id: "quarterly",
    name: "Quarterly Pass",
    duration: "90 Days",
    price: "399",
    savings: "Save 33%",
    isPopular: true,
    icon: <Star className="h-4 w-4" />
  },
  {
    id: "semi-yearly",
    name: "Semi-Yearly Pass",
    duration: "180 Days",
    price: "599",
    savings: "Best Balance",
    icon: <Trophy className="h-4 w-4" />
  },
  {
    id: "yearly",
    name: "Yearly Pass",
    duration: "365 Days",
    price: "999",
    savings: "Save 50%",
    icon: <Crown className="h-4 w-4" />
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
  const [selectedPlanId, setSelectedPlanId] = useState<string>("quarterly");

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId);

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
          
          {/* Left Side: Features List */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-4">Elite Benefits</h2>
              <p className="text-muted-foreground">Everything you need to crack your exam is included in every premium pass. All features are <span className="font-bold text-foreground">unlocked</span> across all plans.</p>
            </div>

            <ul className="space-y-8">
              {PREMIUM_FEATURES.map((feature, i) => (
                <li key={i} className="flex gap-5 group">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Full access to all current and future exams listed on the platform.
              </p>
            </div>
          </div>

          {/* Right Side: Radio Selection Plans */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-xl bg-card overflow-hidden">
              <div className="bg-primary p-6 text-primary-foreground">
                <h2 className="text-2xl font-headline font-bold">Pick Your Pass</h2>
                <p className="text-sm opacity-80">Select duration based on your exam date.</p>
              </div>
              
              <CardContent className="p-6 pt-8 space-y-8">
                <RadioGroup 
                  value={selectedPlanId} 
                  onValueChange={setSelectedPlanId}
                  className="space-y-3"
                >
                  {PLANS.map((plan) => (
                    <div 
                      key={plan.id}
                      className={cn(
                        "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer",
                        selectedPlanId === plan.id 
                          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                          : "border-border hover:border-muted-foreground/30"
                      )}
                      onClick={() => setSelectedPlanId(plan.id)}
                    >
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={plan.id} id={plan.id} className="h-5 w-5" />
                        <div className="space-y-0.5">
                          <Label htmlFor={plan.id} className="font-bold text-base cursor-pointer flex items-center gap-2">
                            {plan.name}
                            {plan.savings && (
                              <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black py-0 h-4 px-1.5 uppercase">
                                {plan.savings}
                              </Badge>
                            )}
                          </Label>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                            {plan.icon}
                            {plan.duration} Validity
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-0.5">
                          <span className="text-xs font-bold text-primary">₹</span>
                          <span className="text-2xl font-black tracking-tight text-primary">{plan.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Selected Plan</span>
                      <span className="font-bold">{selectedPlan?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount to pay</span>
                      <span className="font-bold text-primary">₹{selectedPlan?.price}</span>
                    </div>
                  </div>

                  <Link href="/login" className="block">
                    <Button 
                      className="w-full h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 gap-3 group"
                    >
                      Buy This Pass <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <p className="text-[10px] text-center text-muted-foreground italic px-4">
                    Secure 256-bit encrypted payment • One-time activation • No hidden charges
                  </p>
                </div>
              </CardContent>
            </Card>
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
