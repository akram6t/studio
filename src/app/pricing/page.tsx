"use client";

import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, ArrowRight, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Aspirant (Free)",
    price: "₹0",
    description: "Perfect for exploring our study materials and basic tests.",
    features: [
      "Access to 50+ Free Practice Sets",
      "Daily Current Affairs Quizzes",
      "Limited PDF Resources",
      "Basic Performance Analytics",
      "Ad-supported Experience"
    ],
    buttonText: "Get Started",
    variant: "outline",
    isPopular: false
  },
  {
    name: "Prep Pro",
    price: "₹499",
    period: "/year",
    description: "The complete toolkit for serious exam preparation.",
    features: [
      "Unlimited Mock Tests",
      "Full Sectional Practice Sets",
      "Previous Year Solved Papers",
      "Detailed Performance Reports",
      "No Advertisements",
      "Priority Doubt Support"
    ],
    buttonText: "Unlock Pro",
    variant: "default",
    isPopular: true
  },
  {
    name: "Elite Member",
    price: "₹999",
    period: "/year",
    description: "The ultimate preparation experience with exclusive benefits.",
    features: [
      "Everything in Prep Pro",
      "Exclusive Expert Strategy Blogs",
      "Personalized Mentorship Sessions",
      "Early Access to New Mocks",
      "Printable Formula Sheets",
      "Dedicated WhatsApp Support"
    ],
    buttonText: "Join Elite",
    variant: "accent",
    isPopular: false
  }
];

const FAQS = [
  {
    question: "How long is the premium validity?",
    answer: "All our paid plans (Pro and Elite) come with a 365-day validity from the date of purchase. You can renew your plan at a discounted rate before it expires."
  },
  {
    question: "Can I access tests on multiple devices?",
    answer: "Yes! You can log in to your account on any device (Web, Mobile App, or Tablet). Your progress and analytics are automatically synced across all platforms."
  },
  {
    question: "Is there a refund policy?",
    answer: "We offer a 24-hour 'no questions asked' refund policy if you haven't attempted more than 2 premium mock tests. Please contact support@examprep.com for assistance."
  },
  {
    question: "Are offline downloads supported?",
    answer: "PDF resources and study materials can be downloaded for offline viewing. Mock tests require an active internet connection to ensure real-time analytics and rank calculation."
  }
];

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10">
          <Badge variant="outline" className="px-4 py-1.5 border-amber-600/20 bg-amber-50 text-amber-600 font-bold uppercase tracking-widest text-[10px] mb-6">
            <Star className="h-3 w-3 mr-2 fill-current" />
            Invest in your future
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6">Simple, Transparent <span className="text-primary">Pricing</span></h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Unlock premium mock tests, expert guidance, and smart analytics to accelerate your journey to success.
          </p>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent rounded-full blur-[150px]" />
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <Card 
              key={plan.name} 
              className={cn(
                "relative flex flex-col border-none shadow-xl transition-all duration-500 hover:-translate-y-2",
                plan.isPopular ? "ring-2 ring-primary scale-105 z-20" : "bg-card"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                  {plan.variant === 'accent' ? (
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                      <Crown className="h-6 w-6" />
                    </div>
                  ) : plan.variant === 'default' ? (
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                      <Zap className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="p-3 bg-muted text-muted-foreground rounded-2xl">
                      <Star className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="mt-2 text-sm">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-0 flex-grow">
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground font-semibold">{plan.period}</span>}
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">What's included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <div className={cn(
                          "mt-0.5 p-0.5 rounded-full",
                          plan.isPopular ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-muted-foreground font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="p-8 pt-0 mt-auto">
                <Link href={plan.name.includes('Free') ? '/signup' : '/login'} className="w-full">
                  <Button 
                    className={cn(
                      "w-full h-12 rounded-xl font-bold text-base shadow-lg",
                      plan.variant === 'accent' ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200" :
                      plan.variant === 'default' ? "bg-primary text-primary-foreground shadow-primary/20" :
                      "bg-white border-2 border-primary/20 text-primary hover:bg-primary/5"
                    )}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted/30 py-20 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">1M+</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Active Aspirants</p>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Exams Covered</p>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">4.8/5</h3>
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">App Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-headline font-bold mb-4">Common Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our plans and features.</p>
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
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-primary text-primary-foreground rounded-[40px] overflow-hidden border-none shadow-2xl relative">
          <div className="p-12 md:p-20 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Ready to transform your preparation?</h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of successful candidates who used our platform to crack their dream competitive exams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-10 rounded-2xl font-bold text-lg">
                  Sign Up for Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white h-14 px-10 rounded-2xl font-bold text-lg">
                  Compare Plans <ArrowRight className="ml-2 h-5 w-5" />
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
