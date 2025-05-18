
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Deck, DeckTheme } from "@/types/types";

interface DeckFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (deck: Omit<Deck, "id" | "createdAt" | "cards">) => void;
  initialData?: Partial<Deck>;
}

export const DeckForm: React.FC<DeckFormProps> = ({
  open,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [theme, setTheme] = useState<DeckTheme>(initialData?.theme || "default");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process tags
    const tagsArray = tags
      .split(",")
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);
    
    onSave({
      name,
      description,
      tags: tagsArray,
      theme,
      lastStudied: initialData?.lastStudied || null,
      // Removing the cards property as it's already excluded in the type definition
    });
    
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Deck" : "Create New Deck"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Deck Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., JavaScript Fundamentals"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this deck about?"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., javascript, programming, web"
            />
          </div>
          
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={(value) => setTheme(value as DeckTheme)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="neon">Neon</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="notebook">Notebook</SelectItem>
                <SelectItem value="sci-fi">Sci-Fi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Deck" : "Create Deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
