"use client";

import { BOOKS } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  BookMarked, 
  Star, 
  ShoppingCart, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Tag
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminBooksPage() {
  const [search, setSearch] = useState("");

  const filteredBooks = useMemo(() => {
    return BOOKS.filter(book => 
      book.title.toLowerCase().includes(search.toLowerCase()) || 
      book.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Books Library</h1>
          <p className="text-muted-foreground text-sm">Manage physical and digital study materials in the shop.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add New Book
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Books", value: "420+", icon: BookMarked, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Sales", value: "₹2.4M", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Categories", value: "12", icon: Tag, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by book title or author..." 
              className="pl-10 rounded-xl bg-background border-none shadow-sm h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest pl-6">Book Info</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Pricing</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Rating</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Category</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Language</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id} className="group border-b last:border-0 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-10 rounded shadow-sm overflow-hidden relative border shrink-0">
                          <img src={book.image} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-tight line-clamp-1">{book.title}</span>
                          <span className="text-[11px] text-muted-foreground mt-0.5">
                            By {book.author}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-sm">₹{book.price}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                        <Star className="h-3 w-3 fill-current" />
                        {book.rating}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold border-muted-foreground/20 text-muted-foreground uppercase">
                        {book.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold">{book.language}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 bg-muted/20 border-t flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              Showing <span className="text-foreground font-bold">{filteredBooks.length}</span> books in library
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold gap-1 px-3" disabled>
                <ChevronLeft className="h-3 w-3" /> PREVIOUS
              </Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold gap-1 px-3">
                NEXT <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}