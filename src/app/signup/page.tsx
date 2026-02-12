import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-2xl p-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-headline font-bold">Create Account</CardTitle>
          <CardDescription>Join 1M+ aspirants on their journey to success.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-11">Join Now</Button>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link href="/login" className="text-primary hover:underline font-bold">Log In</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}