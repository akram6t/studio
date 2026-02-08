"use client";

import { useEffect, useState, useCallback } from 'react';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom components for MDX using ShadCN-style elements
const MDXComponents = {
  h1: (props: any) => <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-foreground font-headline" {...props} />,
  h2: (props: any) => <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-foreground font-headline" {...props} />,
  h3: (props: any) => <h3 className="text-lg md:text-xl font-semibold mt-5 mb-2 text-foreground font-headline" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed text-foreground/90" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-foreground" {...props} />,
  li: (props: any) => <li className="text-foreground" {...props} />,
  blockquote: (props: any) => (
    <blockquote 
      className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground bg-primary/5 py-4 rounded-r-2xl"
      {...props} 
    />
  ),
  code: (props: any) => (
    <code 
      className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground font-medium" 
      {...props} 
    />
  ),
  pre: (props: any) => (
    <pre 
      className="bg-muted p-4 rounded-xl overflow-x-auto mb-6 font-mono text-sm border shadow-inner" 
      {...props} 
    />
  ),
  a: (props: any) => (
    <a 
      className="text-primary hover:underline underline-offset-2 font-semibold" 
      target="_blank" 
      rel="noopener noreferrer" 
      {...props} 
    />
  ),
  strong: (props: any) => <strong className="font-bold text-foreground" {...props} />,
  em: (props: any) => <em className="italic" {...props} />,
  hr: (props: any) => <hr className="my-8 border-border" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto mb-6 rounded-2xl border border-border shadow-sm">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: any) => (
    <thead className="bg-muted/50" {...props} />
  ),
  tr: (props: any) => (
    <tr className="border-b border-border last:border-b-0 hover:bg-muted/5 transition-colors" {...props} />
  ),
  th: (props: any) => (
    <th className="border-r border-border last:border-r-0 px-4 py-3 font-bold text-left text-foreground uppercase tracking-wider text-[10px]" {...props} />
  ),
  td: (props: any) => (
    <td className="border-r border-border last:border-r-0 px-4 py-3 text-foreground font-medium" {...props} />
  ),
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serializeContent = useCallback(async (mdxContent: string) => {
    if (!mdxContent || !mdxContent.trim()) {
      setMdxSource(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const source = await serialize(mdxContent, {
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex],
          format: 'mdx',
        },
        parseFrontmatter: false,
      });
      setMdxSource(source);
    } catch (err) {
      console.error('MDX serialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse MDX content');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    serializeContent(content);
  }, [content, serializeContent]);

  if (isLoading) {
    return (
      <div className={cn("py-12 flex flex-col items-center justify-center min-h-[200px]", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Preparing Content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={cn("p-6 border-destructive/20 bg-destructive/5", className)}>
        <div className="text-destructive">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Renderer Error</h3>
          <p className="text-xs font-medium opacity-80">{error}</p>
        </div>
      </Card>
    );
  }

  if (!mdxSource) {
    return <div className={cn("text-muted-foreground italic", className)}>{content}</div>;
  }

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <MDXRemote {...mdxSource} components={MDXComponents} />
    </div>
  );
}
