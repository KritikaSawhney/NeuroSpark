
import React from "react";
import { Button } from "@/components/ui/button";
import { ReviewRating } from "@/types/types";

interface ReviewButtonsProps {
  onReview: (rating: ReviewRating) => void;
}

export const ReviewButtons: React.FC<ReviewButtonsProps> = ({ onReview }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Button
        variant="outline"
        className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border-red-200 dark:text-red-400 dark:border-red-950 flex flex-col py-6 transition-all duration-300 hover:scale-105 hover:shadow-md"
        onClick={() => onReview("again")}
      >
        <span className="text-lg">Again</span>
        <span className="text-xs opacity-75 mt-1">(&lt; 1 min)</span>
        <span className="text-xs text-muted-foreground mt-2">[1, A]</span>
      </Button>
      
      <Button
        variant="outline"
        className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-950 flex flex-col py-6 transition-all duration-300 hover:scale-105 hover:shadow-md"
        onClick={() => onReview("hard")}
      >
        <span className="text-lg">Hard</span>
        <span className="text-xs opacity-75 mt-1">(&lt; 1 day)</span>
        <span className="text-xs text-muted-foreground mt-2">[2, H]</span>
      </Button>
      
      <Button
        variant="outline"
        className="bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-200 dark:text-green-400 dark:border-green-950 flex flex-col py-6 transition-all duration-300 hover:scale-105 hover:shadow-md"
        onClick={() => onReview("good")}
      >
        <span className="text-lg">Good</span>
        <span className="text-xs opacity-75 mt-1">(~3 days)</span>
        <span className="text-xs text-muted-foreground mt-2">[3, G]</span>
      </Button>
      
      <Button
        variant="outline"
        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-950 flex flex-col py-6 transition-all duration-300 hover:scale-105 hover:shadow-md"
        onClick={() => onReview("easy")}
      >
        <span className="text-lg">Easy</span>
        <span className="text-xs opacity-75 mt-1">(~7 days)</span>
        <span className="text-xs text-muted-foreground mt-2">[4, E]</span>
      </Button>
    </div>
  );
};
