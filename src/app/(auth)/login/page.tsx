import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <SignIn 
      routing="hash"
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm font-bold h-11",
          card: "shadow-2xl border-none rounded-2xl",
          headerTitle: "font-headline font-bold text-2xl",
          headerSubtitle: "text-muted-foreground",
          footerActionLink: "text-primary hover:underline font-bold"
        }
      }}
    />
  );
}
