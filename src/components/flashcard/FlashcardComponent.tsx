
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flashcard } from "@/types/types";
import { Badge } from "@/components/ui/badge";

interface FlashcardComponentProps {
  card: Flashcard;
  flipped: boolean;
  onClick?: () => void;
}

export const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  card,
  flipped,
  onClick,
}) => {
  return (
    <div
      className={`relative card-3d w-full h-[420px] cursor-pointer ${
        flipped ? "flipped" : ""
      }`}
      onClick={onClick}
    >
      <Card className="card-front glass h-full flex flex-col">
        <CardContent className="flex flex-col items-center justify-center h-full p-8">
          <div className="text-2xl font-medium mb-6">{card.question}</div>
          <div className="mt-auto flex flex-wrap gap-2 justify-center">
            {card.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-back glass h-full flex flex-col">
        <CardContent className="flex flex-col h-full p-8 justify-center">
          <div className="text-muted-foreground mb-4 text-sm">Question:</div>
          <div className="text-lg mb-6">{card.question}</div>
          <div className="text-muted-foreground mb-2 text-sm">Answer:</div>
          <div className="text-xl font-medium overflow-auto">{card.answer}</div>
        </CardContent>
      </Card>
    </div>
  );
};
