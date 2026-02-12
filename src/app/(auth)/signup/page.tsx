import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <SignUp 
      routing="hash"
      appearance={{
        elements: {
          formButtonPrimary: "bg-accent hover:bg-accent/90 text-sm font-bold h-11",
          card: "shadow-2xl border-none rounded-2xl",
          headerTitle: "font-headline font-bold text-2xl",
          headerSubtitle: "text-muted-foreground",
          footerActionLink: "text-accent hover:underline font-bold"
        }
      }}
    />
  );
}
