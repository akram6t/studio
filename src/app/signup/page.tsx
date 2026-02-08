"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/exams');
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-2xl border-none shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-primary p-8 text-primary-foreground flex flex-col justify-between">
          <div>
            <div className="bg-white/20 p-2 rounded-lg inline-block mb-6">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-headline font-bold mb-4">Start your journey today.</h2>
            <p className="text-primary-foreground/70 mb-8">Join over 1 million students preparation for their dream career.</p>
            
            <ul className="space-y-4">
              {[
                "Unlimited mock tests",
                "Personalized study plan",
                "Doubt clearing sessions",
                "Expert curated content"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-accent rounded-full p-1 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs text-primary-foreground/50 italic">&quot;This platform changed the way I prepare for competitive exams!&quot; - Rahul S.</p>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 bg-card">
          <CardHeader className="pt-8">
            <CardTitle className="text-2xl font-headline font-bold">Create Account</CardTitle>
            <CardDescription>Join Logical Book and start practicing.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a strong password" required />
              </div>
              <Button type="submit" className="w-full h-11 font-bold mt-4 shadow-md bg-accent hover:bg-accent/90">
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="p-6 border-t text-center">
            <p className="text-sm text-muted-foreground mx-auto">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
