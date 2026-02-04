
"use client";

import { BOOKS, Book } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  BookMarked, 
  Star, 
  Edit2,
  Trash2,
  Save,
  TrendingUp,
  Tag,
  Check
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [search, setSearch] = useState("");

  // Drawer State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Deletion Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredBooks = useMemo(() => {
    return books.filter(book => 
      book.title.toLowerCase().includes(search.toLowerCase()) || 
      book.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, search]);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setBooks(books.filter(b => b.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const handleSave = () => {
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? editingBook : b));
      setIsSheetOpen(false);
    }
  };

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
          { label: "Total Books", value: books.length.toString() + "+", icon: BookMarked, color: "text-blue-600", bg: "bg-blue-50" },
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
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(book)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(book.id)}
                          className={cn(
                            "h-8 w-8 rounded-lg transition-all",
                            confirmDeleteId === book.id 
                              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                              : "hover:bg-destructive/10 hover:text-destructive"
                          )}
                        >
                          {confirmDeleteId === book.id ? <div className="flex items-center gap-1 text-[10px] font-bold"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Book Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Edit Book Details</SheetTitle>
            <SheetDescription>Update book pricing, description, and metadata.</SheetDescription>
          </SheetHeader>
          
          {editingBook && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-book-title">Book Title</Label>
                <Input 
                  id="edit-book-title" 
                  value={editingBook.title} 
                  onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-book-author">Author</Label>
                <Input 
                  id="edit-book-author" 
                  value={editingBook.author} 
                  onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input 
                    type="number"
                    value={editingBook.price} 
                    onChange={(e) => setEditingBook({...editingBook, price: parseInt(e.target.value) || 0})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pages</Label>
                  <Input 
                    type="number"
                    value={editingBook.pages} 
                    onChange={(e) => setEditingBook({...editingBook, pages: parseInt(e.target.value) || 0})}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Input 
                  value={editingBook.language} 
                  onChange={(e) => setEditingBook({...editingBook, language: e.target.value})}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          <SheetFooter className="mt-8 gap-2">
            <SheetClose asChild>
              <Button variant="outline" className="w-full rounded-xl">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave} className="w-full gap-2 rounded-xl shadow-lg">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
