
import type {Metadata} from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ExamPrep - Your Path to Success',
  description: 'The ultimate destination for exam preparation. Mock tests, quizzes, and resources for all competitive exams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="py-8 border-t bg-card mt-12">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} ExamPrep. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
