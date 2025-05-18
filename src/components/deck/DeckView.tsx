
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Search, ArrowLeft, Tag, Edit, Trash } from "lucide-react";
import { Flashcard as FlashcardType } from "@/types/types";
import { FlashcardForm } from "./FlashcardForm";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

interface DeckViewProps {
  deck: {
    id: string;
    name: string;
    description: string;
    cards: FlashcardType[];
    tags: string[];
  };
  onBack: () => void;
  onStudy: () => void;
  onAddCard: (card: Pick<FlashcardType, "question" | "answer" | "tags">) => void;
  onEditCard: (card: FlashcardType) => void;
  onDeleteCard: (cardId: string) => void;
}

export const DeckView: React.FC<DeckViewProps> = ({
  deck,
  onBack,
  onStudy,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardType | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedTag(null);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setSearchTerm("");
  };

  const handleEditCard = (card: FlashcardType) => {
    setEditingCard(card);
  };

  const filteredCards = deck.cards.filter((card) => {
    if (selectedTag) {
      return card.tags.includes(selectedTag);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        card.question.toLowerCase().includes(searchLower) ||
        card.answer.toLowerCase().includes(searchLower) ||
        card.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  // Get all unique tags across cards
  const allTags = [...new Set(
    deck.cards.flatMap(card => card.tags).concat(deck.tags)
  )];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back to Decks
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{deck.name}</h1>
            <p className="text-muted-foreground mt-1">{deck.description}</p>
          </div>
          <Button onClick={onStudy} className="w-full md:w-auto" disabled={deck.cards.length === 0}>
            <BookOpen size={18} className="mr-2" /> Study Deck
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Deck Overview</span>
              <Badge variant="outline" className="ml-2">
                {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {deck.tags.map(tag => (
                <Badge key={tag} variant="secondary">#{tag}</Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{deck.cards.length}</div>
                <div className="text-sm text-muted-foreground">Total Cards</div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {deck.cards.filter(c => c.repetitions > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Started</div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {deck.cards.filter(c => c.nextReview && c.nextReview < Date.now()).length}
                </div>
                <div className="text-sm text-muted-foreground">Due</div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {deck.cards.filter(c => c.repetitions >= 5).length}
                </div>
                <div className="text-sm text-muted-foreground">Mastered</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Flashcards</h2>
        <Button onClick={() => setShowAddCard(true)}>
          <Plus size={16} className="mr-2" /> Add Card
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
        
        <div className="flex-none overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
          <div className="inline-flex items-center gap-2">
            <Tag size={14} className="text-muted-foreground" />
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {filteredCards.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Question</TableHead>
                <TableHead className="w-[40%]">Answer</TableHead>
                <TableHead className="w-[20%]">Last Reviewed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.map((card) => (
                <TableRow key={card.id} className="group">
                  <TableCell className="font-medium">{card.question}</TableCell>
                  <TableCell>{card.answer}</TableCell>
                  <TableCell>
                    {card.lastReviewed 
                      ? formatDistanceToNow(card.lastReviewed, { addSuffix: true })
                      : "Never"
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden group-hover:flex h-8 w-8 p-0"
                        onClick={() => handleEditCard(card)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden group-hover:flex h-8 w-8 p-0 hover:text-red-500"
                        onClick={() => onDeleteCard(card.id)}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No cards found</p>
            <Button variant="outline" onClick={() => setShowAddCard(true)}>
              <Plus size={16} className="mr-2" /> Add your first card
            </Button>
          </CardContent>
        </Card>
      )}
      
      <FlashcardForm
        open={showAddCard}
        onClose={() => setShowAddCard(false)}
        onSave={onAddCard}
      />
      
      {editingCard && (
        <FlashcardForm
          open={!!editingCard}
          initialData={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={(updatedCard) => {
            onEditCard({ ...editingCard, ...updatedCard });
            setEditingCard(null);
          }}
        />
      )}
    </div>
  );
};
