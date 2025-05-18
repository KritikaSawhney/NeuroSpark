
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Flashcard } from "@/types/types";

interface FlashcardFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (flashcard: Pick<Flashcard, "question" | "answer" | "tags">) => void;
  initialData?: Partial<Flashcard>;
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process tags
    const tagsArray = tags
      .split(",")
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);
    
    onSave({
      question,
      answer,
      tags: tagsArray,
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Flashcard" : "Create New Flashcard"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What do you want to remember?"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="The answer to your question"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., important, chapter1, difficult"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Card" : "Create Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
