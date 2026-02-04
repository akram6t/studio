"use client";

import { useState, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, ImageIcon, File, Check, Upload, Filter, Grid, List } from "lucide-react";
import { getMediaItems, MediaItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: MediaItem) => void;
  allowedTypes?: ('image' | 'pdf' | 'video' | 'other')[];
}

export function MediaLibraryDialog({ open, onOpenChange, onSelect, allowedTypes = ['image'] }: MediaLibraryDialogProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(getMediaItems());
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterType, setFilterFilterType] = useState<string>("all");

  const filteredItems = useMemo(() => {
    return mediaItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || item.type === filterType;
      const isAllowed = allowedTypes.includes(item.type);
      return matchesSearch && matchesType && isAllowed;
    });
  }, [mediaItems, search, filterType, allowedTypes]);

  const handleSelect = () => {
    const selected = mediaItems.find(m => m.id === selectedId);
    if (selected) {
      onSelect(selected);
      onOpenChange(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Media Library</DialogTitle>
              <DialogDescription>Select an existing asset or upload a new one.</DialogDescription>
            </div>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
              <Upload className="h-4 w-4" />
              Upload New
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-2 border-b flex flex-col md:flex-row gap-4 items-center bg-muted/10">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search media..." 
              className="pl-10 rounded-xl bg-background border-none shadow-sm h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-background p-1 rounded-xl border shrink-0">
            <button 
              onClick={() => setFilterFilterType("all")}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                filterType === "all" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
              )}
            >
              All
            </button>
            <button 
              onClick={() => setFilterFilterType("image")}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                filterType === "image" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
              )}
            >
              Images
            </button>
            <button 
              onClick={() => setFilterFilterType("pdf")}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                filterType === "pdf" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
              )}
            >
              PDFs
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                    selectedId === item.id 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-transparent bg-muted/20 hover:border-muted-foreground/30"
                  )}
                >
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                      <div className="h-12 w-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                        {getIcon(item.type)}
                      </div>
                      <span className="text-[10px] font-bold truncate w-full">{item.name}</span>
                    </div>
                  )}
                  
                  {/* Selection Overlay */}
                  {selectedId === item.id && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="bg-primary text-white p-1 rounded-full shadow-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {/* Info Badge */}
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge className="bg-black/60 text-white border-none text-[8px] px-1.5 py-0">
                      {item.size}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="font-bold text-lg">No media found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t bg-muted/5 gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
            Cancel
          </Button>
          <Button 
            disabled={!selectedId} 
            onClick={handleSelect}
            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
          >
            Select Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
