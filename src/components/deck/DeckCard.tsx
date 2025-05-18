
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Settings, Trash, Edit } from "lucide-react";
import { Deck } from "@/types/types";
import { getReviewStatus } from "@/utils/srsAlgorithm";
import { formatDistanceToNow } from "date-fns";

interface DeckCardProps {
  deck: Deck;
  onStudy: (deckId: string) => void;
  onEdit: (deckId: string) => void;
  onDelete: (deckId: string) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({ deck, onStudy, onEdit, onDelete }) => {
  const { dueCount, learningCount, masteredCount } = getReviewStatus(deck.cards);
  
  const getThemeClasses = () => {
    switch (deck.theme) {
      case "neon":
        return "bg-gradient-to-br from-neuro-purple to-blue-400 border-neuro-purple/50";
      case "minimal":
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
      case "notebook":
        return "bg-neuro-soft-yellow border-amber-300 bg-[linear-gradient(transparent_31px,#DDDDDD_0px)] bg-[size:100%_32px]";
      case "sci-fi":
        return "bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-500";
      default:
        return "bg-gradient-to-br from-white to-neuro-soft-purple dark:from-gray-800 dark:to-gray-900 border-neuro-purple/20";
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${getThemeClasses()}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className={deck.theme === "neon" ? "text-white" : ""}>{deck.name}</span>
          <span 
            className={`text-sm px-2 py-1 rounded ${
              dueCount > 0 
                ? "bg-red-500 text-white" 
                : "bg-green-500/10 text-green-700 dark:text-green-300"
            }`}
          >
            {dueCount > 0 ? `${dueCount} due` : "All caught up"}
          </span>
        </CardTitle>
        <CardDescription className={deck.theme === "neon" ? "text-white/80" : ""}>
          {deck.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{deck.cards.length}</div>
            <div className="text-xs text-muted-foreground">Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{learningCount}</div>
            <div className="text-xs text-muted-foreground">Learning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{masteredCount}</div>
            <div className="text-xs text-muted-foreground">Mastered</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {deck.tags.map((tag) => (
            <span 
              key={tag} 
              className={`text-xs px-2 py-1 rounded-full ${
                deck.theme === "neon"
                  ? "bg-white/20 text-white"
                  : "bg-neuro-soft-blue dark:bg-blue-900/40 text-blue-800 dark:text-blue-300"
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          {deck.lastStudied 
            ? `Studied ${formatDistanceToNow(deck.lastStudied)} ago` 
            : "Never studied"}
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onDelete(deck.id)}
            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-300"
          >
            <Trash size={15} />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(deck.id)}>
            <Edit size={15} />
          </Button>
          <Button size="sm" onClick={() => onStudy(deck.id)}>
            <BookOpen size={15} className="mr-1" /> Study
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
