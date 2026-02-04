"use client";

import { useState, useMemo } from "react";
import { getMediaItems, MediaItem } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Upload, 
  Trash2, 
  Download, 
  FileText, 
  ImageIcon, 
  File, 
  MoreVertical,
  Check,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>(getMediaItems());
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Deletion Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMedia = useMemo(() => {
    return media.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [media, search, filterType]);

  const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
  const paginatedMedia = filteredMedia.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      setMedia(media.filter(m => m.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'pdf': return <FileText className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Media Library</h1>
          <p className="text-muted-foreground text-sm">Upload and manage platform assets, icons, and documents.</p>
        </div>
        <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Upload className="h-4 w-4" />
          Upload Assets
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter by filename..." 
                  className="pl-10 rounded-xl bg-background border-none shadow-sm h-11"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-background p-1 rounded-xl border shadow-sm">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setViewMode('grid')}
                    className={cn("h-8 w-8 rounded-lg", viewMode === 'grid' && "bg-primary/10 text-primary")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setViewMode('list')}
                    className={cn("h-8 w-8 rounded-lg", viewMode === 'list' && "bg-primary/10 text-primary")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-background p-1.5 rounded-xl border">
                <Filter className="h-3 w-3 text-muted-foreground ml-2" />
                <select 
                  className="text-xs font-bold uppercase tracking-wider bg-transparent outline-none pr-2"
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Files</option>
                  <option value="image">Images Only</option>
                  <option value="pdf">PDF Documents</option>
                  <option value="other">Other Files</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={cn("p-6", viewMode === 'list' && "p-0")}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {paginatedMedia.map((item) => (
                <div key={item.id} className="group flex flex-col gap-2">
                  <div className="aspect-square relative rounded-2xl overflow-hidden border shadow-sm bg-muted/20 group-hover:shadow-md transition-all">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <div className="h-12 w-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                          {getIcon(item.type)}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">{item.type}</span>
                      </div>
                    )}
                    
                    {/* Floating Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" className="h-8 w-8 rounded-lg bg-white/90 text-foreground border shadow-sm backdrop-blur-md hover:bg-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="gap-2 text-xs font-bold uppercase"><Info className="h-3.5 w-3.5" /> Details</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-xs font-bold uppercase"><Download className="h-3.5 w-3.5" /> Download</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(item.id)}
                            className={cn(
                              "gap-2 text-xs font-bold uppercase transition-colors",
                              confirmDeleteId === item.id ? "text-destructive bg-destructive/10" : "text-destructive"
                            )}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {confirmDeleteId === item.id ? "Confirm Delete?" : "Delete File"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="px-1">
                    <p className="text-xs font-bold truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">{item.size}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">{item.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/10 border-b">
                  <tr>
                    <th className="text-left font-bold text-[10px] uppercase tracking-widest p-4 pl-6">Filename</th>
                    <th className="text-left font-bold text-[10px] uppercase tracking-widest p-4">Type</th>
                    <th className="text-left font-bold text-[10px] uppercase tracking-widest p-4">Size</th>
                    <th className="text-left font-bold text-[10px] uppercase tracking-widest p-4">Uploaded</th>
                    <th className="text-right font-bold text-[10px] uppercase tracking-widest p-4 pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedMedia.map((item) => (
                    <tr key={item.id} className="group hover:bg-muted/5 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted/30 border shrink-0">
                            {item.type === 'image' ? (
                              <img src={item.url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary/40">
                                {getIcon(item.type)}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-xs">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase text-muted-foreground">
                          {item.type}
                        </Badge>
                      </td>
                      <td className="p-4 text-[11px] font-semibold text-muted-foreground">{item.size}</td>
                      <td className="p-4 text-[11px] font-semibold text-muted-foreground">{item.createdAt}</td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(item.id)}
                            className={cn(
                              "h-8 w-8 rounded-lg transition-all",
                              confirmDeleteId === item.id 
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-16 px-2" 
                                : "hover:bg-destructive/10 hover:text-destructive"
                            )}
                          >
                            {confirmDeleteId === item.id ? <div className="flex items-center gap-1 text-[10px] font-bold"><Check className="h-3 w-3" /> YES</div> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredMedia.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">No assets found</h3>
              <p className="text-muted-foreground">Upload your first image or document to get started.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 bg-muted/10 border-t flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-bold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredMedia.length)}</span> of <span className="font-bold text-foreground">{filteredMedia.length}</span> assets
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button key={page} variant={currentPage === page ? "default" : "outline"} className={cn("h-8 w-8 rounded-lg text-xs font-bold", currentPage === page && "shadow-lg")} onClick={() => setCurrentPage(page)}>
                      {page}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
