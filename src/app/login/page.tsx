
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-12">
      <div className="w-full max-w-md flex justify-center">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-sm normal-case font-bold',
              card: 'shadow-2xl border-none rounded-2xl',
              headerTitle: 'font-headline font-bold text-2xl',
              headerSubtitle: 'text-muted-foreground',
            }
          }}
        />
      </div>
    </div>
  );
}
