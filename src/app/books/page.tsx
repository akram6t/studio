
"use client";

import { BOOKS, BOOK_CATEGORIES, Book } from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Star, Filter, ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 8;

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBooks = useMemo(() => {
    if (!BOOKS) return [];
    return BOOKS.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['All', ...(BOOK_CATEGORIES || [])];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">Study Materials</h1>
          <p className="text-muted-foreground text-sm md:text-base">Comprehensive books and resources for your preparation.</p>
        </div>
        
        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by book or author..." 
            className="pl-10 h-12 bg-card rounded-2xl border-none shadow-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter */}
        <div className="lg:hidden">
          <Select value={selectedCategory} onValueChange={(val) => {
            setSelectedCategory(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full bg-card h-12 rounded-xl border-none shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="bg-primary/5 p-4 border-b">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Categories</span>
              </div>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-all group",
                        selectedCategory === cat 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <ChevronRight className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-accent/5 p-6">
              <div className="flex items-center gap-2 mb-3 text-accent">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-bold">Best Sellers</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Top rated materials recommended by experts.</p>
              <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white">
                View Collection
              </Button>
            </Card>
          </div>
        </aside>

        {/* Book Grid */}
        <div className="flex-grow">
          {paginatedBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No books found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "w-10 h-10 rounded-xl font-bold",
                      currentPage === page && "shadow-lg shadow-primary/20"
                    )}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded-xl"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <Card className="group flex flex-col border-none shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 bg-card">
      <div className="aspect-square relative overflow-hidden bg-muted">
        <Image 
          src={book.image} 
          alt={book.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          data-ai-hint="book cover"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Badge className="bg-white/90 text-primary border-none shadow-sm backdrop-blur-sm">
            {book.rating} <Star className="h-3 w-3 fill-current ml-1" />
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 flex-grow">
        <div className="mb-2">
          <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-muted-foreground border-muted-foreground/20">
            {book.category}
          </Badge>
        </div>
        <h3 className="font-bold text-sm md:text-base leading-tight line-clamp-2 h-12 mb-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">By {book.author}</p>
        
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
          <span>{book.pages} Pages</span>
          <span>{book.language}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t bg-muted/5 flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-col">
          <span className="text-lg font-bold">₹{book.price}</span>
        </div>
        <Button size="sm" className="rounded-lg h-9 px-4 gap-2 shadow-sm">
          <ShoppingCart className="h-3.5 w-3.5" />
          Buy
        </Button>
      </CardFooter>
    </Card>
  );
}
